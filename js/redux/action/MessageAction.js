
import * as types from "./ActionType"
// import config from '../../config/Config'

export function initContext(stompContext,msgReceiver) {
  return {
      type: types.STOMP_CONTEXT_INIT,
      stompContext,
      msgReceiver
    }
}
export function doConect(stompClient) {
  return {
      type: types.STOMP_CONNECT_DOING,
      stompClient
    }
}

export function conected() {
  return {
      type: types.STOMP_CONNECT_SUCCESS
    }
}
export function messageReceived(message) {
  return {
      type: types.STOMP_MSG_RECEIVED,
      message
    }
}

export function disconnected() {
  return {
      type: types.STOMP_CONNECT_DISCONNECTED
    }
}

export function connectfail() {
  return {
      type: types.STOMP_CONNECT_FAIL
    }
}
