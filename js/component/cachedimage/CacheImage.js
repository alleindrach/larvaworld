'use strict';

import _ from 'lodash';
import React from 'react';
import ReactNative from 'react-native';
import * as ImageCacheProvider from './ImageCacheProvider'
import * as Progress from 'react-native-progress';
import config from '../../config/Config';
import {isLocalFile, isOSSFile} from '../../utils/Qiniu';

const flattenStyle = ReactNative.StyleSheet.flatten;
const {
  Image,
  NetInfo,
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
    renderImage: React.PropTypes.func.isRequired,
    showIndicator: React.PropTypes.bool,
    activityIndicatorProps: React.PropTypes.object.isRequired,
    useQueryParamsInCacheKey: React.PropTypes.oneOfType([
      React.PropTypes.bool,
      React.PropTypes.array
    ]).isRequired,
    resolveHeaders: React.PropTypes.func,
    defaultSource: Image.propTypes.source,
    errorSource: Image.propTypes.source,
    showOriginal: React.PropTypes.bool,
  }

  static defaultProps = {
    renderImage: props => (<Image ref={CACHED_IMAGE_REF} {...props}/>),
    showIndicator: false,
    activityIndicatorProps: {color: '#fff'},
    useQueryParamsInCacheKey: true,
    resolveHeaders: () => Promise.resolve({}),
    showOriginal: false
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
  }

  safeSetState = (newState) => {
    if (!this._isMounted) {
      return;
    }
    return this.setState(newState);
  }

  componentWillMount() {
    this._isMounted = true;
    NetInfo.isConnected.addEventListener('change', this.handleConnectivityChange);
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

  handleConnectivityChange = (isConnected) => {
    this.safeSetState({
      networkAvailable: isConnected
    });
  }

  processSource = (source) => {
    let url = _.get(source, ['uri'], null);
    if (isLocalFile(url)) {
      this.safeSetState({
        cachedImagePath: null,
        isCacheable: false,
        isError: false
      });
      return;
    }

    if (isOSSFile(url)) {
      url = config.OSS.photo + url;
      if (!this.props.showOriginal)
        url = url + config.OSS.photoThumb;
    }

    if (ImageCacheProvider.isCacheable(url)) {
      //add progress listener
      if (this.props.showIndicator) {
        ImageCacheProvider.addListener(url, this.progressListener);
      }
      const options = _.pick(this.props, ['useQueryParamsInCacheKey', 'cacheGroup']);
      // try to get the image path from cache
      ImageCacheProvider.getCachedImagePath(url, options)
      // try to put the image in cache if
        .catch(() => ImageCacheProvider.cacheImage(url, options, this.props.resolveHeaders))
        .then(cachedImagePath => {
          this.safeSetState({
            cachedImagePath
          });
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
            ImageCacheProvider.removeListener(url, this.progressListener);
          }
        });
      this.safeSetState({
        cachedImagePath: null,
        isCacheable: true,
        isError: false
      });
    } else {
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
    if (this.state.isCacheable && !this.state.cachedImagePath) {
      return this.renderLoader();
    }
    const props = getImageProps(this.props);
    const style = this.props.style || styles.image;
    const source = (this.state.isCacheable && this.state.cachedImagePath) ? {
      uri: 'file://' + this.state.cachedImagePath
    } : this.props.source;
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
  if (ImageCacheProvider.isCacheable(uri)) {
    ImageCacheProvider.getCachedImagePath(uri, options)
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