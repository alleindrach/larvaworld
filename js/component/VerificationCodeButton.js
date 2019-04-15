
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import Colors from '../common/Colors'

export default class VerificationCodeButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      duration: 60,
      buttonTitle: '获取验证码',
      isClickable: true,
    };
  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }

  startTimer() {
    if (!this.state.isClickable) {
      return
    }
    this.setState({isClickable: false});
    this.interval = setInterval(() => {
      const rest = this.state.duration - 1;
      if (rest <= 0) {
        this.stopTimer();
      } else {
        this.setState({
          duration: rest,
          buttonTitle: `重新获取(${rest}s)`,
        })
      }
    }, 1000)
  }

  stopTimer() {
    this.interval && clearInterval(this.interval);
    this.setState({
      duration: 60,
      buttonTitle: '获取验证码',
      isClickable: true
    })
  }

  render() {
    const {onClick, isValid} = this.props;
    const {buttonTitle, isClickable} = this.state;
    return (
      <TouchableOpacity
        style={[styles.button, {backgroundColor: ((isValid && isClickable) ? Colors.navColor : 'rgb(204,204,204)')}]}
        activeOpacity={(isValid && isClickable) ? 0.8 : 1}
        onPress={() => {
          if (isValid && isClickable) {
            onClick && onClick()
          }
        }}>
        <Text style={styles.text}>{buttonTitle}</Text>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    borderRadius: em(20),
    height: em(68),
    width: em(200),
  },
  text: {
    color: 'white',
    textAlign: 'center'
  },
});