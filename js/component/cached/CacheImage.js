'use strict';

import _ from 'lodash';
import React from 'react';
import ReactNative from 'react-native';
import * as CacheProvider from './CacheProvider'
import * as Progress from 'react-native-progress';
import config from '../../config/Config';
import PropTypes from 'prop-types';
import * as  FileUtils from '../../utils/FileUtils'
import { Icon } from 'native-base';
import {
  View
} from 'react-native'

import NetInfo from "@react-native-community/netinfo";

const flattenStyle = ReactNative.StyleSheet.flatten;
const {
  Image,
  Platform
} = ReactNative;

const {
  StyleSheet
} = ReactNative;

const styles = StyleSheet.create({
  image: {
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center'
  },
  loader: {
    backgroundColor: 'transparent',
  },
  loaderPlaceholder: {
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

function getImageProps(props) {
  return _.omit(props, ['source', 'showIndicator', 'defaultSource', 'errorSource', 'activityIndicatorProps', 'style', 'useQueryParamsInCacheKey', 'renderImage', 'resolveHeaders']);
}

const CACHED_IMAGE_REF = 'cachedImage';

export default class CachedImage extends React.Component {
  static propTypes = {
    renderImage: PropTypes.func.isRequired,
    showIndicator: PropTypes.bool,
    activityIndicatorProps: PropTypes.object.isRequired,
    useQueryParamsInCacheKey: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.array
    ]).isRequired,
    resolveHeaders: PropTypes.func,
    defaultSource: Image.propTypes.source,
    errorSource: Image.propTypes.source,
    showOriginal: PropTypes.bool,
  }

  static defaultProps = {
    renderImage: (props) => {
      let imgControl=(<Image ref={CACHED_IMAGE_REF} {...props}/>)
      return imgControl;
    },
    renderIcon: (props) => {
      let imgControl=(
        <View {...props} style={[{...props.style},{alignItems:'center',justifyContent:'center'}]}>
         <Icon ref={CACHED_IMAGE_REF} style={{alignSelf:'center',fontSize:80,width:70}} name={props.name} type={props.type}/>
        </View>
        )
      return imgControl;
    },
    showIndicator: false,
    activityIndicatorProps: {color: '#fff'},
    useQueryParamsInCacheKey: true,
    resolveHeaders: () => Promise.resolve({}),
    showOriginal: false,
    errorSource:require("../../assets/pengyouquan.png")
  }

  setNativeProps = (nativeProps) => {
    try {
      if (this.refs[CACHED_IMAGE_REF])
        this.refs[CACHED_IMAGE_REF].setNativeProps(nativeProps);
    } catch (e) {
      console.error(e);
    }
  }

  constructor(props) {
    super(props)
    this._isMounted = false;
    this.state = {
      isCacheable: false,
      cachedImagePath: null,
      networkAvailable: true,
      progress: 0,
      isError: false
    };
    console.log('init img:',this.props.source.uri,this.state)
  }

  safeSetState = (newState) => {
    if (!this._isMounted) {
      return;
    }
    return this.setState(newState);
  }

  componentWillMount() {
    console.log('mount img ',this.props.source.uri)
    this._isMounted = true;
    NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectivityChange);
    // initial
    NetInfo.isConnected.fetch()
      .then(isConnected => {
        this.safeSetState({
          networkAvailable: isConnected
        });
      });
    this.processSource(this.props.source);
  }

  componentWillUnmount() {
    this._isMounted = false;
    NetInfo.isConnected.removeEventListener('change', this.handleConnectivityChange);
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(this.props.source, nextProps.source) || this.props.showOriginal !== nextProps.showOriginal) {
      this.processSource(nextProps.source);
    }
  }

  handleConnectivityChange = (data) => {
    this.safeSetState({
      networkAvailable: (data.type=='none'||data.type=='unknown')?false:true
    });
  }

  processSource = (source) => {
    let url = _.get(source, ['uri'], null);
    if (FileUtils.isLocalFile(url)) {
      this.safeSetState({
        cachedImagePath: null,
        isCacheable: false,
        isError: false
      });
      return;
    }

    // if (isOSSFile(url)) {
    //   url = config.OSS.photo + url;
    //   if (!this.props.showOriginal)
    //     url = url + config.OSS.photoThumb;
    // }

    if (CacheProvider.isCacheable(url)) {
      //add progress listener
      if (this.props.showIndicator) {
        CacheProvider.addListener(url, this.progressListener);
      }
      const options = _.pick(this.props, ['useQueryParamsInCacheKey', 'cacheGroup']);
      // try to get the image path from cache
      CacheProvider.getCachedPath(url, options)
      // try to put the image in cache if
        .catch(
          () => 
          {
            console.log('begin to cache,url ',url)
            return  CacheProvider.cacheFile(url, options, this.props.resolveHeaders)
          }
          )
        .then(
          cachedImagePath => {
            {
              let x=this.state;
              this.safeSetState({
                cachedImagePath
              });
              console.log('cached image and change state ',url,cachedImagePath)
            }
          
        })
        .catch(err => {
          this.safeSetState({
            cachedImagePath: null,
            isCacheable: false,
            isError: true
          });
        })
        .finally(() => {
          if (this.props.showIndicator) {
            CacheProvider.removeListener(url, this.progressListener);
          }
        });
        // console.log('init state of url',url)
        this.safeSetState({
          cachedImagePath: null,
          isCacheable: true,
          isError: false
        });
    } else {
      // console.log('source is not cachable!',url)
      this.safeSetState({
        cachedImagePath: null,
        isCacheable: false,
        isError: true
      });
    }
  }

  progressListener = (progress) => {
    this.safeSetState({progress});
  }

  getCachedImagePath = () => {
    if (this.state.cachedImagePath)
      return 'file://' + this.state.cachedImagePath;
    return null;
  }

  render() {
    // console.log('render url:',this.props.source,this.state)
    
    if (this.state.isCacheable && !this.state.cachedImagePath) {
      return this.renderLoader();
    }
    const props = getImageProps(this.props);
    const style = this.props.style || styles.image;
    const source = (this.state.isCacheable && this.state.cachedImagePath) ? {
      uri: 'file://' + this.state.cachedImagePath
    } : this.props.source;
    if(this.props.source.uri==config.flags.plus)
    {
        const aprops={
          ...props,
          name:'plus',
          type:'EvilIcons',
        }
      return this.props.renderIcon({
        ...aprops,
        key: aprops.key ,
        style,
        source: this.state.isError ? this.props.errorSource : source
      });
    }
    // if(CacheProvider.isIcon( this.props.source.uri))
    // {
    //   iconUri=_.trimStart(this.props.source.uri,'icon://');
    //   iconParts=_.split(iconUri,'@');
    //   if(iconParts.length>1){
    //     props={
    //       ...props,
    //       name:iconParts[0],
    //       type:iconParts[1],
    //     }
    //   }
    //   else
    //   {
    //     props={
    //       ...props,
    //       name:iconUri
    //     }
    //   }
    //   return this.props.rednerIcon({
    //     ...props,
    //     key: props.key || source.uri,
    //     style,
    //     source: this.state.isError ? this.props.errorSource : source
    //   });
    

    return this.props.renderImage({
      ...props,
      key: props.key || source.uri,
      style,
      source: this.state.isError ? this.props.errorSource : source
    });
  }

  renderLoader = () => {
    const imageProps = getImageProps(this.props);
    const imageStyle = [this.props.style, styles.loaderPlaceholder];

    const activityIndicatorProps = _.omit(this.props.activityIndicatorProps, ['style', 'progress']);
    const activityIndicatorStyle = this.props.activityIndicatorProps.style || styles.loader;

    const source = this.props.defaultSource;

    // if the imageStyle has borderRadius it will break the loading image view on android
    // so we only show the ActivityIndicator
    if (!source) {//|| (Platform.OS === 'android' && flattenStyle(imageStyle).borderRadius)) {
      return (
        this.props.showIndicator ?
          <Progress.Pie
            {...activityIndicatorProps}
            progress={this.state.progress}
            style={[imageStyle, activityIndicatorStyle]}/> : null
      );
    }
    // otherwise render an image with the defaultSource with the ActivityIndicator on top of it
    return this.props.renderImage({
      ...imageProps,
      style: imageStyle,
      key: source.uri,
      source,
      children: (
        this.props.showIndicator ?
          <Progress.Pie
            {...activityIndicatorProps}
            progress={this.state.progress}
            style={activityIndicatorStyle}/> : null
      )
    });
  }
}

/**
 * Same as ReactNaive.Image.getSize only it will not download the image if it has a cached version
 * @param uri
 * @param success
 * @param failure
 * @param options
 */
CachedImage.getSize = function getSize(uri, success, failure, options) {
  if (CacheProvider.isCacheable(uri)) {
    CacheProvider.getCachedPath(uri, options)
      .then(imagePath => {
        if (Platform.OS === 'android') {
          imagePath = 'file://' + imagePath;
        }
        Image.getSize(imagePath, success, failure);
      })
      .catch(err => {
        Image.getSize(uri, success, failure);
      });
  } else {
    Image.getSize(uri, success, failure);
  }
};