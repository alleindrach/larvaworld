
import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  ViewPropTypes,
  TouchableOpacity,
  Image
} from 'react-native'
import PropTypes from 'prop-types';
import SceneCarousel from './SceneCarousel'
// import AudioPlayer from '../components/AudioPlayer'
import {Overlay} from 'teaset'
import {showDialog} from '../component/Dialog'
import {MediaAction} from "../redux/action";
import {connect} from "react-redux";

class MediaBox extends Component {
  static propTypes = {
    style: ViewPropTypes.style,
    scenes: PropTypes.array,
  };

  constructor(props) {
    super(props);
  }

  _renderScene = () => {
    return this.props.scenes && this.props.scenes.length ?
      <SceneCarousel style={{marginTop: em(44)}} showPreview={true} scenes={this.props.scenes}/> : null
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
        {this._renderScene()}
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