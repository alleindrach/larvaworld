import React from 'react';
import { Button, View, Text } from 'react-native';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import BaseScreen from './BaseScreen';
import Colors from '../common/Colors';
import {connect} from 'react-redux'
import * as AppAction from '../redux/action/AppAction';
export  class IndexScreen extends BaseScreen {
  static navigationOptions = {
    header: null
  };

  static defaultProps = {
    navColor: Colors.navColor,
    title: '主页',
    showBackButton: false,
  };

  renderPage() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Home Screen</Text>
        <Button
          title="Go to Login"
          onPress={() => this.props.navigation.navigate('Login')}
        />
        <Button
          title="Go to Register"
          onPress={() => this.props.navigation.navigate('Register')}
        />
        <Button
          title="Go to QRCode"
          onPress={() => this.props.navigation.navigate('QRCode')}
        />
        <Button
          title="Go to MakeFriend"
          onPress={() => this.props.navigation.navigate('MakeFriend',{"friend":{"name":"lily"}})}
        />
        <Button
          title="Go to home"
          onPress={() => this.props.navigation.navigate('HomeIndex')}
        />
      </View>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    app: state.app
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    onLoginSuccess:()=>{
      dispatch(AppAction.netStateChange(false));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  IndexScreen)
