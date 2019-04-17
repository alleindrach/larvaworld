/**
 * Created by jialing on 2017/5/25.
 */

import React from 'react';
import {ActivityIndicator, Image, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View} from 'react-native';
import BaseScreen from '../pages/BaseScreen'
import Avatar from '../component/Avatar'
import Work from '../component/Work'
import Colors from '../common/Colors'
import {connect} from 'react-redux'
// import BaseListView from '../component/BaseListView'
import {EventAction} from '../redux/action'
import {Button, Projector, SegmentedBar, Theme, Toast} from 'teaset'
import Icon from 'react-native-vector-icons/Ionicons'



class HomeIndex extends BaseScreen {
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

  }

  scrollToTop = () => {
    const ref = 'list' + this.props.eventList.index
    this.refs[ref] && this.refs[ref].scrollTo({x: 0, y: 0, animated: true})
  }

  rowData = ()=>{
    return {
      content:{
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

  renderPage() {
    return (
 
        <View style={{flex: 1}}>
          <Work navigation={this.props.navigation} 
          user={this.props.user} 
          data={this.rowData()} 
          />
        </View>
    
    );

  }
}

const matStateToProps = (state) => {
  return {
    user: state.user,
    // eventList: state.eventList
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onRefresh: (index) => {
      dispatch(EventAction.fetch(index, 'refresh'))
    },
    onLoadMore: (index) => {
      dispatch(EventAction.fetch(index, 'more'))
    },
    onDeleteRow: (index, rowID) => {
      dispatch(EventAction.deleteRow(index, rowID))
    },
    switch: (index) => {
      dispatch(EventAction.switchIndex(index))
    },
   
  }
}

export default connect(matStateToProps, mapDispatchToProps, null, {withforwardRefRef: true})(HomeIndex)

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