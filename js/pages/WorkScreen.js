/**
 * Created by jialing on 2017/5/25.
 */

import React from 'react';
import {ActivityIndicator, Image, StyleSheet, TouchableHighlight, TouchableOpacity, View} from 'react-native';
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
    this.props.selectWork(this.getWork());
  }
  onSnapToItem=(index)=>
  {
    this.state.index=index;
  }
  scrollToTop = () => {
    const ref = 'list' + this.props.eventList.index
    this.refs[ref] && this.refs[ref].scrollTo({x: 0, y: 0, animated: true})
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
    this.props.deleteCurrentScene(this.props.work,this.state.index)
  }
  insertScene=()=>{
    scene={img:'+',snd:'+',duration:10};
    this.props.insertScene(this.props.work,this.state.index,scene)
    this._workControl.snapToItem(this.state.index+1);
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
          {
            img:'https://www.xinrong.com/webapp2.0/webapp3.0/images/banner/20.jpg',
            snd:'http://192.168.2.149/s/3.mp3',
            duration:300
          }            
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
          <Icon type="EvilIcons"   name="sc-instagram" />
          <Text>录音</Text>
        </Button>
        <Button vertical active={true} onPress={this.syncWork}>
          <Icon  type="EvilIcons"   name="refresh" />
          <Text>同步</Text>
        </Button>
        <Button vertical>
          <Icon  type="EvilIcons"  name="trash" />
          <Text>删除</Text>
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
    work: state.work
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
    selectAudio: (work,index,filepath) => {
      dispatch(WorkAction.selectAudio(work,index, filepath))
    },
    deleteCurrentScene:(work,index) => {
      dispatch(WorkAction.deleteScene(work,index))
    },
    insertScene:(work,index,scene) => {
      dispatch(WorkAction.addScene(work,index,scene))
    },
    syncWorkMerge:(work,merging)=>{
      dispatch(WorkAction.syncWorkUploadSuccess(work,merging))
    },
    syncWorkFail:(work)=>{
      dispatch(WorkAction.syncWorkUploadFail(work))
    },
    syncWork:(work)=>{
      dispatch(WorkAction.syncWork(work))
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