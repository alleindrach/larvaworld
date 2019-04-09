

import React, {Component} from 'react'
import PropTypes from 'prop-types';
import {
  StyleSheet,
  View,
  Image,
  ViewPropTypes,
  Input
} from 'react-native'

export default class CustomView extends Component {
  static defaultProps = {}

  static propTypes = {
    style: ViewPropTypes.style,
    containerStyle: ViewPropTypes.style,
    bottomIcon: Image.propTypes.source,
    bottomIconStyle: Image.propTypes.style,
    bottomIconPosition: PropTypes.oneOf([
      'Right',
      'Left',
    ]),
  }

  constructor(props) {
    super(props);
    this.state = {}
  }

  getBottomIconStyle = () => {
    let {bottomIconStyle, bottomIconPosition} = this.props
    switch (bottomIconPosition) {
      case 'Left':
        return [bottomIconStyle, {alignSelf: 'flex-start'}]
        break
      case 'Right':
        return [bottomIconStyle, {alignSelf: 'flex-end'}]
        break
      default:
        return bottomIconStyle
    }
  }
  render() {
    const {style, containerStyle, bottomIcon, children} = this.props
    const bottomIconStyle = this.getBottomIconStyle()
    return (
      <View style={style}>
        <View style={[styles.container, containerStyle]}>
            {children}
        </View>
        { bottomIcon ? <Image source={bottomIcon} style={bottomIconStyle}/> : null }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: em(24),
    borderRadius: em(40)
  },
})