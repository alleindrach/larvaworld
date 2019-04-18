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

import { Container, Header, Content, Footer, FooterTab, Button, Icon, Text } from 'native-base';


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
    this.props.selectWork(this.getWork());
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
  getWork = ()=>{
    let source = require('../assets/icon_nan.png');
    return {
      content:{
        titleIcon:{source},
        title:'作品',
        titleDescription:'作品描述',
        likes:90,
        comments:10,
        age:'11小时前',
        scenes: [
          {
            img:'https://www.xinrong.com/webapp2.0/webapp3.0/images/banner/22.jpg',
            snd:'http://192.168.2.149/s/test.mp3'
          }
          ,
          {
            img:'https://www.xinrong.com/webapp2.0/webapp3.0/images/banner/23.jpg',
            snd:'http://192.168.2.149/s/test.mp3'
          },
          {
            img:'https://www.xinrong.com/webapp2.0/webapp3.0/images/banner/20.jpg',
            snd:'http://192.168.2.149/s/test.mp3'
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
        <Button vertical>
          <Icon name="apps" />
          <Text>Apps</Text>
        </Button>
        <Button vertical>
          <Icon name="camera" />
          <Text>Camera</Text>
        </Button>
        <Button vertical active={true}>
          <Icon  name="navigate" />
          <Text>Navigate</Text>
        </Button>
        <Button vertical>
          <Icon name="person" />
          <Text>Contact</Text>
        </Button>
      </FooterTab>
    </Footer>
    )
    
  }
  renderPage() {
    const {user,work}=this.props;
    if(work.content)
      return (
        <View style={{flex: 1}}>
          <Work navigation={this.props.navigation} 
          user={user} 
          work={work} 
          imageSelector={this.onImageSelect}
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
    }
  }
}

export default connect(matStateToProps, mapDispatchToProps, null, {withforwardRefRef: true})(WorkScreen)

const styles = StyleSheet.create({
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