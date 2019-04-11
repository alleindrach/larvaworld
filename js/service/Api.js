import { take, call, select ,put } from 'redux-saga/effects';
import * as Actions from '../redux/action/index';
import config from '../config/Config';
const publicAPI = (baseURL: string =config.api.base)  => {
    const baseOptions={credentials: 'include',
    method: 'POST',
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-Requested-With':"XMLHttpRequest"
    }}
    const login=(username,password,captcha)=>
        fetch(baseURL+'user/login',{
            ...baseOptions,
            body: 'username='+username+'&password='+password+'&captcha='+ captcha
        })
        .then((response) => {
            return response.json();
        });
    
    
    function * connect(stompContext:any){
        stompClient=stompContext.newStompClient(baseURL+'websocket')  
        yield put(Actions.MessageAction.doConect(stompClient));
    }
    
    return {
        login,connect
    }
}
export default publicAPI;