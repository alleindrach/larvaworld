

import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  ViewPropTypes,
  TouchableHighlight,
  Text,
  Image
} from 'react-native'
import Carousel from 'react-native-snap-carousel'
import CachedImage from './cached/CacheImage'
import AudioTrack from './AudioTrack'
// import FullImageView from './FullImageView'
import PropTypes from 'prop-types';
const SLIDER_WIDTH = em(750)
const SLIDER_HEIGHT = em(480+240)
const IMAGE_WIDTH = em(700)
const IMAGE_HEIGHT = em(480)
const AUDIO_HEIGHT=em(100)
export default class SceneCarousel extends Component {
  static defaultProps = {
    images: [],
    showPreview: true,
    sliderWidth: SLIDER_WIDTH,
    sliderHeight: SLIDER_HEIGHT,
    itemWidth: IMAGE_WIDTH,
    itemHeight: IMAGE_HEIGHT+AUDIO_HEIGHT,
    audioHeight: AUDIO_HEIGHT
  };

  static propTypes = {
    style: ViewPropTypes.style,
    scenes: PropTypes.array.isRequired,
    showPreview: PropTypes.bool,
    sliderWidth: PropTypes.number,
    sliderHeight: PropTypes.number,
    itemWidth: PropTypes.number,
    itemHeight: PropTypes.number,
  };

  constructor(props) {
    super(props)
    this.state = {
      index: 0
    }
    this._touchRefs = []
  }

  _onImagePress = (index) => {
    if (!this.props.onImageSelect)
      return
    this.props.onImageSelect(index)
    // this._touchRefs[index].measureInWindow((x, y, width, height) => {
    //   this._fullImageView.show({x, y, width, height}, this.props.images, index)
    // });
  }

  _renderItem = ({item, index}) => {
    const {scenes,itemWidth, itemHeight,audioHeight} = this.props
    return (
       
          <View style={styles.sceneWraper}>
            <TouchableHighlight
              ref={ref => this._touchRefs[index] = ref}
              onPress={() => this._onImagePress(index)}
              style={{width: itemWidth, height: itemHeight-audioHeight}}
            >
              <View style={{width: itemWidth, height: itemHeight-audioHeight, alignSelf: 'center'}}>
                <CachedImage
                  source={{uri: item.img}}
                  style={{width: itemWidth, height: itemHeight-audioHeight, alignSelf: 'center',backgroundColor:'white'}}
                  resizeMode="cover"
                />
                <View style={styles.pageView}>
                  <Text style={styles.pageText}>{`${this.state.index + 1}/${scenes.length}`}</Text>
                </View>
              </View>
            </TouchableHighlight>
            <AudioTrack style={{width:SCREEN_WIDTH,height:em(100),backgroundColor:'transparent'}} source={{uri:item.snd}} cache={true}/>
          </View>
    )
  }

  render() {
    const {scenes, style, sliderWidth, sliderHeight, itemWidth, itemHeight} = this.props
    return (
      <View style={[{width: SCREEN_WIDTH,backgroundColor:'transparent'}, style]}>
        <Carousel
          data={scenes}
          renderItem={this._renderItem}
          sliderWidth={sliderWidth}
          sliderHeight={sliderHeight}
          itemWidth={itemWidth}
          itemHeight={itemHeight}
          useNativeOnScroll={true}
          inactiveSlideScale={0.95}
          onSnapToItem={this.onSnapToItem}
        />
        
        
      </View>
    )
  }
}

const styles = StyleSheet.create({
  sceneWraper: {
    height:IMAGE_HEIGHT+AUDIO_HEIGHT,
    width:em(700),
    justifyContent:'flex-start',
    // bottom:em(80),
    alignItems: 'center',
    marginTop:em(10),
    marginBottom:em(10),
    overflow:'hidden',
    backgroundColor: 'black',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgb(238,238,238)'
  },
  pageView: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    width: em(82),
    height: em(40),
    borderRadius: em(20),
    borderColor: '#fff',
    borderWidth: em(2),
    bottom: em(20),
    left: em(10 + 15 + 20),
    backgroundColor: 'transparent'
  },
  pageText: {
    fontSize: em(20),
    color: '#fff'
  }
})