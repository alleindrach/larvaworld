/**
 * Created by jialing on 2017/10/24.
 */

import * as types from "./ActionType"
// import config from '../../config/Config'


export function doLogin(username, password,captcha,goBack,stompContext) {
  return {
      type: types.USER_LOGIN_DOING,
      username,
      password,
      captcha,
      goBack,
      stompContext
    }
}
export function loginSuccess(username,goBack) {
  return {
      type: types.USER_LOGIN_SUCCESS,
      username,
      goBack
    }
}
export function loginFail(error) {
  return {
      type: types.USER_LOGIN_FAIL,
      error
    }
}


export function logout() {
  return {
      type: types.USER_LOGOUT
    }
}
export function refreshCaptcha(seed){
  return {
    type:types.USER_LOGIN_CAPTCHA_REFRESH,
    seed:seed
  }
}
