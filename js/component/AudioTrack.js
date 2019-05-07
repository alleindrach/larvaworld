import React from 'react'
import {StyleSheet, View, Image, Text, TouchableOpacity, Platform, Alert} from 'react-native';
import _ from 'lodash';
import Sound from 'react-native-sound';
import PropTypes from 'prop-types';
import * as  FileUtils from '../utils/FileUtils'
import * as CacheProvider from './cached/CacheProvider'
import Slider from 'react-native-slider'
import {Icon} from 'native-base';
import config from '../config/Config';
import UUIDGenerator from 'react-native-uuid-generator';
import {AudioRecorder, AudioUtils} from 'react-native-audio';
import {WorkAction} from '../redux/action'
import {connect} from 'react-redux'
import {EventEmitter} from 'events';

export default class AudioTrack extends React.Component{
    emitter = new EventEmitter();
    static defaultProps = {
        source: null,
        style:null,
        cache:false,
        maxSoundLength:15
      };
    
    static propTypes = {
      };
    // static navigationOptions = props => ({
    //     title:props.navigation.state.params.title,
    // })
    removeListener=(event, listener) =>{
        this.emitter.removeListener(event, listener)
      }
      
    addListener=(event, listener)=> {
        this.emitter.addListener(event, listener)
      }
      

    soundStop=async ()=>{
        return new Promise(function(resolve,reject)
        {
            if(!this.sound)
                resolve(true);
            else
                this.sound.stop(()=>{
                    resolve(true)
                })
        })
    }
    soundPause=async ()=>{
        return new Promise(function(resolve,reject)
        {
            if(!this.sound)
                resolve(true);
            else
                this.sound.pause(()=>{
                    resolve(true)
                })
        })
    }
    soundStop=async()=>{
        return new Promise(function(resolve,reject)
        {
            if(!this.sound)
                resolve(true);
            else
                this.sound.stop(()=>{
                    resolve(true)
                })
        })
    }
    play=async ()=>{
        if(this.state.audioState=='play.paused'){
            if(this.sound){
                this.sound.play(this.playComplete);
                this.setState({audioState:'playing'});
            }else{
                setTimeout((() => {
                    this.loadSound(true)
                }).bind(this),100)
                
            }
        }
        else if(this.state.audioState=='recording'||this.state.audioState=='record.paused'){
            const filePath = await AudioRecorder.stopRecording();
      
            if (Platform.OS === 'android') {
                this._finishRecording(true, filePath,true);
            }
            // this.setState({source:{uri:`file://${filePath}`}, audioState: 'record.pause',record:{source:{uri:`file://${filePath}`}}});
            // this.state.source=this.state.record.source;
            
            setTimeout((() => {
                this.loadSound(true)
            }).bind(this),100);
        }
    }

    pause =async ()=> {
        if (this.state.audioState=='recording') {
            try {
                const filePath = await AudioRecorder.pauseRecording();
                this.setState({audioState: 'record.paused'});
              } catch (error) {
                console.error(error);
              }
            return;  
        }
        else if(this.state.audioState=='playing')
        {
            await this.soundPause();
            this.setState({audioState:'play.paused'});
        }
        
      }

    resume=async ()=> {
        if (this.state.audioState=='record.paused') {
            try {
                await AudioRecorder.resumeRecording();
                this.setState({audioState: 'recording'});
            } catch (error) {
                console.error(error);
            }
        }
    }
    
    record=async()=>{
        if(!this.state.hasRecordPermission) {
            console.warn('Can\'t record, no permission granted!');
            throw new Error('permission denied!')
            
        }
        if (this.state.audioState=='play.paused') {
            try {
                const filePath=await this.prepareRecordingPath();
                const filePath2=await AudioRecorder.startRecording()
                this.setState({audioState: 'recording',
                    // source:{uri:`file://${filePath}`},
                    playSeconds:0,
                    duration:this.props.maxSoundLength,
                    isCacheable: false,
                    cachedFilePath: null,
                    progress: 0,
                    isError: false,
                });
               
                AudioRecorder.onProgress = ((data) => {
                    this.setState({playSeconds: Math.floor(data.currentTime)});
                    this.emitter.emit('recording',{current:data.currentTime,max:this.props.maxSoundLength})
                    if(data.currentTime>this.props.maxSoundLength)
                        this.stop()
                    
                  }).bind(this);
                AudioRecorder.onFinished = (data) => {
                // Android callback comes in the form of a promise instead.
                    if (Platform.OS === 'ios') {
                        this._finishRecording(data.status === "OK", data.audioFileURL, data.audioFileSize);
                    }
                };

            } catch (error) {
                console.error(error);
                throw error
            }
        }
        else if(this.state.audioState=='playing'){
            await this.soundStop();
            try {
                const filePath=await this.prepareRecordingPath();
                const filePath2=await AudioRecorder.startRecording()
                this.setState({audioState: 'recording',
                // source:{uri:`file://${filePath}`},
                    playSeconds:0,
                    duration:this.props.maxSoundLength,
                    isCacheable: false,
                    cachedFilePath: null,
                    progress: 0,
                    isError: false,
                });
                // this.props.selectAudio(this.props.work,`file://${filePath}`);
                AudioRecorder.onProgress = ((data) => {
                    this.setState({playSeconds: Math.floor(data.currentTime)});
                    this.emitter.emit('recording',{current:data.currentTime,max:this.props.maxSoundLength})
                    if(data.currentTime>this.props.maxSoundLength)
                        this.stop()
                  }).bind(this);
          
                AudioRecorder.onFinished = (data) => {
                // Android callback comes in the form of a promise instead.
                    if (Platform.OS === 'ios') {
                        this._finishRecording(data.status === "OK", data.audioFileURL, data.audioFileSize);
                    }
                };

            } catch (error) {
                console.error(error);
                throw error
            }
        }
    }

    stop=async ()=> {
        if (this.state.audioState=='recording'||this.state.audioState=='record.paused') {
            try {
              const filePath = await AudioRecorder.stopRecording();
            
              if (Platform.OS === 'android') {
                this._finishRecording(true, filePath);
              }
              return filePath;
            } catch (error) {
              console.error(error);
              throw error;
            }
        }
        else if(this.state.audioState=='playing')
        {
            await this.soundPause();
            this.setState({audioState:'play.paused'});
        }
        
    }
    
    prepareRecordingPath=async ()=>{
        
        const uuid=await UUIDGenerator.getRandomUUID().then((uuid) => {
            return uuid;
            });
        const filePath= `${FileUtils.baseCacheDir}/${uuid}.${config.file.soundMediaType}`;
            
        AudioRecorder.prepareRecordingAtPath(filePath, {
            SampleRate: 22050,
            Channels: 1,
            AudioQuality: "Low",
            AudioEncoding: config.file.soundMediaType
          });
       return filePath;
    }
    _finishRecording(didSucceed, filePath, fileSize,play) {
        play=false||play;
        this.setState({audioState:'play.paused',playSeconds:0,source:{
            uri:filePath
        }});
        // this.props.selectAudio(this.props.work,this.state.source.uri,play);
        this.emitter.emit('recordFinished',{success:didSucceed,file:filePath,size:fileSize,sindex:this.props.sindex})
        console.log(`Finished recording of duration ${this.state.currentTime} seconds at path: ${filePath} and size of ${fileSize || 0} bytes`);
      }    
       
    constructor(props){
        super(props);
        this._isMounted = false;
        this.state = {
            audioState:'play.paused', //playing, paused
            playSeconds:0,
            duration:config.file.maxSoundLength,
            isCacheable: false,
            cachedFilePath: null,
            networkAvailable: true,
            progress: 0,
            isError: false,
            hasRecordPermission:false,
            source:props.source
        };
        this.sliderEditing = false;
        Sound.setCategory('Playback');
    }

    static getDerivedStateFromProps(props, state) {
        const prevProps = state.prevProps || {};
        // Compare the incoming prop to previous prop
        // console.log('Props=>State',prevProps,props)
        if((prevProps.source 
            && props.source && props.source.uri 
            && prevProps.source.uri!=props.source.uri)
            ){
               
            console.log('reset state!',prevProps,"=>",props)
                
            return {
                source:props.source,
                audioState:'play.paused', //playing, paused
                playSeconds:0,
                duration:0,
                isCacheable: false,
                cachedFilePath: null,
                progress: 0,
                isError: false, 
                autoPlay:props.play?true:false ,
                prevProps:props      
            }
        }
        else
        {
            return {
                // Store the previous props in state
                prevProps: props,
              };
        }
        
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
    // Typical usage (don't forget to compare props):
        if(prevProps.source 
            && this.props.source && this.props.source.uri 
            && prevProps.source.uri!=this.props.source.uri){
                console.log('componentDidUpdate for source change,loadSound,prevProps:',prevProps,'props',this.props,'prevState',prevState,'state',this.state)
                this.loadSound(this.state.autoPlay);
                return ;
        }else if(prevState.source && this.state.source && this.state.source.uri
             &&  this.state.source.uri != prevState.source.uri ){
                console.log('loadSound for state',this.state.source.uri)
                this.loadSound(this.state.autoPlay);
                return;
        }
    // console.log('componentDidUpdate,prevProps:',prevProps,'props',this.props,'prevState',prevState,'state',this.state)
        if(!prevState.cachedFilePath  && this.state.cachedFilePath){
            console.log('loadSound for cached',this.state.source.uri)
            this.loadSound(this.state.autoPlay);
        }
    }

    componentDidMount(){
        // this.play();
        this._isMounted = true;
      
        console.log('mount audio:',this.props,this.state)
        this.loadSound(false);
        //重绘进度条
        this.timeout = setInterval(() => {
            if(this.sound && this.sound.isLoaded() && this.state.audioState == 'playing' && !this.sliderEditing){
                this.sound.getCurrentTime((seconds, isPlaying) => {
                    this.setState({playSeconds:seconds});
                })
            }
        }, 100);
        if(this.props.onRecordFinished)
            this.emitter.addListener('recordFinished',this.props.onRecordFinished)
        if(this.props.onRecording
            )this.emitter.addListener('recording',this.props.onRecording)

        AudioRecorder.requestAuthorization().then((isAuthorised) => {
            this.setState({ hasRecordPermission: isAuthorised });
    
            if (!isAuthorised) return;
            // const recordFilePath=this.getNewAudioPath();
            // this.prepareRecordingPath();
            
           
          });
    
    }

    componentWillUnmount(){
        if(this.sound){
            this.sound.release();
            this.sound = null;
        }
        if(this.timeout){
            clearInterval(this.timeout);
        }
        if(this.emitter)
        {
            this.emitter.removeAllListeners();
        }
    }
    safeSetState = (newState,callback) => {
        if (!this._isMounted) {
          return;
        }
        
        console.log('updating to newState',newState,this.props)
        
        return this.setState(newState,()=>{
            callback && callback()
        });
      }

    processSource = (source,play) => {
        let url = _.get(source, ['uri'], null);
        if (FileUtils.isLocalFile(url)) {
            this.safeSetState({
                cachedFilePath: FileUtils.cleanLocalFilePath(url),
                isCacheable: false,
                isError: false,
                playSeconds:0,
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
                        return CacheProvider.cacheFile(url, options, this.props.resolveHeaders)
                    }
                )
                .then(
                    cachedFilePath => {
                        {
                        let x=this.state;
                        this.safeSetState({
                            cachedFilePath,
                            playSeconds:0,
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
        if(this.sound)
        {
            this.sound.release();
            this.sound=null;
        }
        if(this.state.source.uri!=config.flags.plus){
            if(!this.props.cache || this.state.cachedFilePath){
                const filepath = this.props.cache?  this.state.cachedFilePath:this.state.source.uri;
                console.log('[loading]', filepath)
                this.sound = new Sound(filepath,'', ((error) => {
                    if (error) {
                        console.log('failed to load the sound', error);
                        Alert.alert('Notice', 'audio file error. (Error code : 1)');   
                        this.setState({audioState:'play.paused'});
                    }else{
                        console.log('[loaded]', filepath,"loaded:",this.sound._loaded)
                        if(Platform.OS=='ios'&& this.sound._loaded)
                        {
                            if(play)
                            {
                                this.setState({audioState:'playing',duration:this.sound.getDuration()});
                                this.sound.play(this.playComplete);
                            }
                            else
                            {
                                this.setState({audioState:'play.paused', duration:this.sound.getDuration()});
                            } 
                        }
                       
                    }
                }).bind(this));   
            }else if(this.props.cache)
            {
                this.processSource(this.state.source,play);
            }
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
    playComplete = (success) => {
        if(this.sound){
            if (success) {
                console.log('successfully finished playing');
            } else {
                console.log('playback failed due to audio decoding errors');
                Alert.alert('Notice', 'audio file error. (Error code : 2)');
            }
            this.setState({audioState:'play.paused', playSeconds:0});
            this.sound.setCurrentTime(0);
        }
    }

    getAudioTimeString(seconds){
        const h = parseInt(seconds/(60*60));
        const m = parseInt(seconds%(60*60)/60);
        const s = parseInt(seconds%60);

        return ( (m<10?'0'+m:m) + ':' + (s<10?'0'+s:s));
    }
    render(){
        // console.log('render audio:',this.state.source.uri,this.state)
        // if(this.props.sindex==1)
        // {
        //     // console.log('render audio',this.state,this.props)
        // }
        const currentTimeString = this.getAudioTimeString(this.state.playSeconds);
        const durationString = this.getAudioTimeString(this.state.duration);
        const {style}=this.props;
        // console.log('this.state.duration',this.state.duration,'this.state.playSeconds',this.state.playSeconds)
        return (
            <View style={[{justifyContent:'center'},style]}>
                <View style={{marginVertical:5, marginHorizontal:15, flexDirection:'row'}}>
                    <Text style={{color:'white', alignSelf:'center',fontSize: em(20),width:em(60)}}>{currentTimeString}</Text>
                    {this.state.audioState == 'play.paused'  && 
                    <TouchableOpacity onPress={this.record} style={{marginHorizontal:4,alignSelf:'center',}}>
                        <Icon type="FontAwesome"   name="circle"   style={{alignSelf:'center',fontSize: 20,width:24, color: 'red'}}/>
                    </TouchableOpacity>
                    }
                    {this.state.audioState == 'playing'  && 
                    <TouchableOpacity onPress={this.record} style={{marginHorizontal:4,alignSelf:'center',}}>
                        <Icon type="FontAwesome"   name="circle"   style={{alignSelf:'center',fontSize: 20,width:24, color: 'red'}}/>
                    </TouchableOpacity>
                    }
                    {this.state.audioState == 'playing'  && 
                    <TouchableOpacity onPress={this.pause} style={{marginHorizontal:4,alignSelf:'center',}}>
                        <Icon type="FontAwesome"   name="pause"   style={{alignSelf:'center',fontSize: 20,width:24, color: '#31a4db'}}/>
                    </TouchableOpacity>
                    }
                    {this.state.audioState == 'record.paused'  && 
                    <TouchableOpacity onPress={this.resume} style={{marginHorizontal:4,alignSelf:'center',}}>
                        <Icon type="FontAwesome"   name="circle"   style={{alignSelf:'center',fontSize: 20,width:24, color: 'red'}}/>
                    </TouchableOpacity>
                    }
                    {this.state.audioState == 'record.paused'  && 
                    <TouchableOpacity onPress={this.stop} style={{marginHorizontal:4,alignSelf:'center',}}>
                        <Icon type="FontAwesome"   name="stop"   style={{alignSelf:'center',fontSize: 20,width:24, color: 'red'}}/>
                    </TouchableOpacity>
                    }
                    {this.state.audioState == 'recording'  && 
                    <TouchableOpacity onPress={this.stop} style={{marginHorizontal:4,alignSelf:'center',}}>
                        <Icon type="FontAwesome"   name="stop"   style={{alignSelf:'center',fontSize: 20,width:24, color: 'red'}}/>
                    </TouchableOpacity>
                    }
                    {this.state.audioState == 'recording'  && 
                    <TouchableOpacity onPress={this.pause} style={{marginHorizontal:4,alignSelf:'center',}}>
                        <Icon type="FontAwesome"   name="pause"   style={{alignSelf:'center',fontSize: 20,width:24, color: 'red'}}/>
                    </TouchableOpacity>
                    }
                    {this.state.audioState == 'play.paused'  && 
                    <TouchableOpacity onPress={this.play} style={{marginHorizontal:4,alignSelf:'center',}}>
                        <Icon type="FontAwesome"   name="play"   style={{alignSelf:'center',fontSize: 20,width:24, color: '#31a4db'}}/>
                    </TouchableOpacity>
                    }
                               
                     <Slider
                        style={sliderStyle.container}
                        trackStyle={sliderStyle.track}
                        thumbStyle={sliderStyle.thumb}
                        minimumTrackTintColor='#31a4db'
                        thumbTouchSize={{width: 50, height: 40}}
                        value={this.state.playSeconds}
                        maximumValue={this.state.duration}
                        onValueChange={this.onSliderEditing}
                        onSlidingStart={this.onSliderEditStart}
                        onSlidingComplete={this.onSliderEditEnd}
                    />
                    <Text style={{color:'white', alignSelf:'center',fontSize: em(20)}}>{durationString}</Text>
                </View>
            </View>
        )
    }
}


const sliderStyle = StyleSheet.create({
    container: {
      height: 30,
      flex:1,
      alignSelf:'center'
    },
    track: {
      height: 2,
      backgroundColor: '#303030',
    },
    thumb: {
      width: 10,
      height: 10,
      backgroundColor: '#31a4db',
      borderRadius: 10 / 2,
      shadowColor: '#31a4db',
      shadowOffset: {width: 0, height: 0},
      shadowRadius: 2,
      shadowOpacity: 1,
    }
  });


// const matStateToProps = (state) => {
//     return {
//       user: state.user,
//     }
//   }
  
//   const mapDispatchToProps = (dispatch) => {
//     return {
//     //   selectAudio: (work,filepath) => {
//     //     dispatch(WorkAction.selectAudio(work, filepath))
//     //   },
//     }
//   }
  
//   export default connect(matStateToProps, mapDispatchToProps, null, {withforwardRefRef: true})(AudioTrack)
  