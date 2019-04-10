
import * as types from '../action/ActionType'
import {AsyncStorage} from 'react-native'
const initState = {
  isConnecting: false,
  isConnected: false,
  messages: [],
  stompContext:null,
  stompClient:null,
  msgReceiver:null
}

export default function messageReducer(state = initState, action) {
  switch (action.type) {
    case types.STOMP_CONTEXT_INIT:
      return {
        ...state,
        isConnecting: true,
        isConnected: false,
        error: '',
        stompContext:action.stompContext,
        msgReceiver:action.msgReceiver
      }
    case types.STOMP_CONNECT_DOING:
      return {
        ...state,
        isConnecting: true,
        isConnected: false,
        error: '',
        stompClient:action.stompClient
      }
    case types.STOMP_CONNECT_SUCCESS:
      return {
        ...state,
        isConnecting: false,
        isConnected: true,
        error: '',
      }
    case types.STOMP_CONNECT_FAIL:
      return {
        ...state,
        isConnecting: false,
        isConnected: false,
        error: action.error,
      }
    case types.STOMP_DISCONNECTED:
      return {
        ...state,
        isConnecting: false,
        isConnected: false,
        error: '',
      }
    case types.STOMP_MSG_RECEIVED:
      return {
        ...state,
        messages:[
          ...state.messages,
          action.message
        ]
      }
    case types.STOMP_MSG_SEND_SUCCESS:
      return {
        ...state,
        messages:[
          ...state.messages,
          action.message
        ]
      }
    
    default:
      return state;
  }
}

