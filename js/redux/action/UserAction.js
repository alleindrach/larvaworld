/**
 * Created by jialing on 2017/10/24.
 */

import * as types from "./ActionType"
// import config from '../../config/Config'

export function navToLogin(goBack){
  return {
    type: types.USER_NAV_LOGIN,
    goBack
  }
}
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

export function loginSuccess(payload) {
  return {
      type: types.USER_LOGIN_SUCCESS,
      payload
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


export function fetchHomePageInfo() {
  return {
    type: types.USER_HOME_PAGE_FETCH
  }
}
export function updateHomePageInfo(userinfo){
  return {
    type: types.USER_HOME_PAGE_UPDATE,
    userinfo
  }
}
