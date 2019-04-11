/**
 * Created by jialing on 2017/9/2.
 */

'use strict';

import React, {Component} from 'react'
import PropTypes from 'prop-types';
import {StyleSheet,  View,  Image,  ColorPropType,Platform,Dimensions} from 'react-native'
import Colors from '../common/Colors';
import global from '../common/Global';
import { Container, Header, Left, Body, Right, Button, Icon, Title, Text } from 'native-base';

export const NAVBAR_HEIGHT = iOS ? 20 + em(94) : em(94)

export default class BaseScreen extends Component {
  static defaultProps = {
    navColor: Colors.navColor,
    title: null,
    showBackButton: false,
  };

  static propTypes = {
    navColor: ColorPropType,
    title: PropTypes.string,
    showBackButton: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    // this.pageWillLeave.bind(this);
    // this.renderNavigationTitle.bind(this);
    // this.renderNavigationLeftView.bind(this);
    // this.renderNavigationRightView.bind(this);
    // this.renderNavigationBar.bind(this);
    // this.renderPage.bind(this);
  }

  componentDidMount() {
    this._isMounted = true
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  pageWillLeave() {
    return true
  }

  renderNavigationTitle() {
   return (
        this.props.title
   ) 
  }

  renderNavigationLeftView() {
    if (!this.props.showBackButton) return null;
    return (
            <Button transparent  onPress={() => this.pageWillLeave() && this.props.navigation.goBack()}>
              <Icon name='arrow-back' />
            </Button>  
    );
  }

  renderNavigationRightView() {
    return null;
  }

  renderNavigationBar() {
    return (
      <View style={styles.navContainer}>
        <Header style={[styles.navBar, {backgroundColor: this.props.navColor}]}>
            <Left>{this.renderNavigationLeftView()}</Left>
            <Body><Title style={{fontSize:em(50)}}>{this.renderNavigationTitle()}</Title></Body>
            <Right>{this.renderNavigationRightView()}</Right>
        </Header>
        <Image style={[styles.navImage, {tintColor: this.props.navColor}]} source={require('../assets/top.png')}/>
      </View>
    );
  }

  renderPage() {
    return null;
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.pageContainer}>
          {this.renderPage()}
        </View>
        {this.renderNavigationBar()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgColor
  },
  navContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center'
  },
  navBar: {
    width: SCREEN_WIDTH,
    height: NAVBAR_HEIGHT,
    paddingLeft: 0,
    paddingRight: 0,
    position: 'relative'
  },
  navImage: {
    width: SCREEN_WIDTH,
    resizeMode: 'contain'
  },
  pageContainer: {
    flex: 1,
    marginTop: NAVBAR_HEIGHT
  }
})