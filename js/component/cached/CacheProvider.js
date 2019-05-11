'use strict';

import _ from 'lodash';
import RNFetchBlob from 'rn-fetch-blob'
const {
  fs
} = RNFetchBlob;

import SHA1 from "crypto-js/sha1"
import URL  from 'url-parse';
import {EventEmitter} from 'events';
import * as FileUtils from '../../utils/FileUtils'
import config from '../../config/Config'
const defaultHeaders = {};
// const defaultImageTypes = ['png', 'jpeg', 'jpg', 'gif', 'bmp', 'tiff', 'tif'];
const defaultResolveHeaders = _.constant(defaultHeaders);

const defaultOptions = {
  useQueryParamsInCacheKey: false
};

const activeDownloads = {};
const emitter = new EventEmitter();

function serializeObjectKeys(obj) {
  return _(obj)
    .toPairs()
    .sortBy(a => a[0])
    .map(a => a[1])
    .value();
}

function getQueryForCacheKey(url, useQueryParamsInCacheKey) {
  if (_.isArray(useQueryParamsInCacheKey)) {
    return serializeObjectKeys(_.pick(url.query, useQueryParamsInCacheKey));
  }
  if (useQueryParamsInCacheKey) {
    return serializeObjectKeys(url.query);
  }
  return '';
}

function generateCacheKey(url, options) {
  const parsedUrl = new URL(url, null, true);

  const pathParts = parsedUrl.pathname.split('/');

  // last path part is the file name
  const fileName = pathParts.pop();
  const filePath = pathParts.join('/');

  const parts = fileName.split('.');
  const fileType = parts.length > 1 ? _.toLower(parts.pop()) : '';
  // const type = defaultImageTypes.includes(fileType) ? fileType : 'jpg';

  const cacheable = filePath + fileName  + getQueryForCacheKey(parsedUrl, options.useQueryParamsInCacheKey);
  return SHA1(cacheable) + (fileType==''? '':( '.' + fileType));
}

function getCachePath(url, options) {
  if (options.cacheGroup) {
    return options.cacheGroup;
  }
  const {
    host
  } = new URL(url);
  return host.replace(/[^a-z0-9]/gi, '').toLowerCase();
}

function getCachedFilePath(url, options) {
  const cachePath = getCachePath(url, options);
  const cacheKey = generateCacheKey(url, options);

  return `${FileUtils.baseCacheDir}/${cachePath}/${cacheKey}`;
}

/**
 * returns a promise that is resolved when the download of the requested file
 * is complete and the file is saved.
 * if the download fails, or was stopped the partial file is deleted, and the
 * promise is rejected
 * @param fromUrl   String source url
 * @param toFile    String destination path
 * @param headers   Object headers to use when downloading the file
 * @returns {Promise}
 */
function downloadFile(fromUrl, toFile, headers = {}) {
  // use toFile as the key as is was created using the cacheKey
  if (!_.has(activeDownloads, toFile)) {
    // create an active download for this file
    const tmpFile = toFile + '.tmp';
    activeDownloads[toFile] = new Promise((resolve, reject) => {
      console.log('start download ',fromUrl)
      RNFetchBlob
        .config({path: tmpFile,timeout:config.file.downloadTimeout})
        .fetch('GET', fromUrl, headers)
        // listen to download progress event, every 10%
        .progress({interval: 250}, (received, total) => {
          emitter.emit(fromUrl, received / total)
        })
        .then(res => {
          if (Math.floor(res.respInfo.status / 100) !== 2) {
            console.log('Failed to successfully download file',fromUrl)
            throw new Error('Failed to successfully download file');
          }
          console.log('success download ',fromUrl,toFile)
          return fs.mv(tmpFile, toFile);
        })
        .then(() => {
          console.log('success end ',fromUrl,toFile)
          resolve(toFile);
          })
        .catch(err => {
          return FileUtils.deleteFile(tmpFile)
            .finally(
              () => {
                reject(err)
              }
            );
        })
        .finally(() => {
          // cleanup
          delete activeDownloads[toFile];
          emitter.removeAllListeners(fromUrl);
        });
    });
  }
  return activeDownloads[toFile];
}

function createPrefetcer(list) {
  const urls = _.clone(list);
  return {
    next() {
      return urls.shift();
    }
  };
}
//串行下载
function runPrefetchTask(prefetcher, options) {
  const url = prefetcher.next();
  if (!url) {
    return Promise.resolve();
  }
  // if url is cacheable - cache it
  if (isCacheable(url)) {
    // check cache
    return getCachedPath(url, options)
    // if not found download
      .catch(() => cacheFile(url, options))
      // allow prefetch task to fail without terminating other prefetch tasks
      .catch(_.noop)
      // then run next task
      .then(() => runPrefetchTask(prefetcher, options));
  }
  // else get next
  return runPrefetchTask(prefetcher, options);
}

//串行下载
function runPrefetchTaskEx(prefetcher, options) {
  const url = prefetcher.next();
  if (!url) {
    return Promise.resolve();
  }
  // if url is cacheable - cache it
  if (url.remote && isCacheable(url.remote) && url.local) {
     // check cache
     return getCachedPath(url.remote, options)
     // if not found download
       .catch(() => cacheLocalFile(url.remote,url.local, options))
       // allow prefetch task to fail without terminating other prefetch tasks
       .catch(_.noop)
       // then run next task
       .then(() => {
         console.log('next from ',url)     
         runPrefetchTaskEx(prefetcher, options)
       });
  }
  else{
    // check cache
    return getCachedPath(url, options)
    // if not found download
      .catch(() => cacheFile(url, options))
      // allow prefetch task to fail without terminating other prefetch tasks
      .catch(_.noop)
      // then run next task
      .then(() => runPrefetchTaskEx(prefetcher, options));
  }
  // else get next
  return runPrefetchTaskEx(prefetcher, options);
}


// API

/**
 * Check whether a url is cacheable.
 * Takes an file source and if it's a valid url return `true`
 * @param url
 * @returns {boolean}
 */
function isCacheable(url) {
  return _.isString(url) && (_.startsWith(url, 'http://') || _.startsWith(url, 'https://'));
}
function isIcon(url) {
  return _.isString(url) && (_.startsWith(url, 'icon://'));
}
/**
 * Get the local path corresponding to the given url and options.
 * @param url
 * @param options
 * @returns {Promise.<String>}
 */
function getCachedPath(url, options = defaultOptions) {
  const filePath = getCachedFilePath(url, options);
  console.log('getCachedPath ',url,"=>",filePath)
  return fs.stat(filePath)
    .then(res => {
      if (res.type !== 'file') {
        // reject the promise if res is not a file
        throw new Error('Failed to get file from cache');
      }
      if (!res.size) {
        // something went wrong with the download, file size is 0, remove it
        return FileUtils.deleteFile(filePath)
          .then(() => {
            throw new Error('Failed to get file from cache');
          });
      }
      return filePath;
    })
    .catch(err => {
      throw err;
    })
}

/**
 * Download the file to the cache and return the local file path.
 * @param url
 * @param options
 * @param resolveHeaders
 * @returns {Promise.<String>}
 */
function cacheFile(url, options = defaultOptions, resolveHeaders = defaultResolveHeaders) {
  const filePath = getCachedFilePath(url, options);
  const dirPath = FileUtils.getDirPath(filePath);
  return FileUtils.ensurePath(dirPath)
    .then(() => resolveHeaders())
    .then(headers => downloadFile(url, filePath, headers));
}

async function cacheLocalFile(url,localUrl, options = defaultOptions, resolveHeaders = defaultResolveHeaders){
  const   filePath = getCachedFilePath(url, options);
  const   dirPath = FileUtils.getDirPath(filePath);
  localUrl=FileUtils.cleanLocalFilePath(localUrl)
  await  fs.exists(filePath).then(exists=>{
    if(!exists)
    {
      return FileUtils.ensurePath(dirPath)
      .then(
        ()=>fs.cp(localUrl,filePath)
        .catch(err=>{
          if(err.message.includes('already exists'))
          {

          }else
          {
            throw err;
          }
        })
        .then(
          ()=>{console.table('file copy ',url,localUrl,filePath);}
        )
        .catch(
          (err)=>{
            console.log('cacheLocalFile '+url +' from '+localUrl+' to '+filePath+' fail!',err )
          }
        )
      )
      .catch(
        (err)=>{
          console.log('ensurePath '+dirPath+' failed',err)
        }
      )
    }
    else
    {
      console.table('file exist ',url,localUrl,filePath);
    }
  })
  
}
/**
 * Delete the cached file corresponding to the given url and options.
 * @param url
 * @param options
 * @returns {Promise}
 */
function deleteCachedFile(url, options = defaultOptions) {
  const filePath = getCachedFilePath(url, options);
  return FileUtils.deleteFile(filePath);
}

/**
 * Cache an array of urls.
 * Usually used to prefetch files.
 * @param urls
 * @param options
 * @returns {Promise}
 */
function cacheMultipleFiles(urls, options = defaultOptions) {
  const prefetcher = createPrefetcer(urls);
  const numberOfWorkers = urls.length;
  const promises = _.times(numberOfWorkers, () =>
    runPrefetchTaskEx(prefetcher, options)
  );
  return Promise.all(promises);
}

/**
 * Delete an array of cached files by their urls.
 * Usually used to clear the prefetched files.
 * @param urls
 * @param options
 * @returns {Promise}
 */
function deleteMultipleCachedFiles(urls, options = defaultOptions) {
  return _.reduce(urls, (p, url) =>
      p.then(() => deleteCachedFile(url, options)),
    Promise.resolve()
  );
}

/**
 * Seed the cache of a specified url with a local file
 * Handy if you have a local copy of a remote file, e.g. you just uploaded local to url.
 * @param local
 * @param url
 * @param options
 * @returns {Promise}
 */
function seedCache(local, url, options = defaultOptions) {
  const filePath = getCachedFilePath(url, options);
  const dirPath = FileUtils.getDirPath(filePath);
  return FileUtils.ensurePath(dirPath)
    .then(() => RNFetchBlob.fs.cp(local, filePath))
}

function removeListener(event, listener) {
  emitter.removeListener(event, listener)
}

function addListener(event, listener) {
  emitter.addListener(event, listener)
}

module.exports = {
  isCacheable,
  isIcon,
  addListener,
  removeListener,
  getCachedPath,
  cacheFile,

  deleteCachedFile,
  cacheMultipleFiles,
  deleteMultipleCachedFiles,
  seedCache ,
  cacheLocalFile
};
