import React, {Component} from 'react'
import {NetInfo} from 'react-native'
import configureStore from './js/redux/store/index'
import {Provider} from 'react-redux'
import {AppContainer} from "./js/router/index"
import { Root } from "native-base";
import {StompEventTypes, withStomp} from 'react-stompjs'


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
    store.subscribe(()=>{
      if(store.getState().user.isLogin&& store.getState().user.isLogin!=this.state.isLogin)
      {
        console.log("store state changed!",store.getState());


        this.props.stompContext.addStompEventListener(
          StompEventTypes.Connect,
          () => {
            console.log('connected!');
            this.setState({status: 'Connected'})
            this.state.stompclient.subscribe('/user/topic/message',(msg=>{
              
              // const msgs = this.state.messages;
              // // msgs.push({id:this.counter,title:msg.body}); 
              // this.setState({messages:msgs.concat({key:msg.headers['message-id'],title:msg.body})})
              //  console.log(msg);
            }).bind(this))
          }
      )
      this.props.stompContext.addStompEventListener(
          StompEventTypes.Disconnect,
          () => {
            console.log('Disconnected!');
            this.setState({status: 'Disconnected'})
          }
      )
      this.props.stompContext.addStompEventListener(
          StompEventTypes.WebSocketClose,
          () => {
            console.log('Disconnected!');
            this.setState({status: 'Disconnected (not graceful)'})
          }
      )
      this.state.stompclient=this.props.stompContext.newStompClient(
          'http://127.0.0.1:8762/websocket')  // it's '/' most likely

      }
      this.setState({isLogin:store.getState().user.isLogin});
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

export default withStomp(App);