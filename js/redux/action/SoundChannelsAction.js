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
export function sendSoundMessage(msg) {
  return {
    type: types.SOUND_CHANNELS_MSG_SEND,
    sendding:msg
  }
}

export function upadteSendSoundMessageProgress(progress) {
  return {
    type: types.SOUND_CHANNELS_MSG_SENDING,
    progress:progress
  }
}

export function sendSoundMessageSuccess(msg) {
  return {
    type: types.SOUND_CHANNELS_MSG_SEND_SUCCESS,
    merging:msg
  }
}

export function soundMessageSended(msg) {
  return {
    type: types.SOUND_CHANNELS_MSG_SEND_MERGED,
    merging:msg
  }
}


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