// import request from '../common/Request'
import config from '../config/Config'
import _ from 'lodash'
import RNFetchBlob from 'rn-fetch-blob'

export const baseCacheDir = RNFetchBlob.fs.dirs.CacheDir + '/imagesCacheDir';

export const clearCache=() =>{
    return RNFetchBlob.fs.unlink(baseCacheDir)
      .catch(() => {
        // swallow exceptions if path doesn't exist
      })
      .then(() => ensurePath(baseCacheDir));
  }

export const  collectFilesInfo=(basePath)=> {
    return RNFetchBlob.fs.stat(basePath)
      .then((info) => {
        if (info.type === 'file') {
          return [info];
        }
        return RNFetchBlob.fs.ls(basePath)
          .then(files => {
            const promises = _.map(files, file => {
              return collectFilesInfo(`${basePath}/${file}`);
            });
            return Promise.all(promises);
          });
      })
      .catch(err => {
        return [];
      });
  }
/**
 * Return info about the cache, list of files and the total size of the cache.
 * @returns {Promise.<{size}>}
 */
function getCacheInfo() {
    return ensurePath(baseCacheDir)
      .then(() => collectFilesInfo(baseCacheDir))
      .then(cache => {
        const files = _.flattenDeep(cache);
        const size = _.sumBy(files, 'size');
        return {
          files,
          size
        };
      });
  }
export const getSuffix=(uri)=>{
    if (uri.match('^\\S+\\.\\S+$')) {
      let array = uri.split(".");
      if (array.length > 0) {
        return array[array.length - 1];
      }
      else {
        return ''
      }
    } else {
      return ''
    }
  }

export const getFileName=(uri)=>{
    if (uri.match('^\\S+/\\S+$')) {
        let array = uri.split("/");
        if (array.length > 0) {
          return array[array.length - 1];
        }
        else {
          return ''
        }
      } else {
        return ''
      }
  }



 export const deleteFile=(filePath) =>{
    return RNFetchBlob.fs.stat(filePath)
      .then(res => res && res.type === 'file')
      .then(exists => exists && RNFetchBlob.fs.unlink(filePath))
      .catch((err) => {
        // swallow error to always resolve
      });
  }
  
export const  getDirPath=(filePath)=> {
    return _.initial(filePath.split('/')).join('/');
  }
  
export const ensurePath=(dirPath)=> {
    return RNFetchBlob.fs.isDir(dirPath)
      .then(exists =>
        !exists && RNFetchBlob.fs.mkdir(dirPath)
      )
      .catch(err => {
        // swallow folder already exists errors
        if (err.message.includes('folder already exists')) {
          return;
        }
        throw err;
      });
  }

  
export const downloadFile =(url,filepath,onProgress,onFinish)=>
    RNFetchBlob
    .config({
    // add this option that makes response data to be stored as a file,
    // this is much more performant.
        path:filepath
    })
    .fetch('GET', url, {
        //some headers ..
    })
    .progress((received, total) => {
        onProgress && onProgress(received,total)
    })
    .then(res=>{
        onFinish && onFinish(url,res);
    })

    //files:[{url:"http://xxxx.jpg",path:dir/filename}]
export const downloadFiles=(files,onProgress,onFinish)=>{

    let promiseArray = [];
    let progessInfo = {};

    const onAggrigateProgress = (uri, evt) => {
        progessInfo[uri].received = evt.received;
        progessInfo[uri].total = evt.total;

        let loaded = 0;
        let total = 0;
        const values = _.values(progessInfo);

        let acc=values.reduce(
            (accumulator, currentValue) =>{
                taotal:accumulator.total+currentValue.total
                received:accumulator.received+currentValue.received
            }
        )
        onProgress && onProgress(acc.received/ acc.total)
        if(acc.received>=acc.total)
            onFinish&& onFinish(acc.received);

    };
    files.forEach(file => {
        promiseArray.push( downloadFile(file.url,file.path,onAggrigateProgress))
    });
    return promiseArray;
}

//file={ name: 'avatar-foo', filename: 'avatar-foo.png', type: 'image/foo',path:'/data/avatar-foo.png'}
export const uploadFile=(file,onProgress,onFinish)=>
    RNFetchBlob.fetch('POST', url, {
    // header...
    'Content-Type': 'multipart/form-data'
    }, [
      // path是指文件的路径，wrap方法可以根据文件路径获取到文件信息
      { name: file.name, filename: file.filename, type:file.type, data: RNFetchBlob.wrap(file.path) },
      //... 可能还会有其他非文件字段{name:'字段名',data:'对应值'}
    ])
    .uploadProgress((written, total) => {
        onProgress && onProgress(file,written,total)
    })
    .then((res) => {
        onFinish && onFinish(file,res)
    }).catch((err) => {
        console.log('err', err)
    })

    
export const uploadFiles = (uri, host, formInput, onprogress) => {
    let promiseArray = [];
    let progessInfo = {};

    const onAggrigateProgress = (file, evt) => {
        progessInfo[file.name].written = evt.written;
        progessInfo[file.name].total = evt.total;

        let loaded = 0;
        let total = 0;
        const values = _.values(progessInfo);

        let acc=values.reduce(
            (accumulator, currentValue) =>{
                taotal:accumulator.total+currentValue.total
                received:accumulator.written+currentValue.written
            }
        )
        onProgress && onProgress(acc.written/ acc.total)
        if(acc.written>=acc.total)
            onFinish&& onFinish(acc.written);
    };
    files.forEach(file => {
        promiseArray.push( uploadFile(file,onAggrigateProgress))
    });
    return promiseArray;
};

export const isLocalFile = (url) => {
  if (!_.isString(url))
    return false;
  url = url.toLowerCase();
  return _.startsWith(url, 'file://') || _.startsWith(url, 'content://') || _.startsWith(url, 'data:image');
};

export const isOSSFile = (url) => {
  if (!_.isString(url))
    return false;
  url = url.toLowerCase();
  return !_.startsWith(url, 'http://') && !_.startsWith(url, 'https://');
};

export const getImageUri = (url) => {
  return isLocalFile(url) ? url : (isOSSFile(url) ? `${config.OSS.photo}${url}` : url);
};

export const getImageThumbUri = (url) => {
  return isLocalFile(url) ? url : (isOSSFile(url) ? `${config.OSS.photo}${url}${config.OSS.photoThumb}` : url);
};

export const getVideoUri = (url) => {
  return isLocalFile(url) ? url : (isOSSFile(url) ? `${config.OSS.video}${url}` : url);
};

export const getVideoAvvodUri = (url) => {
  return isLocalFile(url) ? url : (isOSSFile(url) ? `${config.OSS.video}${url}${iOS ? config.OSS.avvod : ''}` : url);
}

export const getAudioUri = (url) => {
  return isLocalFile(url) ? url : (isOSSFile(url) ? `${config.OSS.audio}${url}` : url);
};

export const getVideoThumbUri = (url) => {
  return isLocalFile(url) ? url : (isOSSFile(url) ? `${config.OSS.video}${url}${config.OSS.videoThumb}` : url);
};


