
import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  ViewPropTypes,
  TouchableOpacity,
  Image,
  Text,
  Modal,
  Alert
} from 'react-native'

import Colors from '../common/Colors'
import MediaBox from '../component/MediaBox'
import Avatar from '../component/Avatar'
import {Menu} from 'teaset'
import ActionSheet from 'teaset/components/ActionSheet/ActionSheet'
import config from '../config/Config'
import Toast from 'teaset/components/Toast/Toast'
import {getDateTimeString} from '../utils/TimeUtils'
import PropTypes from 'prop-types'

export default class Work extends Component {
  static defaultProps = {
    data: {},
    textSelectable: false,
    showDelBtn: true,
    showCommentBtn: true,
    showLikeBtn: true,
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

  render() {
    const data = this.props.data;
    data.user._id = data.user.id
    return (
      <View style={styles.container}>
        <MediaBox
          images={data.content.images}
          navigation={this.props.navigation}/>
        
        {this.props.showDelBtn && <TouchableOpacity style={styles.deleteBtn} onPress={this._showActionSheet}>
          <Image source={require('../assets/home/del.png')}/>
        </TouchableOpacity>}
      </View>
    )
  }

  _showActionSheet = () => {
    const {data} = this.props;
    let items = [
      {
        title: '屏蔽', onPress: () => {
          Alert.alert(
            '提示',
            '您是否要屏蔽这条动态？',
            [
              {
                text: '取消', onPress: () => {
                }, style: 'cancel'
              },
              {
                text: '屏蔽', onPress: () => {
                  this.props.onDelete && this.props.onDelete()
                  Toast.success('屏蔽成功')
                  if (this.props.user.isLogin) {
                    request.post(config.api.base + config.api.shieldEvent, {eventId: data.eventId})
                      .then(r => {
                        if (r.code === 0) {
                          //success
                          // Toast.success('屏蔽成功')
                        } else {
                          // Toast.fail('屏蔽失败，原因是：' + r.message)
                        }
                      })
                      .catch(err => {
                        // Toast.fail('屏蔽失败，原因是：' + err.message)
                      })
                  }
                }
              },
            ],
            {cancelable: true}
          )
        }
      },
      {
        title: '举报', onPress: () => {
          this.props.navigation.navigate('ReportPage', {
            data: {
              workId: data.content.workId
            }
          })
        }
      },
    ];
    let cancelItem = {title: '取消'};
    ActionSheet.show(items, cancelItem);
  }
}


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