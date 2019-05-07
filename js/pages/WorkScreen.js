/**
 * Created by jialing on 2017/5/25.
 */

import React from 'react';
import {ActivityIndicator, Image, StyleSheet, TouchableHighlight, TouchableOpacity, View,Alert} from 'react-native';
import BaseScreen from '../pages/BaseScreen'
import Avatar from '../component/Avatar'
import Work from '../component/Work'
import Colors from '../common/Colors'
import {connect} from 'react-redux'
// import BaseListView from '../component/BaseListView'
import {WorkAction} from '../redux/action'
import {Projector, SegmentedBar, Theme, Toast} from 'teaset'
import * as Picker from '../utils/PickerUtils'
import * as FileUtils from '../utils/FileUtils'
import config from '../config/Config'
import { Container, Header, Content, Footer, FooterTab, Button, Icon, Text } from 'native-base';
import * as Progress from 'react-native-progress';
import { ModalIndicator} from 'teaset'

import Spinner from 'react-native-loading-spinner-overlay';
// import BlurView from 'react-native-blur';
// var Overlay = require('react-native-overlay');
// var BlurView = require('react-native-blur').BlurView;

class WorkScreen extends BaseScreen {
  static navigationOptions = {
    header: null
  };

  static defaultProps = {
    navColor: Colors.navColor,
    title: '主页',
    showBackButton: false,
  };

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

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.state.index=0;
    this.props.selectWork(this.getEmptyWork());
  }

  static getDerivedStateFromProps(props, state) {
    const prevProps = state.prevProps || {};
    // Compare the incoming prop to previous prop
    if(prevProps.work && prevProps.work.isDirty && props.work && !props.work.isDirty){
        console.log('clean state!',prevProps,"=>",props)
        state.onCleaned&&state.onCleaned();
    }
    else
    {
       
    }
    return {
        prevProps:props      
    }
}
  onSnapToItem=(index)=>
  {
    this.props.selectScene(this.props.work,index);
  }
  scrollToTop = () => {
    const ref = 'list' + this.props.eventList.index
    this.refs[ref] && this.refs[ref].scrollTo({x: 0, y: 0, animated: true})
  }
  onRecordFinished=(event)=>{
    this.props.selectAudio(this.props.work,event.sindex,event.file,false);
  }
  onRecording=(event)=>{

  }
  onImageSelect=(index)=>{
    Picker.selectPhotoTapped((uri)=>{
      console.log("select:",uri)
      this.props.selectImage(this.props.work,index,uri);
    })
  }
  syncWork=()=>{
    this.props.syncWork(this.props.work);
  }
  deleteCurrentScene=()=>{
    this.props.deleteCurrentScene(this.props.work)
  }
  insertScene=()=>{
    scene={img:'+',snd:'+',duration:10};
    this.props.insertScene(this.props.work,scene)
    this._workControl.snapToItem(this.props.work.current+1);
  }
  sendNewMessage=()=>{
    const {stompClient}=this.props.message;
    if(stompClient){
      stompClient.publish({destination: "/center/message", body: JSON.stringify({action:"hello"})});
    }
  }
  createWork=()=>{
    if(this.props.work.isDirty)
    {
      Alert.alert(
        '温馨提示',
        '当前作品已经修改，是否保存？',
        [
          {text: '不保存', onPress: () =>{
            const work=this.getEmptyWork();
            this.props.selectWork(work);
          }},
          {text: '取消', onPress: () => {}, style: 'cancel'},
          {text: '保存后继续', onPress: () => {
            this.syncWork();
            this.setState({onCleaned:(()=>{
              const work=this.getEmptyWork();
              this.props.selectWork(work); 
            }).bind(this)});
          }},
        ],
        { cancelable: false }
      )
    }
    

  }
  getEmptyWork=()=>{
    let source = require('../assets/icon_nan.png');
    return {
      content:{
        channel:1,
        titleIcon:{source},
        title:'',
        titleDescription:'',
        likes:0,
        comments:0,
        age:'刚才',
        scenes: [
          {
            img:'+',
            snd:'+',
          }     
        ]
      }
    }
  }
  getWork = ()=>{
    let source = require('../assets/icon_nan.png');
    return {
      content:{
        channel:1,
        titleIcon:{source},
        title:'作品',
        titleDescription:'作品描述',
        likes:90,
        comments:10,
        age:'11小时前',
        scenes: [
          {
            img:'https://www.xinrong.com/webapp2.0/webapp3.0/images/banner/22.jpg',
            snd:'http://192.168.2.149/s/1.mp3',
            duration:100,
          }
          ,
          {
            img:'https://www.xinrong.com/webapp2.0/webapp3.0/images/banner/23.jpg',
            snd:'http://192.168.2.149/s/2.mp3',
            duration:200
          },
          // {
          //   img:'https://www.xinrong.com/webapp2.0/webapp3.0/images/banner/20.jpg',
          //   snd:'http://192.168.2.149/s/3.mp3',
          //   duration:300
          // }            
        ]
      }
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
  renderFooterView(){
    return (
      <Footer>
      <FooterTab>
        <Button vertical >
          <Icon type="EvilIcons"  name="plus" onPress={this.insertScene} />
          <Text>加页</Text>
        </Button>
        <Button vertical>
          <Icon type="EvilIcons"   name="minus"  onPress={this.deleteCurrentScene}/>
          <Text>删页</Text>
        </Button>
        <Button vertical>
          <Icon type="EvilIcons"   name="sc-instagram" onPress={this.sendNewMessage} />
          <Text>新建</Text>
        </Button>
        <Button vertical>
          <Icon  type="EvilIcons"  name="trash" />
          <Text>删除</Text>
        </Button>
        <Button vertical active={true} onPress={this.syncWork}>
        <Icon  type="EvilIcons"   name="refresh" />
        <Text>同步</Text>
      </Button>
      </FooterTab>
    </Footer>
    )
    
  }
  renderProgress(){
    if(this.props.work.isSyncing)
    {
      ModalIndicator.show(`正在同步`);  
    }else
    {
      ModalIndicator.hide();  
    }
    return (null)
  }
  renderPage() {
    const {user,work}=this.props;
    if(work.content)
      return (
        <View style={{flex: 1}}>
          {this.renderProgress()}
          <Work  navigation={this.props.navigation}  ref={ref => this._workControl = ref} 
          user={user} 
          work={work} 
          imageSelector={this.onImageSelect}
          onSnapToItem={this.onSnapToItem}
          onRecordFinished={this.onRecordFinished}
          onRecording={this.onRecording}
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
    work: state.work,
    message:state.message

    // eventList: state.eventList
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    selectWork: (work) => {
      dispatch(WorkAction.selectWork(work))
    },
    selectImage: (work,index,filepath) => {
      dispatch(WorkAction.selectImage(work,index, filepath))
    },
    selectAudio: (work,index,filepath,play) => {
      dispatch(WorkAction.selectAudio(work, filepath))
    },
    deleteCurrentScene:(work) => {
      dispatch(WorkAction.deleteScene(work))
    },
    insertScene:(work,scene) => {
      dispatch(WorkAction.addScene(work,scene))
    },
    syncWorkMerge:(work,merging)=>{
      dispatch(WorkAction.syncWorkUploadSuccess(work,merging))
    },
    syncWorkFail:(work)=>{
      dispatch(WorkAction.syncWorkUploadFail(work))
    },
    syncWork:(work)=>{
      dispatch(WorkAction.syncWork(work))
    },
    selectScene:(work,index)=>{
      dispatch(WorkAction.selectScene(work,index));
    }
  }
}

export default connect(matStateToProps, mapDispatchToProps, null, {withforwardRefRef: true})(WorkScreen)

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
});