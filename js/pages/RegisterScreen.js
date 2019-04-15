
import React from 'react';
import {
  View,
  StyleSheet,
  Image,
  Keyboard
} from 'react-native';

import VerificationCodeButton from '../component/VerificationCodeButton';
import config from '../config/Config'
import md5 from 'crypto-js/md5'
import {Toast, ModalIndicator, Button, Input} from 'teaset'
import BaseScreen from './BaseScreen'
import Colors from '../common/Colors'
import CustomView from '../component/CustomView'
import {showAlertDialog} from '../component/Dialog'
import StringUtils from '../utils/StringUtils'
import Api from '../service/Api';
import CaptchaInput from '../component/Captcha';
export default class RegisterScreen extends BaseScreen {
  static navigationOptions = {
    header: null
  };

  static defaultProps = {
    navColor: Colors.navColor,
    title: ' 注册',
    showBackButton: true,
  };

  constructor(props) {
    super(props);
    this.state = {tel: '', code: '', pwd: '', nickName: ''};
  }

  register() {
    if (StringUtils.isStringEmpty(this.state.tel)) {
      showAlertDialog('提示', '请输入手机号')
    } else if (StringUtils.isStringEmpty(this.state.code)) {
      showAlertDialog('提示', '请输入验证码')
    } else if (StringUtils.isStringEmpty(this.state.pwd)) {
      showAlertDialog('提示', '请输入密码')
    } else if (StringUtils.isStringEmpty(this.state.nickName)) {
      showAlertDialog('提示', '请输入昵称')
    } else if (!StringUtils.checkTel(this.state.tel)) {
      showAlertDialog('提示', '请检查手机号格式')
    } else if (!StringUtils.checkPwd(this.state.pwd)) {
      showAlertDialog('提示', '密码为6-12位，只能包含数字、字母、下划线')
    } else if (!StringUtils.checkNickname(this.state.nickName)) {
      showAlertDialog('提示', '昵称为2-12位')
    } else {
      this.key = ModalIndicator.show('正在注册');
      const body = {
        mobile: this.state.tel,
        password: md5(this.state.pwd).toString(),
        username: this.state.nickName,
        mobileCaptcha: this.state.code
      };
      Api().put(config.api.register, {username:this.state.nickName,password:this.state.pwd,mobileCaptcha:this.state.code,mobile:this.state.tel})
      .then(data => {
          if (data.state === 1) {
            Toast.message('注册成功');
            const {goBack} = this.props.navigation;
            goBack();
          } else {
            Toast.fail(data.message)
          }
        })
        .catch(error => {
          Toast.message(error.message);
        })
        .finally(() => ModalIndicator.hide(this.key))
    }
  }

  requestCode = () => {
    Keyboard.dismiss();
    this.key = ModalIndicator.show('正在发送短信');
    Api().post(config.api.verifyCode,{mobile: this.state.tel,captcha:this.captchInput.state.captcha})
    .then(data => {
        if (data.state === 1) {
          Toast.success('发送成功');
          this.verificationCodeButton && this.verificationCodeButton.startTimer()
        } else {
          Toast.fail(data.message)
        }
      })
    .catch(() => {
        Toast.fail('网络请求失败，请检查网络连接');
      })
    .finally(() => ModalIndicator.hide(this.key));
  };

  renderPage() {
    const isValid = StringUtils.checkTel(this.state.tel);
    return (
      <View style={styles.container}>
        <Image style={{alignSelf: 'flex-end', marginTop: em(80), marginRight: em(136)}}
               source={require('../assets/dialog_top.png')}/>
        <CustomView containerStyle={styles.inputView} bottomIcon={require('../assets/activity/link_small.png')}
                    bottomIconStyle={styles.linkRight}>
          <Input style={styles.textInput} underlineColorAndroid='transparent' keyboardType="numeric" placeholder='手机号'
                 onChangeText={(text) => this.setState({tel: text})}/>
        </CustomView>
        <CustomView containerStyle={styles.inputView} bottomIcon={require('../assets/activity/link_small.png')}
        bottomIconStyle={styles.linkRight}>
          <CaptchaInput ref={(c)=>this.captchInput=c}></CaptchaInput>
        </CustomView>
        <CustomView containerStyle={styles.codeView} bottomIcon={require('../assets/activity/link_small.png')}
                    bottomIconStyle={styles.linkLeft}>
          <Input style={styles.codeTextInput} underlineColorAndroid='transparent' placeholder='验证码'
                 onChangeText={(text) => this.setState({code: text})}/>
          <VerificationCodeButton ref={ref => this.verificationCodeButton = ref} isValid={isValid}
                                  onClick={this.requestCode}/>
        </CustomView>
        <CustomView containerStyle={styles.inputView} bottomIcon={require('../assets/activity/link_small.png')}
                    bottomIconStyle={styles.linkRight}>
          <Input style={styles.textInput} underlineColorAndroid='transparent' placeholder='密码' secureTextEntry={true}
                 onChangeText={(text) => this.setState({pwd: text})}/>
        </CustomView>
        <CustomView containerStyle={styles.inputView}>
          <Input style={styles.textInput} underlineColorAndroid='transparent' placeholder='昵称'
                 onChangeText={(text) => this.setState({nickName: text})}/>
        </CustomView>
        <Button title="注册" type="primary" style={styles.registerButton} onPress={this.register.bind(this)}/>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: em(24),
    backgroundColor: Colors.bgColor,
  },
  inputView: {
    height: em(92),
    paddingHorizontal: em(32),
    paddingVertical: 0,
    borderRadius: em(32),
    justifyContent: 'center'
  },
  textInput: {
    borderWidth: 0,
    fontSize: em(30),
  },
  codeView: {
    flexDirection: 'row',
    alignItems: 'center',
    height: em(92),
    paddingHorizontal: em(32),
    paddingVertical: 0,
    borderRadius: em(32),
    justifyContent: 'center'
  },
  codeTextInput: {
    flexGrow: 1,
    borderWidth: 0,
    fontSize: em(30),
    marginRight: em(12),
    alignSelf: 'center'
  },
  codeText: {
    color: 'white'
  },
  registerButton: {
    backgroundColor: Colors.navColor,
    marginTop: em(64),
    borderColor: 'transparent',
    height: em(86),
    borderRadius: em(24)
  },
  linkLeft: {
    marginLeft: em(100),
  },
  linkRight: {
    marginRight: em(100),
    alignSelf: 'flex-end'
  },

});