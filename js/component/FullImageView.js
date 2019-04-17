
import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  StatusBar,
  CameraRoll
} from 'react-native'
import AlbumView from 'teaset/components/AlbumView/AlbumView'
import Overlay from 'teaset/components/Overlay/Overlay'
import ActionSheet from 'react-native-actionsheet'
import CachedImage from '../component/cached/CacheImage'
import * as CacheProvider from '../component/cached/CacheProvider'
import Toast from 'teaset/components/Toast/Toast'
import Icon from 'react-native-vector-icons/Ionicons'
import Permissions from 'react-native-permissions'
import * as  FileUtils from '../utils/FileUtils'

export default class FullImageView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      images: []
    }
  }

  _showActionSheet = () => {
    if (this._actionSheet) {
      this._actionSheet.show()
    }
  }

  _actionSheetPress = (buttonIndex) => {
    if (buttonIndex === 0) {
      //下载图片
      const {index, images} = this.state
      let url = images[index];

      if (FileUtils.isLocalFile(url)) {
        this._savePhoto(url)
        return;
      }
      else {
        // url = getImageThumbUri(url)
        ImageCacheProvider.getCachedImagePath(url)
          .catch(() => ImageCacheProvider.cacheImage(url))
          .then(cachedImagePath => {
            this._savePhoto(cachedImagePath)
          })
          .catch(err => {
            Toast.fail('保存失败')
            console.log(err)
          });
      }
    }
  }

  _savePhoto = (filePath) => {
    Permissions.request('photo')
      .then(response => {
        //response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
        if (response === 'denied' || response === 'undetermined') {
          Toast.fail('保存失败，您没有授权App访问您的相册')
        } else {
          CameraRoll.saveToCameraRoll(filePath, 'photo')
            .then(() => {
              Toast.success('保存成功')
            })
            .catch((err) => {
              Toast.fail('保存失败，原因是：' + err.message)
            });
        }
      });
  }

  close = () => {
    this._fullImageView && this._fullImageView.close()
  }

  show = (customBounds, images, startIndex) => {
    let cacheImageArr = images.map((uri, index) => <CachedImage source={{uri}} showIndicator={true} key={index}
                                                                style={{width: SCREEN_WIDTH, height: SCREEN_HEIGHT}}
                                                                resizeMode="contain" showOriginal={true}/>)
    let overlayView = (
      <Overlay.PopView
        containerStyle={{flex: 1}}
        overlayOpacity={1}
        type='custom'
        customBounds={customBounds}
        ref={v => this._fullImageView = v}
      >
        <AlbumView
          style={{flex: 1}}
          control={true}
          images={cacheImageArr}
          defaultIndex={startIndex}
          onPress={this.close}
          onLongPress={this._showActionSheet}
          onChange={index => this.setState({index})}
        />
        <View style={styles.fullImgTopBar}>
          <Icon name="ios-close" size={40} color="#fff" style={styles.topBtn} onPress={this.close}/>
          <Icon name="ios-more" size={40} color="#fff" style={styles.topBtn} onPress={this._showActionSheet}/>
        </View>
        <StatusBar animated={false} hidden={true}/>
      </Overlay.PopView>
    )
    this.setState({index: startIndex, images})
    Overlay.show(overlayView);
  }

  render() {
    return (
      <ActionSheet
        ref={actionSheet => this._actionSheet = actionSheet}
        title="请选择您的操作"
        options={['保存图片', '取消',]}
        cancelButtonIndex={1}
        onPress={this._actionSheetPress}
        tintColor="#333"
      />
    )
  }
}

const styles = StyleSheet.create({
  fullImgTopBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  topBtn: {
    padding: 15,
    backgroundColor: 'transparent'
  }
})