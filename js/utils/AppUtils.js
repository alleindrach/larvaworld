

import DeviceInfo from 'react-native-device-info'
import config from '../config/Config'
import {Alert, NativeModules} from 'react-native'
import Toast from 'teaset/components/Toast/Toast'
import Api from '../service/Api'
export const IOS_APP_ID = '1286995457'

export function checkVersion() {
  return new Promise((resolve, reject) => {
    if (iOS) {
      NativeModules.upgrade.upgrade(IOS_APP_ID, (msg) => {
        if ('YES' === msg) {
          resolve({hasNewVersion: true})
        } else if ('NO' === msg) {
          resolve({hasNewVersion: false})
        } else {
          reject(new Error('无法从app store获取应用信息'))
        }
      })
    }
    else { 
        Api().checkVersion().then(
            (data)=>resolve(data)
        ).catch(err=>{
            reject(new Error(data.message))
        })
    }
  })
}

export function upgrade(url) {
  Alert.alert(
    '提示',
    '检测到新版本，是否立即更新？',
    [
      {
        text: '取消', onPress: () => {
      }, style: 'cancel'
      },
      {
        text: '更新', onPress: () => {
        if (iOS) {
          NativeModules.upgrade.openAPPStore(IOS_APP_ID)
        } else {
          NativeModules.upgrade.upgrade(url)
          Toast.info('已开始后台下载');
        }
      }
      },
    ],
    {cancelable: true}
  )
}