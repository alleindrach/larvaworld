
import React from 'react';
import { Button, View, Text,ActivityIndicator,StyleSheet,Image,TouchableOpacity } from 'react-native';
import {Toast,Input} from "native-base";
import {connect} from 'react-redux'
import Colors from '../common/Colors';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import BaseScreen from './BaseScreen';
import * as UserAction from '../redux/action/UserAction';
import CustomView from '../component/CustomView';
import StringUtils from '../common/StringUtils';
export  class LoginScreen extends BaseScreen {

  static navigationOptions = {
    header: null
  };

  static defaultProps = {
    navColor: Colors.navColor,
    title: '登录',
    showBackButton: true,
  };

  constructor(props) {
    super(props);
    this.state = {phone: props.user.username, password: '',captcha: '' , error: null};
  }
  
  componentDidMount(){
      if(this.props.user.isLogin)
      {
        const {goBack, state} = this.props.navigation;
        const {params} = state;
        params && params.callback && params.callback();
        // goBack();
      }
  }


  check = () => {
    const {goBack, state} = this.props.navigation;
    if (StringUtils.isStringEmpty(this.state.username)) {
      Toast.show({text:'请输入用户名',buttonText:'OK',duration:3000});
    } else if (StringUtils.isStringEmpty(this.state.password)) {
      Toast.show({text:'请输入密码',buttonText:'OK',duration:3000});
    // } else if (!StringUtils.checkTel(this.state.phone)) {
    //   Toast.show({text:'请检查手机号格式',buttonText:'OK',duration:3000});
    }else if(StringUtils.isStringEmpty(this.state.captcha)) {
      Toast.show({text:'请输入验证码',buttonText:'OK',duration:3000});
    }
    else {
      this.props.doLogin(this.state.username, this.state.password,this.state.captcha,goBack)
    }
  };

  register = () => {
    const {navigate} = this.props.navigation;
    navigate('Register');
  }

  resetPwd = () => {
    const {navigate} = this.props.navigation;
    navigate('ResetPwd');
  }
  refreshCaptcha = ()=>{
    this.props.refreshCaptcha(new Date().getTime());
  }

  renderPage() {
    const {user} = this.props
    
    return (
      <View style={styles.container}>
      <Image style={styles.logo} source={require('../assets/logo.png')}/>
      <Image style={{alignSelf: 'flex-end', marginRight: em(136)}} source={require('../assets/dialog_top.png')}/>
      <CustomView containerStyle={styles.inputView} bottomIcon={require('../assets/activity/link_small.png')}
                  bottomIconStyle={styles.linkRight}>
        <Input
          style={styles.textInput}
          underlineColorAndroid='transparent'
          // keyboardType="numeric"
          placeholder="用户名"
          onChangeText={username => this.setState({username})}
          value={this.state.username}
        />
      </CustomView>
      <CustomView containerStyle={styles.inputView}>
        <Input
          style={styles.textInput}
          underlineColorAndroid='transparent'
          placeholder="密码"
          secureTextEntry={true}
          onChangeText={password => this.setState({password})}
          value={this.state.password}/>
      </CustomView>
      <View style={styles.captchaWrapper}>
          <View style={styles.captchaInputView}>
            <Input
              style={styles.textInput}
              underlineColorAndroid='transparent'
              placeholder="验证码"
              onChangeText={captcha => this.setState({captcha})}
              value={this.state.captcha}/>
          </View>
          <TouchableOpacity style={styles.captchaButton} onPress={this.refreshCaptcha.bind(this)}>
              <Image source={{uri:'http://127.0.0.1:8762/common/captcha.jpg?v='+user.captchaSeed}} style={{flex:1,width:50,height:50 }}></Image>
          </TouchableOpacity>      
      </View>
      <View style={styles.errorInfo}>
        {(user.error )? <Text style={styles.errorText}>{user.error}</Text> : null}
      </View>
      <TouchableOpacity type="primary" style={styles.loginButton} disabled={user.isLoading} onPress={this.check}>
        {user.isLoading ? <ActivityIndicator color="#fff"/> : null}
        <Text style={{fontSize: em(34), color: '#fff'}}>{user.isLoading ? "正在登录..." : "登录"}</Text>
      </TouchableOpacity>
      <View style={styles.extraView}>
        <Button titleStyle={styles.extraButton} title="忘记密码？" type="link" onPress={this.resetPwd}/>
        <Button titleStyle={styles.extraButton} title="新用户" type="link" onPress={this.register}/>
      </View>
      </View>
    );
  }
}
 

const mapStateToProps = (state) => {
  return {
    user: state.user
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    doLogin: (username, password,captcha,goBack,stompContext) => {
      dispatch(UserAction.doLogin(username, password,captcha,goBack,stompContext))
    },
    refreshCaptcha:(seed) =>{
      dispatch(UserAction.refreshCaptcha(seed))
    },
    onLoginSuccess:()=>{
      // this.props.navigation.navigate("UserCenterScreen");
      // dispatch(MessageAction.fetchMsg())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen)


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: em(24),
    backgroundColor: Colors.bgColor,
  },
  logo: {
    alignSelf: 'center',
    marginTop: em(100),
    marginBottom: em(80)
  },
  inputView: {
    height: em(92),
    paddingHorizontal: em(32),
    paddingVertical: 0,
    borderRadius: em(32),
    justifyContent: 'center'
  },
  captchaWrapper:{
    flex: 1, 

    flexDirection: 'row'
  },
  captchaInputView: {
    marginTop:em(16),
    flex: 2,
    height: em(92),
    paddingHorizontal: em(32),
    paddingVertical: 0,
    borderRadius: em(32),
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: em(24),
    borderRadius: em(40)
  },
  captchaButton: {
    flex:1,
    marginTop:em(16),
    backgroundColor: Colors.navColor,
    borderColor: 'transparent',
    height: em(92),
    borderRadius: em(24),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
   
  },
  textInput: {
    borderWidth: 0,
    fontSize: em(30),
  },
  loginButton: {
    backgroundColor: Colors.navColor,
    borderColor: 'transparent',
    height: em(86),
    borderRadius: em(24),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  extraView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  extraButton: {
    padding: 10,
    color: Colors.navColor,
    fontSize: em(26)
  },
  linkLeft: {
    marginLeft: em(100),
  },
  linkRight: {
    marginRight: em(100),
    alignSelf: 'flex-end'
  },
  errorInfo: {
    height: em(96),
    justifyContent: 'center',
    alignItems: 'center'
  },
  errorText: {
    fontSize: em(24),
    color: "red",
    alignSelf: 'center'
  }
});
