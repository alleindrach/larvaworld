/**
 * Created by jialing on 2017/6/29.
 */
import React from 'react'
import {Alert, StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import Barcode from 'react-native-smart-barcode'
import Colors from '../common/Colors'
import BaseScreen from './BaseScreen'
import config from '../config/Config'
import {selectCropPhoto,readQrCode} from '../utils/PickerUtils'
import queryString from "query-string";
import {ModalIndicator, Toast} from "teaset";
import {connect} from 'react-redux'

class QrCodeScreen extends BaseScreen {
  static navigationOptions = {header: null};

  static defaultProps = {
    ...BaseScreen.defaultProps,
    navColor: Colors.signInSegment,
    showBackButton: true,
  };

  constructor(props) {
    super(props);
    // 初始状态
    this.state = {
      viewAppear: false,
    };
  }

  renderNavigationTitle() {
    const {params} = this.props.navigation.state;
    if (params && params.title)
      return params.title;
    return '扫一扫'
  }

  renderNavigationRightView() {
    return (
      <TouchableOpacity style={styles.rightView} onPress={this._selectFromAlbum}>
        <Text style={styles.rightText}>相册</Text>
      </TouchableOpacity>
    )
  }

  renderPage() {
    return (
      <View style={styles.container}>
        <Barcode style={{flex: 1,}} ref={ref => this._barCode = ref} onBarCodeRead={this._onQrCodeRead}/>
      </View>
    )
  }

  _onQrCodeRead = (e) => {
    this._stopScan();
    if (e.nativeEvent.data.code) {
      this._process(JSON.parse(e.nativeEvent.data.code));
    } else {
      Alert.alert('提示',
        '无效二维码',
        [{
          text: '重新扫描', onPress: () => {
            this._startScan()
          }
        },
          {
            text: '返回', onPress: () => {
            this.props.navigation.goBack();
          }
          }
        ]);
    }
  }

  _process = (data) => {
    // if (!this.props.user.isLogin) {
    //   this.props.navigation.navigate('Login', {callback: () => this._process(data)});
    //   return;
    // }

    const type = data.type || 'makefriend';
    switch (type) {
      case 'makefriend':
        this._processMakefriend(data);
        break;
      // case '2':
      //   this._processEnroll(data);
      //   break;
      default:
        Alert.alert('提示',
          '无效二维码',
          [{
            text: '重新扫描', onPress: () => {
              this._startScan()
            }
          },
            {
              text: '返回', onPress: () => {
              this.props.navigation.goBack();
            }
            }
          ]);
        break;
    }
  }

  // _processSignIn = (data) => {
  //   const {activityId, segmentId} = data;
  //   if (!activityId || !segmentId) {
  //     Alert.alert('提示',
  //       '无效二维码',
  //       [{
  //         text: '重新扫描', onPress: () => {
  //           this._startScan()
  //         }
  //       },
  //         {
  //           text: '返回', onPress: () => {
  //           this.props.navigation.goBack();
  //         }
  //         }
  //       ]);
  //     return;
  //   }
    // this.key = ModalIndicator.show('正在签到');
    // request.post(config.api.base + config.api.signIn, {
    //   activityId: activityId,
    //   segmentId: segmentId,
    // })
    //   .then(data => {
    //     if (data.code === 0) {
    //       Toast.info('签到成功');
    //     } else {
    //       Toast.info(data.message);
    //     }
    //   })
    //   .catch(error => {
    //     Toast.fail(error.message);
    //   })
    //   .finally(() => {
    //     ModalIndicator.hide(this.key);
    //     this.props.navigation.goBack();
    //   })
  

  _processMakefriend = (data) => {
    const friend = data.friend;
    if (!friend) {
      Alert.alert('提示',
        '无效二维码',
        [{
          text: '重新扫描', onPress: () => {
            this._startScan()
          }
        },
          {
            text: '返回', onPress: () => {
            this.props.navigation.goBack();
          }
          }
        ]);
      return;
    }
    this.props.navigation.goBack();
    this.props.navigation.navigate('MakeFriend', {
      friend,
    });
  }

  _startScan = () => {
    this._barCode.startScan()
  }

  _stopScan = () => {
    this._barCode.stopScan()
  }

  _selectFromAlbum = () => {
    this._stopScan();
    selectCropPhoto((path) => {
      ModalIndicator.show('正在识别图片中的二维码');
      readQrCode(path)
        .then(data => {
          this._process(queryString.parse(data))
        })
        .catch(err => {
          Alert.alert('提示', err.message);
          this._startScan();
        })
        .finally(() => ModalIndicator.hide())
    }, () => this._startScan())
  }
}

export default connect(state => ({
  user: state.user
}))(QrCodeScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black'
  },
  rightView: {
    flexDirection: 'row',
    paddingRight: em(24),
    justifyContent: 'center',
    alignItems: 'center'
  },
  rightText: {color: '#fff', fontSize: em(30), marginRight: em(12)}
})
