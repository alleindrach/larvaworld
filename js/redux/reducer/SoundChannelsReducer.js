
import * as types from '../action/ActionType'
const initState = {
  channels:[
    {img:'http://192.168.2.233:8765/file/5ccd8004c23008b956e672e9'},
    {img:'http://192.168.2.233:8765/file/5ccd8004c23008b956e672e9'},
    {img:'http://192.168.2.233:8765/file/5ccd8004c23008b956e672e9'},
    {img:'http://192.168.2.233:8765/file/5ccd8004c23008b956e672e9'}
  ],
  currentChannel:0,
  current:0,
  error:'',
  isSending:false,
  isSended:false,
  isFetched:false,
  isChannelsSyncing:false,
  isChannelsSynced:true,
  mergingChannels:null
}

export default function messageReducer(state = initState, action) {
  switch (action.type) {
    case types.SOUND_CHANNELS_PREFETCH:
      return state;
    case types.SOUND_CHANNELS_PREFETCH_SUCCESS:
      return {
        ...state,
        channels:action.channels,
        isFetched:true
      }
    case types.SOUND_CHANNELS_PREFETCH_FAIL:
      return {
        ...state,
        error:action.error
      }
    case types.SOUND_CHANNELS_MSG_SEND:
      {
        let newChannels= state.channels.reduce((acc,channel,index)=>{
        if(index==action.sending.channel)
        {
          acc.push({
            ...channel,
            snd:action.sending.snd
          })
        }else
        {
          acc.push(channel)
        }
        return acc;
    },[]);
        return {
          ...state,
          isSending:true,
          isSended:false,
          channels:newChannels,
          sending:action.sending
        }
      }
    case types.SOUND_CHANNELS_MSG_SEND_FAIL:
      return {
        ...state,
        isSending:false,
        isSended:true,
        error:action.error,
        sending:undefined
      }
    case types.SOUND_CHANNELS_MSG_SEND_SUCCESS:
      return {
        ...state,
        isSended:true,
        isSending:false,
        sending:undefined
      }
    case types.SOUND_CHANNELS_SYNC:
      return {
        ...state,
        isChannelsSynced:false,
        isChannelsSyncing:true
      }
    case types.SOUND_CHANNELS_SYNC_UPLOAD_SUCCESS:
      return {
        ...state,
        mergingChannels:action.merging
      }
    case types.SOUND_CHANNELS_SYNC_MERGED:
      return {
        ...state,
        channels:[
          ...state.mergingChannels
        ],
        mergingChannels:null
      }
    case types.SOUND_CHANNELS_SYNC_UPLOAD_FAIL:
      return {
        ...state,
        isChannelsSynced:true,
        isChannelsSyncing:false,
        error:action.error
      }
    case types.SOUND_CHANNELS_CHANNEL_SELECT:
      return {
        ...state,
        currentChannel:action.channel
      }
    case types.SOUND_CHANNELS_IMAGE_SELECT:
      {
        let newChannels= state.channels.reduce((acc,channel,index)=>{
        if(index==action.index)
        {
          acc.push({img:action.filepath})
        }else
        {
          acc.push(channel)
        }
        return acc;
      },[]);
      return {
        ...state,
        channels:newChannels
      }
    }
    default:
      return state;
  }
}

