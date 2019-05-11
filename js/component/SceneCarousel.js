

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
    this._touchRefs = []
    this._audioTracks=[]
  }

  _onImagePress = (index) => {
    if (!this.props.onImageSelect)
      return
    this.props.onImageSelect(index)
  }
  snapToItem=(index)=>{
    this._carousel.snapToItem(index);
  }
  startRecord=async ()=>{
    const index=this._carousel.currentIndex;
    const audioTrack=this._audioTracks[index];
    if(audioTrack){
      return audioTrack.record();
    }
  }
  stopRecord=async ()=>{
    const index=this._carousel.currentIndex;
    const audioTrack=this._audioTracks[index];
    if(audioTrack){
      return audioTrack.stop();
    }
  }
  _onSnapToItem=(index)=>{
    if (!this.props.onSnapToItem)
          return
    this.props.onSnapToItem(index)
  }
  _renderItem = ({item, index}) => {
    const {scenes,itemWidth, itemHeight,audioHeight} = this.props
    // console.log('scenes:',scenes)
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
                  resizeMode="cover" showIndicator={true}
                />
                <View style={styles.pageView}>
                  <Text style={styles.pageText}>{`${index + 1}/${scenes.length}`}</Text>
                </View>
              </View>
            </TouchableHighlight>
            <AudioTrack
              ref={ref => this._audioTracks[index] = ref}
              style={{width:SCREEN_WIDTH,height:em(100),backgroundColor:'transparent'}} 
              source={{uri:item.snd}} 
              cache={true} sindex={index} play={item.sndPlay}
              onRecordFinished={this.props.onRecordFinished}
              onRecording={this.props.onRecording}
            /> 
          </View>
    )
  }

  render() {
    const {scenes, style, sliderWidth, sliderHeight, itemWidth, itemHeight} = this.props
    return (
      <View style={[{width: SCREEN_WIDTH,backgroundColor:'transparent'}, style]}>
        <Carousel ref={ref => this._carousel = ref}
          data={scenes}
          renderItem={this._renderItem}
          sliderWidth={sliderWidth}
          sliderHeight={sliderHeight}
          itemWidth={itemWidth}
          itemHeight={itemHeight}
          useNativeOnScroll={true}
          inactiveSlideScale={0.95}
          firstItem={this.props.firstItem}
          onSnapToItem={this._onSnapToItem.bind(this)
          }
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