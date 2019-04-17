import React from 'react'
import { View, Image, Text, Slider, TouchableOpacity, Platform, Alert} from 'react-native';
import _ from 'lodash';
import Sound from 'react-native-sound';
import PropTypes from 'prop-types';
import * as  FileUtils from '../utils/FileUtils'
import * as CacheProvider from './cached/CacheProvider'

const img_speaker = require('../assets/sound/ui_speaker.png');
const img_pause = require('../assets/sound/ui_pause.png');
const img_play = require('../assets/sound//ui_play.png');
const img_playjumpleft = require('../assets/sound/ui_playjumpleft.png');
const img_playjumpright = require('../assets/sound/ui_playjumpright.png');

export default class AudioTrack extends React.Component{
    static defaultProps = {
        source: null,
        style:null,
        cache:false
      };
    
      static propTypes = {
        // source:PropTypes.string
        // style: ViewPropTypes.style,
        // scenes: PropTypes.array.isRequired,
        // showPreview: PropTypes.bool,
        // sliderWidth: PropTypes.number,
        // sliderHeight: PropTypes.number,
        // itemWidth: PropTypes.number,
        // itemHeight: PropTypes.number,
      };
    // static navigationOptions = props => ({
    //     title:props.navigation.state.params.title,
    // })

    constructor(){
        super();
        this.state = {
            playState:'paused', //playing, paused
            playSeconds:0,
            duration:0
        }
        this.sliderEditing = false;
    }

    componentDidMount(){
        // this.play();
        this.loadSound(false);
        //重绘进度条
        this.timeout = setInterval(() => {
            if(this.sound && this.sound.isLoaded() && this.state.playState == 'playing' && !this.sliderEditing){
                this.sound.getCurrentTime((seconds, isPlaying) => {
                    this.setState({playSeconds:seconds});
                })
            }
        }, 100);
    }
    componentWillUnmount(){
        if(this.sound){
            this.sound.release();
            this.sound = null;
        }
        if(this.timeout){
            clearInterval(this.timeout);
        }
    }
    safeSetState = (newState) => {
        if (!this._isMounted) {
          return;
        }
        return this.setState(newState);
      }

    processSource = (source) => {
        let url = _.get(source, ['uri'], null);
        if (FileUtils.isLocalFile(url)) {
        this.safeSetState({
            cachedFilePath: null,
            isCacheable: false,
            isError: false
        });
        return;
        }

        if (CacheProvider.isCacheable(url)) {
        if (this.props.showIndicator) {
            CacheProvider.addListener(url, this.progressListener);
        }
        const options = _.pick(this.props, ['useQueryParamsInCacheKey', 'cacheGroup']);
        CacheProvider.getCachedPath(url, options)
        // try to put the image in cache if
            .catch(
            () => 
            {
                // console.log('begin to cache,url ',url)
                CacheProvider.cacheFile(url, options, this.props.resolveHeaders)
            }
            )
            .then(
            cachedFilePath => {
                {
                let x=this.state;
                this.safeSetState({
                    cachedFilePath
                });
                // console.log('cached image and change state ',url,cachedImagePath,x,this.state)
                }          
            })
            .catch(err => {
            this.safeSetState({
                cachedFilePath: null,
                isCacheable: false,
                isError: true
            });
            })
            .finally(() => {
            if (this.props.showIndicator) {
                CacheProvider.removeListener(url, this.progressListener);
            }
            });
            // console.log('init state of url',url)
            this.safeSetState({
                cachedFilePath: null,
                isCacheable: true,
                isError: false
            });
        } else {
        // console.log('source is not cachable!',url)
        this.safeSetState({
            cachedFilePath: null,
            isCacheable: false,
            isError: true
        });
        }
    }
    progressListener = (progress) => {
        this.safeSetState({progress});
      }
    loadSound=(play)=>{
        if(!this.props.cache || this.state.cachedFilePath){
            const filepath = this.props.cache?  this.state.cachedFilePath:this.props.source.uri;
            console.log('[loading]', filepath)
            this.sound = new Sound(filepath,'', ((error) => {
                if (error) {
                    console.log('failed to load the sound', error);
                    Alert.alert('Notice', 'audio file error. (Error code : 1)');   
                    this.setState({playState:'paused'});
                }else{
                    if(play)
                    {
                        this.setState({playState:'playing',duration:this.sound.getDuration()});
                    }
                    else
                    {
                        this.setState({playState:'paused', duration:this.sound.getDuration()});
                        this.sound.play(this.playComplete);
                    } 
                }
            }).bind(this));   
        }else if(this.props.cache)
        {
            this.process(this.props.source.uri);
        }
    }
    onSliderEditStart = () => {
        this.sliderEditing = true;
    }
    onSliderEditEnd = () => {
        this.sliderEditing = false;
    }
    onSliderEditing = value => {
        if(this.sound){
            this.sound.setCurrentTime(value);
            this.setState({playSeconds:value});
        }
    }

    play = async () => {
        if(this.sound){
            this.sound.play(this.playComplete);
            this.setState({playState:'playing'});
        }else{
            this.loadSound(true).bind(this);
        }
    }
    playComplete = (success) => {
        if(this.sound){
            if (success) {
                console.log('successfully finished playing');
            } else {
                console.log('playback failed due to audio decoding errors');
                Alert.alert('Notice', 'audio file error. (Error code : 2)');
            }
            this.setState({playState:'paused', playSeconds:0});
            this.sound.setCurrentTime(0);
        }
    }

    pause = () => {
        if(this.sound){
            this.sound.pause();
        }

        this.setState({playState:'paused'});
    }

    jumpPrev15Seconds = () => {this.jumpSeconds(-15);}
    jumpNext15Seconds = () => {this.jumpSeconds(15);}
    jumpSeconds = (secsDelta) => {
        if(this.sound){
            this.sound.getCurrentTime((secs, isPlaying) => {
                let nextSecs = secs + secsDelta;
                if(nextSecs < 0) nextSecs = 0;
                else if(nextSecs > this.state.duration) nextSecs = this.state.duration;
                this.sound.setCurrentTime(nextSecs);
                this.setState({playSeconds:nextSecs});
            })
        }
    }

    getAudioTimeString(seconds){
        const h = parseInt(seconds/(60*60));
        const m = parseInt(seconds%(60*60)/60);
        const s = parseInt(seconds%60);

        return ( (m<10?'0'+m:m) + ':' + (s<10?'0'+s:s));
    }

    render(){
        if(this.props.cache && !this.sound)
        {
            this.loadSound(false);
        }

        const currentTimeString = this.getAudioTimeString(this.state.playSeconds);
        const durationString = this.getAudioTimeString(this.state.duration);
        const {style}=this.props;
        return (
            <View style={[{justifyContent:'center'},style]}>
               
                <View style={{marginVertical:5, marginHorizontal:15, flexDirection:'row'}}>
                    <Text style={{color:'white', alignSelf:'center',fontSize: em(20),width:em(60)}}>{currentTimeString}</Text>
                    {this.state.playState == 'playing' && 
                    <TouchableOpacity onPress={this.pause} style={{marginHorizontal:2,alignSelf:'center',}}>
                        <Image source={img_pause} style={{width:30, height:30,alignSelf:'center',}}/>
                    </TouchableOpacity>}
                    {this.state.playState == 'paused' && 
                    <TouchableOpacity onPress={this.play} style={{marginHorizontal:2,alignSelf:'center',}}>
                        <Image source={img_play} style={{width:30, height:30,alignSelf:'center',}}/>
                    </TouchableOpacity>}
                    <Slider
                        onTouchStart={this.onSliderEditStart}
                        // onTouchMove={() => console.log('onTouchMove')}
                        onTouchEnd={this.onSliderEditEnd}
                        // onTouchEndCapture={() => console.log('onTouchEndCapture')}
                        // onTouchCancel={() => console.log('onTouchCancel')}
                        onValueChange={this.onSliderEditing}
                        value={this.state.playSeconds} maximumValue={this.state.duration} maximumTrackTintColor='gray' minimumTrackTintColor='white' thumbTintColor='white' 
                        style={{flex:1, alignSelf:'center', marginHorizontal:Platform.select({ios:5})}}/>
                    <Text style={{color:'white', alignSelf:'center',fontSize: em(20)}}>{durationString}</Text>
                </View>
            </View>
        )
    }
}