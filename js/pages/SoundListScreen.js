
import React from 'react';
import {RefreshControl,Text,ActivityIndicator, Image,StyleSheet, TouchableHighlight, TouchableOpacity, View,Alert,TouchableNativeFeedback} from 'react-native';
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
import { Container, Header, Content, Card, CardItem,Footer,FooterTab, Thumbnail, Button, Icon, Left, Body, Right,Row } from 'native-base';
import * as Progress from 'react-native-progress';
import { ModalIndicator} from 'teaset'
import { ActionSheetCustom as ActionSheet } from 'react-native-actionsheet'
import global from '../common/Global';
import Spinner from 'react-native-loading-spinner-overlay';
import * as Types from '../redux/action/ActionType';
import Api from '../service/Api'
import Timeline from 'react-native-timeline-flatlist'
import Sound from 'react-native-sound';


class SoundListScreen extends BaseScreen {
 
  static navigationOptions = {
    header: null
  };

  static defaultProps = {
    navColor: Colors.navColor,
    title: '我的声音',
    showBackButton: false,
  };

  constructor(props) {
    super(props);
    const param=this.props.navigation.getParam()
    const channel=param?(param.channel||0):0;
    this.state={audioState:'play.paused'};
    this._onEventPress = this._onEventPress.bind(this)
    this._renderSelected = this._renderSelected.bind(this)
    this._renderDetail = this._renderDetail.bind(this)
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
    if(!this.props.soundChannels.isFetched && !this.props.soundChannels.isFetching&& this.props.user.isLogin)
    {
      this.props.prefetchChannels();
    }
  }

  static getDerivedStateFromProps(props, state) {
    const prevProps = state.prevProps || {};
    return {
        prevProps:props      
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
  
  _onEventPress(data){
    this.setState({selected: data})
  }


  renderFooterView(){
    return (
     null
    )
    
  }
  
  renderProgress(){
    if(this.state.isSending)
    {
      ModalIndicator.show(`正在拉取`);  
    }else
    {
      ModalIndicator.hide();  
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
  _renderSelected(){
    if(this.state.selected)
      return <Text style={{marginTop:10}}>Selected event: {this.state.selected.title} at {this.state.selected.time}</Text>
  }
  _renderTime(rowData, sectionID, rowID)
  {
    let time = <Text style={[styles.time]}>{rowData.time}</Text>
    if(rowData.date && rowData.date!='')
     {
      date = <Text style={[styles.date]}>{rowData.date}</Text>
      return (
        <View style={[styles.timeContainer]}>
          <View style={styles.timeContainerInner}>
            {date}
            {time}
          </View>
        </View>
      )
     } 
    else
    {
      return (
        <View style={[styles.timeContainer]}>
          <View style={styles.timeContainerInnerThine}>
            {time}
          </View>
        </View>
      )
    }
   
  }
  _renderDetail(rowData, sectionID, rowID) {
    // let title = <Text style={[styles.title]}>{rowData.title}</Text>
    // var desc = null
    // if(rowData.imageUrl)
    //   desc = (
    //     <View style={styles.descriptionContainer}>   
    //       <Image source={{uri: rowData.imageUrl}} style={styles.image}/>
    //     </View>
    //   )
    
    return (
      <View style={{flex:1}}>
        <Card>
         <CardItem>
              <Left>
                <Body>
                  <Text>{rowData.title}</Text>
                </Body>
              </Left>
            </CardItem>
          <CardItem cardBody style={{margin:0,padding:0,paddingLeft:0,paddingRight:0,paddingTop:0,paddingBottom:0}}>
            <Image source={{uri: rowData.imageUrl}} style={styles.image}/>
          </CardItem>
          <CardItem style={{margin:0,padding:0,paddingLeft:0,paddingRight:0,paddingTop:0,paddingBottom:0}}>
            <Body>
              <Button transparent style={{justifyContent:'flex-start',padding:8}} onPress={_=>{this._onPlay(rowData.snd)}}>
                <Icon active name="play"  style={{paddingRight:8}}/>
                <Text>play</Text>
              </Button>
            </Body>
            <Right>
              <Button transparent  style={{justifyContent:'flex-end',padding:8}} onPress={_=>{this._copyMsg(rowData.id)}}>
                <Icon active name="close" style={{paddingRight:8}}/>
                <Text>delete</Text>
              </Button>
            </Right>
          </CardItem>
        </Card>
      </View>
    )
  }
  _onRefetchMoreMsgs=()=>{
    if(!this.props.soundMessages.noMore)
      this.props.fetchMsgs();
  }
  _onRefreshMsgs=()=>{
    this.props.resetMsgs();
  }
  _copyMsg=(id)=>{
    this.props.copyMsg(id);
  }
  _playComplete = (success) => {
    if(this.sound){
        this.setState({audioState:'play.paused'});
    }
}
_soundStop=async()=>{
  return new Promise(function(resolve,reject)
  {
      if(!this.sound)
          resolve(true);
      else
          this.sound.stop(()=>{
              resolve(true)
          })
  })
}
  _onPlay=async (snd)=>{
    if(this.sound)
    {
      await this._soundStop();
      this.sound.release();
      this.sound=null;
    }
    const filepath=config.api.filebase+"/"+snd;
    this.sound = new Sound(filepath,'', ((error) => {
      if (error) {
          console.log('failed to load the sound', error);
          Alert.alert('Notice', 'audio file error. (Error code : 1)');   
          this.setState({audioState:'play.paused'});
      }else{
        this.setState({audioState:'playing'});
        if( this.sound._loaded)
        {
            this.sound.play(this._playComplete);
        }
      }
    }))
  }
  _renderFooter() {
    if (this.props.soundMessages.isFetching) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    } else {
        return <Text>~</Text>;
    }
  }

  renderPage() {
    if(this.props.soundMessages.isFetching)
    {
      ModalIndicator.show(`正在下载消息`);  
    }else
    {
      ModalIndicator.hide();  
    }
  
    if(this.props.soundMessages.initFetch&& this.props.soundMessages.msgs.length==0&& !this.props.soundMessages.isFetching){
      return (
        <View style={styles.containerReload}>
          
          <Icon  type="EvilIcons"  style={{fontSize:em(120),width:100,height:100}}   name="refresh"  onPress={this._onRefreshMsgs}/>
          
        </View>
      )
    }else
    {
      return (
        <View style={styles.container}>
          {this._renderSelected()}
          <Timeline 
            style={styles.list}
            data={this.props.soundMessages.msgs}
            circleSize={20}
            circleColor='#2f4f4f'
            lineColor='rgb(45,156,219)'
            timeContainerStyle={{minWidth:em(160), marginTop: -10,marginLeft:em(20)}}
            timeStyle={{minWidth:em(100),height:em(70),justifyContent:'center',
            alignItems:'center', textAlign: 'center', backgroundColor:'#2f4f4f', color:'white',fontSize:em(50), 
            padding:5, borderRadius:12,borderColor:'red'}}
            descriptionStyle={{color:'gray'}}
            options={{
              style:{paddingTop:5},
              refreshControl: (
                <RefreshControl
                  refreshing={this.props.soundMessages.isRefreshing}
                  onRefresh={this._onRefreshMsgs}
                />
              ),
              renderFooter: this._renderFooter,
              onEndReached: this._onRefetchMoreMsgs
            }}
            innerCircle={'dot'}
            onEventPress={this._onEventPress}
            renderDetail={this._renderDetail}
            renderTime={this._renderTime}
          />
        </View>
      );
    }
    
  }
}

const matStateToProps = (state) => {
  return {
    user: state.user,
    soundChannels:state.soundChannels,
    soundMessages: state.soundChannels.msgList,
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
    fetchMsgs:()=>{
      dispatch(SoundChannelsAction.soundChannelsMsgListFetch(0))
    },
    resetMsgs:()=>{
      dispatch(SoundChannelsAction.soundChannelsMsgListReset());
    },
    copyMsg:(id)=>{
      dispatch(SoundChannelsAction.soundChannelsMsgListCopy(id));
    }
  }
}

export default connect(matStateToProps, mapDispatchToProps, null, {withforwardRefRef: true})(SoundListScreen)

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
  containerReload: {
    flex: 1,
    flexDirection:'column',
    backgroundColor: Colors.bgColor,
    justifyContent:'center',
    alignItems:'center'
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

  list: {
    flex: 1,
    marginTop:20,
  },
  title:{
    fontSize:10,
    fontWeight: 'bold'
  },
  descriptionContainer:{
    flexDirection: 'row',
    paddingRight: 50
  },
  image:{
    flex:1,
   
    height: em(240),
    borderRadius: em(20)
  },
  textDescription: {
    marginLeft: 10,
    color: 'gray'
  },
  timeContainer:{
    
    minWidth:em(160), 
    marginTop: -5,
    marginLeft:em(20),
   
  },
  timeContainerInner:{
    flexDirection:'row',
    justifyContent:'flex-end',
    alignItems:'flex-end',
    borderRadius:20,
    backgroundColor:'#8fbc8f',
    overflow:'hidden',
  },
  timeContainerInnerThine:{
    flexDirection:'row',
    justifyContent:'flex-end',
    alignItems:'center',
    
  },
  date:{
    minWidth:em(90),
    
    justifyContent:'center',
    alignItems:'center', 
    textAlign: 'center', 
    color:'#2f4f4f',
    fontSize:em(30), 
    padding:2, borderRadius:12
  },
  time:{
    minWidth:em(50),
    
    justifyContent:'center',
    alignItems:'center', 
    textAlign: 'center', 
    color:'#2f4f4f',
    fontSize:em(20), 
    
    padding:2, borderRadius:12
  },

});