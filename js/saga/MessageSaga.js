import { take, call, select ,put } from 'redux-saga/effects';

import * as Types from '../redux/action/ActionType';
import Api from '../service/Api'
import * as Actions from '../redux/action/index';
import config from '../config/Config'
export function  watchStompStart () {
    
    function * worker() {
        const state = yield select();
        if (state.user.isLogin) {
            stompClient = state.message.stompContext.newStompClient(config.websocket.base +config.websocket.address)
            yield put(Actions.MessageAction.doConect(stompClient));
        }
      }
    
    function * watcher() {
        while (true) {
            yield take(Types.USER_LOGIN_SUCCESS);
            yield call(worker);
        }
    }
    
    return {
        watcher,
        worker
    };
}

export function  watchStompConnected () {

    function * worker() {
        const state = yield select();
        if (state.user.isLogin) {
            state.message.stompClient.subscribe(config.websocket.single,state.message.msgReceiver);
        }
    }
    
    function * watcher() {
        while (true) {
            yield take(Types.STOMP_CONNECT_SUCCESS);
            yield call(worker);
        }
    }
    
    return {
        watcher,
        worker
    };
}
