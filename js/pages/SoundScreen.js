
import React from 'react';
import {ActivityIndicator, Image, StyleSheet, TouchableHighlight, TouchableOpacity, View,Alert,TouchableNativeFeedback} from 'react-native';
import BaseScreen from './BaseScreen'
import Avatar from '../component/Avatar'
import SoundChannels from '../component/SoundChannels'
import Colors from '../common/Colors'
import {connect} from 'react-redux'
// import BaseListView from '../component/BaseListView'
import {SoundChannelsAction, UserAction} from '../redux/action'
import {Projector, SegmentedBar, Theme, Toast} from 'teaset'
import * as Picker from '../utils/PickerUtils'
import * as FileUtils from '../utils/FileUtils'
import config from '../config/Config'
import { Container, Header, Content, Footer, FooterTab, Button, Icon, Text } from 'native-base';
import * as Progress from 'react-native-progress';
import { ModalIndicator} from 'teaset'
import { ActionSheetCustom as ActionSheet } from 'react-native-actionsheet'
import global from '../common/Global';
import Spinner from 'react-native-loading-spinner-overlay';
import * as Types from '../redux/action/ActionType';
import Api from '../service/Api'
// import BlurView from 'react-native-blur';
// var Overlay = require('react-native-overlay');
// var BlurView = require('react-native-blur').BlurView;

class SoundScreen extends BaseScreen {
 
  static navigationOptions = {
    header: null
  };

  static defaultProps = {
    navColor: Colors.navColor,
    title: '声音变变变',
    showBackButton: false,
  };

  constructor(props) {
    super(props);
    const param=this.props.navigation.getParam()
    const channel=param?(param.channel||0):0;
    this.state={channel:channel,isRecording:false,recordingProgress:0,recordButtonColor:'red'};
    
  }

  componentDidMount() {
    
    if(!this.props.user.isLogin)
    {
      this.props.navigation.navigate("Login")
    }else
    {
      this.props.prefetchChannels();
    }
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    console.log('new state=>',this.state)
    if(this.state.needReload)
    {
      this.props.prefetchChannels();
    }
  }

  static getDerivedStateFromProps(props, state) {
    const prevProps = state.prevProps || {};
    // console.log('getDerivedStateFromProps',prevProps,props)
    // Compare the incoming prop to previous prop
    // if(prevProps.navigation && prevProps.navigation.state && !prevProps.navigation.state.params.action  
    //   &&  props.navigation.state.params.action==Types.USER_LOGIN_SUCCESS){
    //     return {
    //       prevProps:props,
    //       needReload:true 
    //   }
        
    // }
    // else
    return {
        prevProps:props      
    }
}
  _onSnapToItem=(index)=>
  {
    //  this.props.selectChannel(index);
    this.setState({channel:index})
  }
  scrollToTop = () => {
    const ref = 'list' + this.props.eventList.index
    this.refs[ref] && this.refs[ref].scrollTo({x: 0, y: 0, animated: true})
  }

  _onImageSelect=(index)=>{
    Picker.selectPhotoTapped((uri)=>{
      console.log("select:",uri)
      this.props.selectImage(index,uri);
    })
  }
  _syncChannels=()=>{
    this.props.syncChannels();
  }

  sendNewMessage=()=>{
    const {stompClient}=this.props.message;
    if(stompClient){
      stompClient.publish({destination: "/center/message", body: JSON.stringify({action:"hello"})});
    }
  }
  
  _toQrCodeScanner = () => {
    if (this.props.user.isLogin)
      this.props.navigation.navigate('QRCode');
    else {
      Toast.info('请先登录');
      this.props.navigation.navigate('Login');
    }
  }
  _startTalking=async ()=>{
    try{
      this._soundChannelsCtrl.startRecord();
      this.setState({isRecording:true,recordingProgress:0})
    }catch(ex )
    {
      console.log('start record failed ',ex)
    }
    
  }
  _stopTalking=async ()=>{
    try{
      await this._soundChannelsCtrl.stopRecord();
    }catch(ex )
    {
      console.log('stop record failed ',ex)
    }
  }
  _onRecording=(event)=>{
    this.setState({recordingProgress:event.current/event.max})
  }
  _onRecordFinished=(event)=>{
    //event: {success:didSucceed,file:filePath,size:fileSize,sindex:this.props.sindex}
    this.setState({isRecording:false})
    if(event.success){
      this.setState({isSending:true,snd:event.file});

      Api().uploadMessage({channel:this.state.channel,snd:event.file})
      // .uploadProgress((written, total) => {
      //   progress=written/total;
      // })
      .then((res)=>{
          if (res.respInfo.status != 200) {
              console.log('Failed to successfully http call ')
              throw new Error('Failed with Code'+res.status);
            }
          return res;
      })
      .then((res) => {
        if(res.data && JSON.parse(res.data).state==1)
        {
            msgid=JSON.parse(res.data).data
            this.setState({isSending:false})
        }else if(JSON.parse(res.data).state!=1){
            this.setState({isSending:false,error:JSON.parse(res.data).reason})
        }
        else{
          this.setState({isSending:false})
        }
        
      }).catch((err) => {
        this.setState({isSending:false,error:err})
      })
    }
    
  }

  renderFooterView(){
    return (
      <View style={{ 
        position: 'absolute', left: 0, right: 0, bottom: 0 ,
      height:em(200),backgroundColor:'#2f4f4f',
      borderTopLeftRadius:em(50),borderTopRightRadius:em(50),
      justifyContent:'center',alignContent:'center'
    }}>
    <TouchableHighlight 
    underlayColor='pink'
    onPressIn={this._startTalking} onPressOut={this._stopTalking} 
      style={{backgroundColor:'#b22222', borderRadius:em(80),width:em(160),height:em(160),justifyContent:"center",alignContent:"center",alignSelf:"center"}}>
      
      <Progress.Circle
        style={styles.progress}
        progress={this.state.recordingProgress}
        color='#8fbc8f'
        unfilledColor='white'
        thickness={em(10)}
        size={em(160)}
        animated={false}
        direction="clockwise"
        />
      </TouchableHighlight>
      </View>
    )
    
  }

  renderProgress(){
    if(this.state.isRecording)
    {
      return(
        <Progress.Circle
        style={styles.progress}
        progress={this.state.recordingProgress}
        color='green'
        unfilledColor='white'
        thickness={em(10)}
        size={em(160)}
        fill='red'
        animated={false}
        direction="counter-clockwise"
      />
      )
    }else
    {
      if(this.state.isSending)
      {
        ModalIndicator.show(`正在发送`);  
      }else
      {
        ModalIndicator.hide();  
      }
      
    }
    
    return (null)
  }
  
  renderNavigationLeftView() {
    const {navigate} = this.props.navigation;
    const {isLogin} = this.props.user;
    return (
      <Avatar
        style={{paddingLeft: em(24)}}
        user={this.props.user}
        showName={false}
        size={em(56)}
        onPress={() => {
          if (!isLogin) {
            navigate('Login')
          } else {
            navigate('MyProfile')
          }
        }}/>
    )
  }

  renderNavigationRightView() {
    return (
      <TouchableOpacity
        style={styles.rightView}
        onPress={this._toQrCodeScanner}>
        <Icon name="md-qr-scanner" color="#fff" size={30}/>
      </TouchableOpacity>
    )
  }

  renderPage() {
    const {user,soundChannels}=this.props;
    if(soundChannels)
      return (
        <View style={{flex: 1}}>
          {this.renderProgress()}
          <SoundChannels  navigation={this.props.navigation}  
          ref={
            ref => this._soundChannelsCtrl = ref
          } 
          user={user} 
          channels={soundChannels} 
          firstItem={soundChannels.currentChannel}
          imageSelector={this._onImageSelect}
          onSnapToItem={this._onSnapToItem}
          onRecordFinished={this._onRecordFinished}
          onRecording={this._onRecording}
          onSync={this._syncChannels}
          />
        </View>
        
    );
    else
      return (
        null
      )

  }
}

const matStateToProps = (state) => {
  return {
    user: state.user,
    soundChannels: state.soundChannels,
    message:state.message

    // eventList: state.eventList
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    prefetchChannels:()=>{
      dispatch(SoundChannelsAction.prefetchChannels())
    },
    nav2Login:()=>{
      dispatch(UserAction.navToLogin());
    },
    selectChannel: (channel) => {
      dispatch(SoundChannelsAction.selectChannel(channel))
    },
    selectImage: (index,filepath) => {
      dispatch(SoundChannelsAction.selectImage(this.soundChannels,index,filepath))
    },
    sendSoundMessage:(channel,filepath)=>{
      dispatch(SoundChannelsAction.sendSoundMessage(
        {channel:channel,snd:filepath}))
    },
    syncChannels:()=>{
      dispatch(SoundChannelsAction.soundChannelsSync())
    }
  }
}

export default connect(matStateToProps, mapDispatchToProps, null, {withforwardRefRef: true})(SoundScreen)

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems:'center'
  },
  spinnerTextStyle: {
    color: '#FFF'
  },
  container: {
    flex: 1,
    backgroundColor: Colors.bgColor
  },
  rightView: {
    flexDirection: 'row',
    paddingRight: em(24),
    justifyContent: 'center',
    alignItems: 'center'
  },
  circles: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progress: {
    margin: 0,
    position: 'absolute', left: 0, right: 0, bottom: 0 ,
  },
});