
import React from 'react';
import Colors from '../common/Colors'
import {Toast,Input} from "native-base";
import { Button, View, Text,ActivityIndicator,StyleSheet,Image,TouchableOpacity } from 'react-native';
import config from '../config/Config';
export default class CaptchaInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        captchaSeed: new Date().getTime(),
    };
  }

  componentWillUnmount() {
    
  }
  refreshCaptcha(){
    this.setState({captchaSeed:new Date().getTime()})
  }

  render() {
    return (
        <View style={styles.captchaWrapper}>
            <View style={styles.captchaInputView}>
                <Input
                    style={styles.textInput}
                    underlineColorAndroid='transparent'
                    placeholder="图形验证码"
                    onChangeText={captcha => this.setState({captcha})}
                    value={this.state.captcha}/>
            </View>
            <TouchableOpacity style={styles.captchaButton} onPress={this.refreshCaptcha.bind(this)}>
                <Image source={{uri:config.api.base+config.api.captcha+'?v='+this.state.captchaSeed}} 
                style={{flex:1,width:50,height:40 ,marginTop:5 }}></Image>
            </TouchableOpacity>      
        </View>
    )
  }
}

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    borderRadius: em(20),
    height: em(68),
    width: em(200),
  },
  text: {
    color: 'white',
    textAlign: 'center'
  },
  textInput: {
    borderWidth: 0,
    fontSize: em(30),
    height: em(34),
  },
  captchaWrapper:{
    flex: 1, 
    flexDirection: 'row',
    marginTop:em(6),
    marginBottom:em(6),
    marginLeft:em(12),
    marginRight:em(12),
  },
  captchaInputView: {
   
    flex: 2,
    // paddingHorizontal: em(32),
    paddingVertical: 0,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  captchaButton: {
    flex:1,
    marginTop:em(16),
    backgroundColor: Colors.navColor,
    borderColor: 'transparent',
    height: em(34),
    borderRadius: em(24),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
   
  },
});