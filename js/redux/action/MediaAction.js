import * as types from "./ActionType"

export function playAudio(id) {
  return {
    type: types.MEDIA_AUDIO_PLAYER_PLAY,
    id
  }
}