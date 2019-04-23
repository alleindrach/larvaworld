
import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  NativeModules,
  ScrollView,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'
import Avatar from '../component/Avatar'
import {Toast} from 'teaset';
import {selectCropPhoto} from '../utils/PickerUtils'
import BaseScreen from './BaseScreen'
import Colors from '../common/Colors'
import CustomView from '../component/CustomView'
import DeviceInfo from 'react-native-device-info'
import {showInputDialog} from '../component/Dialog'
import * as AppUtils from '../utils/AppUtils'
import {connect} from 'react-redux'
import {UserAction} from '../redux/action'

class MyProfileScreen extends BaseScreen {
  static navigationOptions = {
    header: null
  };

  static defaultProps = {
    navColor: Colors.navColor,
    title: ' 个人主页',
    showBackButton: true,
  };

  constructor(props) {
    super(props);
    this.state = {
      hasNewVersion: false,
      url: ''
    }
  }

  componentDidMount() {
    super.componentDidMount()
    this.props.fetchHomePageInfo();
    Android && AppUtils.checkVersion()
      .then(data => {
        this.setState({hasNewVersion: data.hasNewVersion, url: data.url})
      })
      .catch(err => Toast.message(err.message))
  }

  _upgrade = () => {
    if (this.state.hasNewVersion) {
      AppUtils.upgrade(this.state.url)
    } else {
      Toast.info('当前已是最新版本');
    }
  };

  _onFollowTextPress = () => {
    // this.props.navigation.navigate('ShowFollowUser', {user: this.props.user, type: 'follow'})
  }

  _onFansTextPress = () => {
    // this.props.navigation.navigate('ShowFollowUser', {user: this.props.user, type: 'beFollow'})
  }

  renderPage() {
    const {user} = this.props
    return (
      <View style={styles.container}>
        <View style={styles.topContainer}>
          <View style={styles.user}>
            <Avatar user={user} showName={false} size={em(106)}
                    onPress={() => selectCropPhoto(this.props.uploadAvatar)}/>
            <View style={styles.userInfo}>
              <TouchableOpacity onPress={() => {
                showInputDialog('修改昵称', '新昵称', this.props.modifyNickname)
              }}>
                <Text style={styles.nickname}>{user.nickname}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.props.navigation.navigate('MyPoints')}>
                <Text style={styles.pointText}>积分：{user.remainPoint || 0}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={{backgroundColor: '#fff', paddingBottom: em(24), marginBottom: em(24)}}>
          <View style={styles.userValueBar}>
            <View style={[styles.whiteSpace, {borderTopLeftRadius: 0, borderBottomLeftRadius: 0}]}/>
            <TouchableOpacity onPress={this._onFansTextPress}><Text
              style={styles.userValueText}>{user.fansNum}</Text></TouchableOpacity>
            <View style={styles.whiteSpace}/>
            <TouchableOpacity onPress={this._onFollowTextPress}><Text
              style={styles.userValueText}>{user.followNum}</Text></TouchableOpacity>
            <View style={[styles.whiteSpace, {borderTopRightRadius: 0, borderBottomRightRadius: 0}]}/>
          </View>
          <View style={styles.userLabelBar}>
            <TouchableOpacity onPress={this._onMyFriendsPress}><Text
              style={styles.userLabelText}>我的好友</Text></TouchableOpacity>
            <TouchableOpacity onPress={this._onFollowTextPress}><Text
              style={styles.userLabelText}>我的关注</Text></TouchableOpacity>
          </View>
        </View>
        
        <TouchableOpacity onPress={() => {
          this.props.navigation.navigate('MyWorks', {user})
        }}>
          <CustomView containerStyle={styles.rowContainer}
                      bottomIcon={require('../assets/activity/link_small.png')} bottomIconStyle={styles.linkLeft}>
            <Text style={styles.itemText}>我的作品</Text>
            <Icon style={styles.itemIcon} name="ios-arrow-forward" size={24}/>
          </CustomView>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {
          this.props.navigation.navigate('MyProfile')
        }}>
          <CustomView containerStyle={styles.rowContainer}
                      bottomIcon={require('../assets/activity/link_small.png')} bottomIconStyle={styles.linkRight}>
            <Text style={styles.itemText}>个人信息</Text>
            <Icon style={styles.itemIcon} name="ios-arrow-forward" size={24}/>
          </CustomView>
        </TouchableOpacity>
        {/*<TouchableOpacity onPress={() => {*/}
        {/*this.props.navigation.navigate('ChildInfo')*/}
        {/*}}>*/}
        {/*<CustomView containerStyle={styles.rowContainer}*/}
        {/*bottomIcon={require('../../assets/activity/link_small.png')} bottomIconStyle={styles.linkRight}>*/}
        {/*<Text style={styles.itemText}>孩子信息</Text>*/}
        {/*<Icon style={styles.itemIcon} name="ios-arrow-forward" size={24}/>*/}
        {/*</CustomView>*/}
        {/*</TouchableOpacity>*/}
        <TouchableOpacity onPress={() => {
          this.props.navigation.navigate('Authentication')
        }}>
          <CustomView containerStyle={styles.rowContainer}
                      bottomIcon={require('../assets/activity/link_small.png')} bottomIconStyle={styles.linkLeft}>
            <Text style={styles.itemText}>认证</Text>
            <Icon style={styles.itemIcon} name="ios-arrow-forward" size={24}/>
          </CustomView>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {
          this.props.doLogout()
          this.props.navigation.goBack();
          Toast.success('退出登录成功')
        }}>
          <CustomView containerStyle={styles.rowContainer}
                      bottomIcon={require('../assets/activity/link_small.png')}
                      bottomIconStyle={styles.linkRight}>
            <Text style={styles.itemText}>退出登录</Text>
            <Icon style={styles.itemIcon} name="ios-arrow-forward" size={24}/>
          </CustomView>
        </TouchableOpacity>
        {
          Android &&
          <TouchableOpacity onPress={() => {
            this._upgrade()
          }}>
            <CustomView containerStyle={styles.rowContainer}>
              <Text style={styles.itemText}>检查更新 {this.state.hasNewVersion ?
                <Text style={{color: '#f00'}}>new!</Text> : null}</Text>
              <Text style={{
                fontSize: em(24),
                color: 'rgb(102,102,102)',
                marginRight: em(24)
              }}>当前版本{DeviceInfo.getVersion()}</Text>
              <Icon style={styles.itemIcon} name="ios-arrow-forward" size={24}/>
            </CustomView>
          </TouchableOpacity>
        }
        {
          iOS &&
          <CustomView containerStyle={styles.rowContainer}>
            <Text style={styles.itemText}>当前版本{DeviceInfo.getVersion()}</Text>
            <Icon style={styles.itemIcon} name="ios-arrow-forward" size={24}/>
          </CustomView>
        }
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    doLogout: () => {
      dispatch(UserAction.logout())
    },
    fetchHomePageInfo: () => {
      dispatch(UserAction.fetchHomePageInfo())
    },
    uploadAvatar: (images) => {
      if (images)
        dispatch(UserAction.uploadAvatar(images))
    },
    modifyNickname: (nickname) => {
      if (!nickname)
        Alert.alert('请输入新昵称！')
      else
        dispatch(UserAction.modifyNickName(nickname))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyProfileScreen)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgColor
  },
  topContainer: {
    paddingVertical: em(28),
    alignItems: 'center',
    backgroundColor: Colors.navColor,
  },
  user: {
    alignItems: 'center',
  },
  userInfo: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  nickname: {
    marginTop: em(10),
    color: '#fff',
    fontSize: em(36),
    height: em(46)
  },
  pointText:{
    marginTop: em(10),
    color: '#fff',
    fontSize: em(30),
    height: em(45)
  },
  rowContainer: {
    marginHorizontal: em(24),
    padding: em(24),
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemIcon: {
    color: 'rgb(102,102,102)',
    alignSelf: 'flex-end'
  },
  linkLeft: {
    marginLeft: em(100),
  },
  linkRight: {
    marginRight: em(100),
    alignSelf: 'flex-end'
  },
  itemText: {
    flex: 1,
    fontSize: em(30),
    color: 'rgb(102,102,102)'
  },
  userValueBar: {
    backgroundColor: Colors.navColor,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  userValueText: {
    color: '#fff',
    fontSize: em(40),
  },
  whiteSpace: {
    width: em(110),
    backgroundColor: "#fff",
    borderRadius: em(30),
  },
  userLabelBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.navColor,
    marginHorizontal: em(50),
    borderRadius: em(30),
    paddingHorizontal: em(60),
    alignItems: 'center',
    paddingBottom: em(24),
    paddingTop: em(12)
  },
  userLabelText: {
    width: em(210),
    textAlign: 'center',
    color: '#fff',
    fontSize: em(28)
  }
});