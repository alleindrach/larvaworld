/**
 * Created by jialing on 2017/6/29.
 */
import React from 'react'
import {Alert, StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import Barcode from 'react-native-smart-barcode'
import Colors from '../common/Colors'
import BaseScreen from './BaseScreen'
import config from '../config/Config'
import {selectCropPhoto,readQrCode} from '../utils/PickerUtils'
import queryString from "query-string";
import {ModalIndicator, Toast} from "teaset";
import {connect} from 'react-redux'

class MakefriendScreen extends BaseScreen {
  static navigationOptions = {header: null};

  static defaultProps = {
    ...BaseScreen.defaultProps,
    navColor: Colors.signInSegment,
    showBackButton: true,
  };

  constructor(props) {
    super(props);
    // 初始状态
    const {params} = this.props.navigation.state;
    if (params && params.friend)
        this.state = {
            friend: params.friend,
        };
  }

  renderNavigationTitle() {
    const {params} = this.props.navigation.state;
    if (params && params.title)
      return params.title;
    return '加好友'
  }


  renderPage() {
    return (
      <View style={styles.container}>
        <Text style={{flex:1,fontSize:em(50),color:Colors.navColor,backgroundColor:Colors.bgColor,textAlign:"center"}}>{this.state.friend.name}</Text>
      </View>
    )
  }
}

export default connect(state => ({
  user: state.user
}))(MakefriendScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
     alignItems: 'center'
  },
  rightView: {
    flexDirection: 'row',
    paddingRight: em(24),
    justifyContent: 'center',
    alignItems: 'center'
  },
  rightText: {color: '#fff', fontSize: em(30), marginRight: em(12)}
})
