
import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  ViewPropTypes,
  TouchableOpacity,
  Image
} from 'react-native'
import PropTypes from 'prop-types';
import ImageCarousel from '../component/ImageCarousel'
// import AudioPlayer from '../components/AudioPlayer'
import {Overlay} from 'teaset'
import {showDialog} from '../component/Dialog'
import {MediaAction} from "../redux/action";
import {connect} from "react-redux";

class MediaBox extends Component {
  static propTypes = {
    style: ViewPropTypes.style,
    images: PropTypes.arrayOf(PropTypes.string),
    audio: PropTypes.string,
  };

  constructor(props) {
    super(props);
  }

  _renderImage = () => {
    return this.props.images && this.props.images.length ?
      <ImageCarousel style={{marginTop: em(44)}} showPreview={true} images={this.props.images}/> : null
  }

//   _renderAudio = () => {
//     if (!this.props.audio)
//       return null;

//     const {mediaStore, playAudio} = this.props;
//     if (iOS)
//       return (
//         <AudioPlayer style={{marginTop: em(44), alignSelf: 'center'}} autoPlay={false} controls={true}
//                      path={this.props.audio}
//                      audioStore={mediaStore.audio} whenAudioPlay={playAudio}/>
//       )
//     else
//       return (
//         <TouchableOpacity style={{alignItems: 'center', marginTop: em(44)}} onPress={() => {
//           let key = showDialog((
//             <AudioPlayer style={{alignSelf:'center'}} path={this.props.audio} controls={true} autoPlay={true}
//                          whenAudioPlay={playAudio} audioStore={mediaStore.audio}/>
//           ), {modal: true})
//         }}>
//           <Image source={require('../assets/home/disc.png')} style={styles.audioBg}/>
//           <Image style={styles.audioPlayBtn} source={require('../assets/home/play.png')}/>
//         </TouchableOpacity>
//       )
//   }


  render() {
    return (
      <View style={[styles.container, this.props.style]}>
        {this._renderImage()}
        // {this._renderAudio()}
      </View>
    )
  }
}

export default connect(state => {
  return {
    // mediaStore: state.media
  }
}, dispatch => {
  return {
    playAudio: (id) => {
      dispatch(MediaAction.playAudio(id))
    }
  }
})(MediaBox)

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    justifyContent: 'center',
    alignItems: 'center'
  },
  audioBg: {
    width: em(448),
    height: em(448),
  },
  audioPlayBtn: {
    position: 'absolute',
    alignSelf: 'center',
    marginTop: em(340)
  }
})