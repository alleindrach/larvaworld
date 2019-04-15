
import React, {Component} from 'react'
import PropTypes from 'prop-types';
import {
  StyleSheet,
  View,
  Image,
  ViewPropTypes,
  Text,
  TouchableOpacity,
  ColorPropType
} from 'react-native'
import CachedImage from './cachedimage/CacheImage'
import {connect} from 'react-redux'

class Avatar extends Component {
  static defaultProps = {
    user: {
      nickname: '',
      avatar: '',
      identity: []
    },
    showName: true,
    isAgree: true,
    showBorder: false,
    borderColor: 'rgb(95,188,232)'
  };

  static propTypes = {
    style: ViewPropTypes.style,
    containerStyle: ViewPropTypes.style,
    onPress: PropTypes.func,
    user: PropTypes.object.isRequired,
    size: PropTypes.number,
    showName: PropTypes.bool,
    nameStyle: Text.propTypes.style,
    isAgree: PropTypes.bool,
    navigation: PropTypes.object,
    showBorder: PropTypes.bool,
    borderColor: ColorPropType
  };

  constructor(props) {
    super(props)
  }

  _getIcon = (type, iconSize, index) => {
    let source;
    switch (type) {
      case 'patriarch':
        source = require('../assets/icon_rzjz.png');
        break;
      case 'teacher':
        source = require('../assets/icon_rzls.png');
        break;
      case 'expert':
        source = require('../assets/icon_rzzj.png');
        break;
      case 'leader':
        source = require('../assets/icon_rzfzr.png');
        break;
      default:
        return 'null'
    }
    return <Image
      key={index}
      style={[styles.iconContainer, {
        width: iconSize,
        height: iconSize,
      }]} source={source}/>
  };

  render() {
    let {_id, nickname, identity, avatar} = Object.assign({nickname: '', identity: [], avatar: ''}, this.props.user)

    const size = this.props.size;
    const iconSize = size / 4.5;
    const opacity = this.props.isAgree ? 1 : 0.5;

    const style = {
      width: size,
      height: size,
      borderRadius: size / 2,
      opacity: opacity
    };

    const showBorder = this.props.showBorder;
    const borderWidth = Math.ceil(em(6));
    const realSize = showBorder ? size + borderWidth * 2 : size;
    const borderStyle = {
      width: realSize,
      height: realSize,
      borderRadius: realSize / 2,
      borderWidth: showBorder ? borderWidth : 0,
      borderColor: this.props.borderColor
    };

    return (
      <View style={this.props.containerStyle}>
        <View style={[styles.container, this.props.style]}>
          <TouchableOpacity ref="img" style={[style, borderStyle]} onPress={() => {
            if (this.props.onPress) {
              this.props.onPress()
            } else {
            //   if (this.props.navigation) {
            //     if (_id === this.props.self._id) {
            //       this.props.navigation.navigate('MyHomepage', {user: this.props.user})
            //     } else {
            //       this.props.navigation.navigate('PersonalHomepage', {user: this.props.user})
            //     }
            //   }
            }
          }}>
            <CachedImage style={style} source={{uri: avatar}}
                         defaultSource={require('../assets/icon_nan.png')}
                         errorSource={require('../assets/icon_nan.png')}
            />
            <View style={[styles.userType, {height: iconSize}]}>
              {
                identity.map((type, index) =>
                  this._getIcon(type, iconSize, index)
                )
              }
            </View>
          </TouchableOpacity>
        </View>
        {this.props.showName ?
          <Text numberOfLines={1}
                style={[styles.nickName, {fontSize: iconSize}, this.props.nameStyle]}>{nickname}</Text> : null}
      </View>
    )
  }

  measureInWindow = (...args) => {
    this.refs['img'] && this.refs['img'].measureInWindow(...args);
  }
}

export default connect(state => {
  return {
    self: state.user
  }
}, null, null, {withforwardRefRef: true})(Avatar)

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  userType: {
    position: 'absolute',
    flexDirection: 'row',
    bottom: 2,
    right: 2,
    backgroundColor: 'transparent',
    alignSelf: 'flex-end'
  },
  nickName: {
    color: '#000',
    textAlign: 'center',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    // overflow: 'hidden'
  }
});
