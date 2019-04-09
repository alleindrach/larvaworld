import React, {Component} from 'react'
import {NetInfo} from 'react-native'
import configureStore from './js/redux/store/index'
import {Provider} from 'react-redux'
import {AppContainer} from "./js/router/index"
import { Root } from "native-base";


export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {isLoading: true}
  }

  componentDidMount() {
    const {store} = configureStore(() => {
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
  }

  // _fetchMsg = () => {
  //   const {store} = this.state
  //   const {user, app} = store.getState()
  //   if (user.isLogin && app.networkAvailable) {
  //     store.dispatch(MessageAction.fetchMsg())
  //   }
  //   setTimeout(this._fetchMsg, 1000 * 60)
  // }

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
