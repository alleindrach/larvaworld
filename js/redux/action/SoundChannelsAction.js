import * as types from "./ActionType"

export function selectChannel(channel) {
  return {
    type: types.SOUND_CHANNELS_CHANNEL_SELECT,
    channel
  }
}

export function prefetchChannels() {
  return {
    type: types.SOUND_CHANNELS_PREFETCH
  }
}

export function prefetchChannelsSuccess(channels) {
  return {
    type: types.SOUND_CHANNELS_PREFETCH_SUCCESS,
    channels
  }
}
export function prefetchChannelsFail(error) {
  return {
    type: types.SOUND_CHANNELS_PREFETCH_FAIL,
    error
  }
}
//msg: {channel:channel,snd:filepath}
//发消息
export function sendSoundMessage(msg) {
  return {
    type: types.SOUND_CHANNELS_MSG_SEND,
    sending:msg
  }
}
//更新进度
export function upadteSendSoundMessageProgress(progress) {
  return {
    type: types.SOUND_CHANNELS_MSG_SENDING,
    progress:progress
  }
}
//发送消息成功
export function soundMessageSendSuccess(msg) {
  return {
    type: types.SOUND_CHANNELS_MSG_SEND_SUCCESS,
    merging:msg
  }
}
//暂时不用
export function soundMessageSended(msg) {
  return {
    type: types.SOUND_CHANNELS_MSG_SEND_MERGED,
    merging:msg
  }
}

//发送失败
export function soundMessageSendFailed(error) {
  return {
    type: types.SOUND_CHANNELS_MSG_SEND_FAIL,
    error
  }
}

export function soundChannelsSync() {
  return {
    type: types.SOUND_CHANNELS_SYNC,
  }
}
export function soundChannelsSyncSuccess(channels) {
  return {
    type: types.SOUND_CHANNELS_SYNC_UPLOAD_SUCCESS,
    merging:channels
  }
}

export function soundChannelsSyncFail(error) {
  return {
    type: types.SOUND_CHANNELS_SYNC_UPLOAD_FAIL,
    error
  }
}


export function soundChannelsSyncMerged() {
  return {
    type: types.SOUND_CHANNELS_SYNC_MERGED
  }
}

export function selectImage(soundChannels,index,filepath){
  return {
      type:types.SOUND_CHANNELS_IMAGE_SELECT,
      index,
      filepath
  }
}
export function soundChannelsMsgListFetch(msgType){
  return {
    type:types.SOUND_CHANNELS_MSG_LIST_FETCH,
    msgType
  }
}
export function soundChannelsMsgListReset(msgType){
  return {
    type:types.SOUND_CHANNELS_MSG_LIST_RESET,
    msgType
  }
}
export function soundChannelsMsgListFetchSuccess(msgs){
  return {
    type:types.SOUND_CHANNELS_MSG_LIST_FETCH_SUCCESS,
    fetchedMsgs:msgs
  }
}
export function soundChannelsMsgListFetchFail(error){
  return {
    type:types.SOUND_CHANNELS_MSG_LIST_FETCH_FAIL,
    msglistFetchError:error
  }
}

export function soundChannelsMsgListCopy(msgId){
  return {
    type:types.SOUND_CHANNELS_MSG_LIST_COPY,
    msgId
  }
}

export function soundChannelsMsgListCopied(msgId){
  return {
    type:types.SOUND_CHANNELS_MSG_LIST_COPIED,
    msgId
  }
}

export function soundChannelsMsgListCopyFail(msgId){
  return {
    type:types.SOUND_CHANNELS_MSG_LIST_COPY_FAIL,
    msgId
  }
}