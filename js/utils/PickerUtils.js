
import {Platform, Alert} from 'react-native'
import ImagePicker from 'react-native-image-picker';
import ImageCropPicker from 'react-native-image-crop-picker';
import Permissions from 'react-native-permissions'
import config from '../config/Config'

function selectPhotoTapped(onPhotoSelected) {
  const options = {
    title: null,
    takePhotoButtonTitle: '拍摄',
    chooseFromLibraryButtonTitle: '从图库选取',
    cancelButtonTitle: '取消',
    quality: 1.0,
    maxWidth: 500,
    maxHeight: 500,
    storageOptions: {
      skipBackup: true
    }
  };

  ImagePicker.showImagePicker(options, (response) => {

    if (response.didCancel) {
      console.log('User cancelled photo picker');
    }
    else if (response.error) {
      console.log('ImagePicker Error: ', response.error);
    }
    else if (response.customButton) {
      console.log('User tapped custom button: ', response.customButton);
    }
    else {
      onPhotoSelected(response.uri);
    }
  });
}

function selectVideoTapped(onVideoSelected) {
  const options = {
    title: null,
    takePhotoButtonTitle: '拍摄',
    chooseFromLibraryButtonTitle: '从图库选取',
    cancelButtonTitle: '取消',
    mediaType: 'video',
    videoQuality: 'medium',
    durationLimit: 5 * 60
  };

  ImagePicker.showImagePicker(options, (response) => {

    if (response.didCancel) {
      console.log('User cancelled video picker');
    }
    else if (response.error) {
      console.log('ImagePicker Error: ', response.error);
    }
    else if (response.customButton) {
      console.log('User tapped custom button: ', response.customButton);
    }
    else {
      onVideoSelected(response.uri);
    }
  });
}

function selectMultiPhoto(onPhotoSelected) {
  ImageCropPicker.openPicker({
    multiple: true,
    mediaType: 'photo',
    maxFiles: 9
  }).then(images => {
    if (Platform.OS === 'ios') {
      onPhotoSelected(images.map(item => 'file://' + item.path));
    } else if (Platform.OS === 'android') {
      onPhotoSelected(images.map(item => item.path));
    }
  }).catch(err => {
      // console.log(err)
    }
  )
}

function selectCropPhoto(onPhotoSelected, onCancel) {
  Permissions.request('photo')
    .then(response => {
      //response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
      if (response === 'denied' || response === 'undetermined') {
        Alert.alert('提示', '您没有授权App访问您的相册');
        onCancel && onCancel();
      } else {
        ImageCropPicker.openPicker({
          mediaType: 'photo',
          cropping: true,
          width: 200,
          height: 200,
        }).then(image => {
          if (Platform.OS === 'ios') {
            onPhotoSelected('file://' + image.path);
          } else if (Platform.OS === 'android') {
            onPhotoSelected(image.path);
          }
        }).catch(err => {
            // console.log(err)
            onCancel && onCancel();
          }
        )
      }
    })
    .catch(err => onCancel && onCancel());
}
function readQrCode(uri) {
  return new Promise((resolve, reject) => {
    let formData = new FormData();
    formData.append('file', {uri, type: 'application/octet-stream', name: Date.now().toString()});
    fetch(config.qrCodeApi.read, {
      method: 'post',
      header: {
        'Content-Type': 'multipart/form-data'
      },
      body: formData,
    })
      .then(res => res.json())
      .then(data => {
        let r = data[0].symbol[0];
        if (r.error)
          reject(new Error('未发现二维码'));
        resolve(r.data);
      })
      .catch(err => reject(err))
  })
}
export {selectPhotoTapped, selectVideoTapped, selectMultiPhoto, selectCropPhoto,readQrCode}