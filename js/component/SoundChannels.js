
import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  ViewPropTypes,
  TouchableOpacity,
  Image,
  Modal,
  Alert
} from 'react-native'
import { Container, Header, Content, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body, Right } from 'native-base';
import Colors from '../common/Colors'
import SceneCarousel from './SceneCarousel'
import {Menu} from 'teaset'
import ActionSheet from 'teaset/components/ActionSheet/ActionSheet'
import config from '../config/Config'
import Toast from 'teaset/components/Toast/Toast'
import {getDateTimeString} from '../utils/TimeUtils'
import PropTypes from 'prop-types'
import *  as SoundChannelsAction from "../redux/action/SoundChannelsAction"
import {connect} from 'react-redux'
export  default class SoundChannels extends Component {
  static defaultProps = {
    data: {},
    textSelectable: false,
    showDelBtn: true,
    showCommentBtn: true,
    showLikeBtn: true,
    visualItem:0
  };

  static propTypes = {
    style: ViewPropTypes.style,
    data: PropTypes.object.isRequired,
    textSelectable: PropTypes.bool,
    onDelete: PropTypes.func,
    user: PropTypes.object,
    showDelBtn: PropTypes.bool,
    showCommentBtn: PropTypes.bool,
    showLikeBtn: PropTypes.bool,
    onCommentBtnPress: PropTypes.func,
    onLikeBtnPress: PropTypes.func,
    
  };

  constructor(props) {
    super(props);
    this.state = {}
  }
  snapToItem=(index)=>{
    this._scenesCarousel.snapToItem(index);
  }
  showMenu = () => {
    if (!this.menu) {
      return;
    }
    this.menu.measureInWindow((x, y, width, height) => {
      let items = [
        {
          title: <Text>删除</Text>, onPress: () => {
          }
        },
      ];
      Menu.show({x: x - 10, y: y - 10, width, height}, items, {
        popoverStyle: styles.popover,
        align: 'end',
        showArrow: true
      });
    });
  };
  startRecord=async ()=>{
    this._scenesCarousel.startRecord();
  }
  stopRecord=async ()=>{
    this._scenesCarousel.stopRecord();
  }
  render() {
    const channels = this.props.channels;
    // data.user._id = data.user.id
    return (

      <Container>
      <Header style={{height:em(10)}}/>
      <Content>
        <Card>
          <CardItem cardBody>
            <SceneCarousel 
            ref={ref => this._scenesCarousel = ref} 
            style={{marginTop: em(10)}}   
            scenes={channels.channels}  
            navigation={this.props.navigation}
            onImageSelect={this.props.imageSelector} 
            onSnapToItem={this.props.onSnapToItem}
            onRecordFinished={this.props.onRecordFinished}
            onRecording={this.props.onRecording}
            firstItem={this.props.firstItem}
            type='sound-morphy'/>
          </CardItem>
          <CardItem>
         
          <Right>
            
              <Icon  type="EvilIcons"  style={{fontSize:em(60)}}   name="refresh"  onPress={this.props.onSync}/>
            
          </Right>
        </CardItem>
        </Card>
      </Content>
    </Container>
      
    )
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // Typical usage (don't forget to compare props):
        // if(!this.props.channels.isFetch){
            
        //     this.props.fetchChannelsBg();
        // }
    }
    
}

// const matStateToProps = (state) => {
//   return {
//     user: state.user,
//     // soundChannels: state.soundChannels,
//     // message:state.message

//     // eventList: state.eventList
//   }
// }

// const mapDispatchToProps = (dispatch) => {
//   return {
//     fetchChannelsBg: (channel) => {
//       dispatch(SoundChannelsAction.prefetchChannels())
//     },
    
//   }
// }

// export default connect(matStateToProps, mapDispatchToProps, null, {withforwardRefRef: true})(SoundChannels)



const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingTop: em(52),
    paddingBottom: em(30),
    backgroundColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgb(238,238,238)'
  },
  handleBar: {
    flexDirection: 'row',
    marginHorizontal: em(84),
    alignItems: 'center'
  },
  btnContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  leaveMsgBtn: {
    alignItems: 'center',
    marginLeft: em(48)
  },
  likeBtn: {
    alignItems: 'center',
    marginRight: em(48)
  },
  btnText: {
    marginTop: em(12),
    fontSize: em(20),
    color: 'rgb(153,153,153)'
  },
  avatar: {
    marginHorizontal: em(52)
  },
  nickname: {
    fontSize: em(40),
    color: 'rgb(51,51,51)',
    marginTop: em(20)
  },
  activityTitle: {
    marginTop: em(32),
    marginHorizontal: em(112),
    fontSize: em(40),
    color: Colors.themeSegment,
  },
  dateText: {
    fontSize: em(30),
    // lineHeight: Math.round(em(34)),
    color: 'rgb(153,153,153)',
    marginTop: em(26)
  },
  bgImg: {
    marginTop: em(22),
    width: em(750),
    resizeMode: 'contain'
  },
  contentTitle: {
    marginTop: em(28),
    alignSelf: 'center',
    marginHorizontal: em(112),
    fontSize: em(40),
    color: Colors.work
  },
  contentText: {
    marginTop: em(54),
    lineHeight: Math.round(em(40)),
    marginHorizontal: em(48),
    fontSize: em(35),
    color: 'rgb(51,51,51)'
  },
  deleteBtn: {
    position: 'absolute',
    right: em(24),
    top: em(12)
  }
});