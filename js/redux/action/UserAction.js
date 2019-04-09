/**
 * Created by jialing on 2017/10/24.
 */

import * as types from "./ActionType"
// import config from '../../config/Config'


export function doLogin(username, password,captcha) {
  return function (dispatch) {
    dispatch({
      type: types.USER_LOGIN_DOING,
      username,
      password
    })
    fetch('http://127.0.0.1:8762/user/login',{
      credentials: 'include',
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-Requested-With':"XMLHttpRequest"
      },
      body: 'username='+username+'&password='+password+'&captcha='+ captcha
    })
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        if(data.state==1){
          dispatch({
                        type: types.USER_LOGIN_SUCCESS,
                        user: data.result
          })
        }else
        {
          dispatch({
                        type: types.USER_LOGIN_FAIL,
                        error: data.msg
          })
        }
    })
    .catch((error) => {
      dispatch({
                  type: types.USER_LOGIN_FAIL,
                  error: '网络请求失败，请检查网络连接'
      })
    });
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
