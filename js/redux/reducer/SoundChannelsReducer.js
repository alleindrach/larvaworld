
import * as types from '../action/ActionType'
import * as FileUtils from '../../utils/FileUtils'
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
  isFetching:false,
  isChannelsSyncing:false,
  isChannelsSynced:true,
  mergingChannels:null,
  msgList:{
    isFetching:false,
    msgs:[],
    pageSize:20,
    pageIndex:0,
    error:null,
    noMore:false,
    initFetch:true,
    lastday:'',
    isRefreshing:false,
    isCopying:false,
    isCopied:false
  }

}

export default function messageReducer(state = initState, action) {
  switch (action.type) {
    case types.SOUND_CHANNELS_PREFETCH:
      return state;
    case types.SOUND_CHANNELS_PREFETCH_SUCCESS:
      return {
        ...state,
        channels:action.channels,
        isFetched:true,
        isFetching:false
      }
    case types.SOUND_CHANNELS_PREFETCH_FAIL:
      return {
        ...state,
        isFetching:false,
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
    case types.SOUND_CHANNELS_MSG_LIST_FETCH:
    {
      if(state.msgList.isFetching)
        return state;
      else
        return {
          ...state,
          msgList:{
            ...state.msgList,
            isFetching:true,
          }
        }
    }
    case types.SOUND_CHANNELS_MSG_LIST_FETCH_SUCCESS:
      {
        fullDateOptions = {
          year: '2-digit', month: '2-digit', day: '2-digit',
          hour: '2-digit', minute: '2-digit',
          hour12: false,
        };
        dateOptions = {
          month: '2-digit', day: '2-digit',
          hour12: false,
        };
        timeOptions = {
          hour: '2-digit', minute: '2-digit',
          hour12: false,
        };
        let msgs=state.msgList.msgs;
        let newMsgs=action.fetchedMsgs.map((msg)=>{
          date=new Date(msg.createDate)
          datestr=new Intl.DateTimeFormat('default', dateOptions).format(date)
          timestr=new Intl.DateTimeFormat('default', timeOptions).format(date)
          return {
            date:datestr,
            time:timestr,
            imageUrl:FileUtils.getThumbFileUrl(state.channels[msg.channel?msg.channel:0].img),
            title:msg.talker.username,
            snd:msg.snd,
            id:msg.id
          }
        }).reduce((acc,msg)=>{
          if(acc.lastday==msg.date)
          {
            msg.date=''
            
          }else
          {
            acc.lastday=msg.date
          }
          return {
            ...acc,
            msgs:[...acc.msgs,msg]
          }
        },{lastday:state.msgList.lastday,msgs:[]});
        msgs=msgs.concat(newMsgs.msgs);
        lastday=newMsgs.lastday;
        const noMore=action.fetchedMsgs.length>=state.msgList.pageSize?false:true;
      return {
        ...state,
        msgList:{
          ...state.msgList,
          msgs:msgs,
          isFetching:false,
          pageIndex:state.msgList.pageIndex+1,
          noMore:noMore,
          initFetch:false,
          lastday:lastday,
          isRefreshing:false
        }
      }
    }
    case types.SOUND_CHANNELS_MSG_LIST_FETCH_FAIL:
      return {
        ...state,
        msgList:{
          ...state.msgList,
          isFetching:false,
          isRefreshing:false,
          error:action.msglistFetchError
        }
      }  
    case types.SOUND_CHANNELS_MSG_LIST_RESET:
      return {
        ...state,
        msgList:{
          isFetching:false,
          msgs:[],
          pageSize:20,
          pageIndex:0,
          error:null,
          noMore:false,
          initFetch:true,
          lastday:'',
          isRefreshing:true
        }
      }    
    case types.SOUND_CHANNELS_MSG_LIST_COPY:
      return {
        ...state,
        msgList:{
          ...state.msgList,
          copyId:action.msgId,
          copiedId:undefined,
          isCopying:true,
          isCopied:false
        }
      } 
    case types.SOUND_CHANNELS_MSG_LIST_COPIED:
    {
      newMsgs=state.msgList.msgs.reduce(
        (acc,msg)=>{
            if(msg.id==action.msgId){

              return {
                ...acc,
                lastday:msg.date
              }
            }else
            {
              if(acc.lastday&& msg.date=='')
              {
                msg.date=acc.lastday
                acc.lastday=undefined
              }
              return {
                ...acc,
                msgs:[...acc.msgs,msg],
                lastday:acc.lastday
              }
            }
           
          },{lastday:undefined,msgs:[]}).msgs;

          
      return {
        ...state,
        msgList:{
          ...state.msgList,
          msgs:newMsgs,
          copyId:undefined,
          isCopying:false,
          isCopied:true,
        }
      } 
    }
      
    case types.SOUND_CHANNELS_MSG_LIST_COPY_FAIL:
      return {
        ...state,
        msgList:{
          ...state.msgList,
          copiedId:undefined,
          copyId:undefined,
          isCopying:false,
          isCopied:false,

        }
      } 
    default:
      return state;
  }
}

