import React from 'react';
import { Button, View, Text } from 'react-native';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import BaseScreen from './BaseScreen';
import Colors from '../common/Colors';
import {connect} from 'react-redux'
import * as AppAction from '../redux/action/AppAction';
export  class HomeScreen extends BaseScreen {
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
  HomeScreen)
