import React, {Component} from 'react'
import {NetInfo} from 'react-native'
import configureStore from './js/redux/store/index'
import {Provider} from 'react-redux'
import {AppContainer} from "./js/router/index"
import { Root } from "native-base";
import {StompEventTypes, withStomp} from 'react-stompjs'
import config from './js/config/Config'
import * as Action from './js/redux/action/index'
class App extends Component {
  constructor(props) {
    super(props)
    this.state = {isLoading: true,isLogin:false}
  }

  componentDidMount() {
    const {store,persistor} = configureStore(() => {
      //user token change listener
      // request.createListener(store)

      //loading ok
      this.setState({isLoading: false, store})
      // SplashScreen.hide()

      //message refresh every 1min
      // this._fetchMsg()

      //network change listener
      // NetInfo.isConnected.addEventListener('change', isConnected => store.dispatch(AppAction.netStateChange(isConnected)));
      // NetInfo.isConnected.fetch().done(isConnected => {
        // store.dispatch(AppAction.netStateChange(isConnected))
      // })

      //version check
    //   AppUtils.checkVersion()
    //     .then(data => {
    //       if (data.hasNewVersion) {
    //         AppUtils.upgrade(data.url)
    //       }
    //     })
    //     .catch(err => {
    //     })

      
    })

    store.dispatch(Action.MessageAction.initContext(
      this.props.stompContext,
      (msg)=>{
        store.dispatch(Action.MessageAction.messageReceived(msg));
      }
    ));

    this.props.stompContext.addStompEventListener(
      StompEventTypes.Connect,
      () => {
        console.log('connected!');
        store.dispatch(Action.MessageAction.conected());
      }
    )
    this.props.stompContext.addStompEventListener(
        StompEventTypes.Disconnect,
        () => {
          console.log('Disconnected!');
          store.dispatch(Action.MessageAction.disconnected());
        }
    )
    this.props.stompContext.addStompEventListener(
        StompEventTypes.WebSocketClose,
        () => {
          console.log('Disconnected!');
          store.dispatch(Action.MessageAction.disconnected());
        }
    )
  }

  render() {
    if (this.state.isLoading) {
      return null
    }

    return (
      <Provider store={this.state.store}>
        <Root>
          <AppContainer/>
        </Root>
      </Provider>
    )
  }
}

export default withStomp(App);