
import {Dimensions, PixelRatio, Platform} from 'react-native';


let {height, width} = Dimensions.get('window');

// 获取屏幕宽度
global.SCREEN_WIDTH = width;
// 获取屏幕高度
global.SCREEN_HEIGHT = height;
// 获取屏幕分辨率
global.PixelRatio = PixelRatio.get();
// 系统是iOS
global.iOS = (Platform.OS === 'ios');
// 系统是安卓
global.Android = (Platform.OS === 'android');
//
global.WXAppID = 'wx707278e4db1ce67b';

global.SegmentName = {
  'theme': '主题',
  'topic': '话题',
  'signIn': '签到',
  'notice': '通知',
  'uploading': '上传',
  'elect': '评选',
  'course': '课程'
};

global.IdentityName = {
  'patriarch': '家长',
  'teacher': '老师',
  'expert': '专家',
  'leader': '负责人'
};

global.ErrCode = {
  NoLogin: -1003,
  NoIdentity: -1004
};

global.ActivityStatus = {
  save: 'save',
  ongoing: 'ongoing',
  end: 'end'
};

global.PointRemark = {
  'addActivity': {text: '发布活动', point: '+5'},
  'joinActivity': {text: '参加活动', point: '+3'},
  'addWork': {text: '上传作品', point: '+5'},
  'addPost': {text: '发表评论', point: '+1'},
  'addPraise': {text: '点赞', point: '+1'},
  'addFollow': {text: '关注他人', point: '+1'},
  'signActivity': {text: '活动签到成功', point: '+1'}
};

global.pt2px = pt => PixelRatio.getPixelSizeForLayoutSize(pt);

global.px2pt = px => PixelRatio.roundToNearestPixel(px);

const UIWidth = 750;

global.em = (uiPx) => {
  return uiPx * global.SCREEN_WIDTH / UIWidth
};