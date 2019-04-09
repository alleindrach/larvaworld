
import * as types from '../action/ActionType'
import {AsyncStorage} from 'react-native'
const initState = {
  phone: '',
  password: '',
  isLoading: false,
  isLogin: false,
  error: '',

  _id: '',
  nickname: '',
  avatar: '',
  identity: [],
  accessToken: ''
}

export default function userReducer(state = initState, action) {
  switch (action.type) {
    case types.USER_LOGIN_DOING:
      return {
        ...state,
        username: action.username,
        password: action.password,
        isLoading: true,
        isLogin: false,
        error: '',
      }
    case types.USER_LOGIN_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isLogin: true,
        error: '',
        ...action.user
      }
    case types.USER_LOGIN_FAIL:
      return {
        ...state,
        isLoading: false,
        isLogin: false,
        error: action.error,
      }
    case types.USER_LOGOUT:
      return {
        ...initState,
        username: state.username
      }
    case types.USER_UPDATE_INFO:
      return {
        ...state,
        ...action.user
      }
    case types.USER_LOGIN_CAPTCHA_REFRESH:
      return {
        ...state,
        captchaSeed:action.seed
      }
    default:
      return state;
  }
}

