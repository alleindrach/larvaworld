import { take, call, select  } from 'redux-saga/effects';

import * as Types from '../redux/action/ActionType';
import Api from '../service/Api'
import * as Actions from '../redux/action/index';

export function  watchStompStart () {

    function * worker() {
        const state = yield select();
        if (state.user.isLogin) {
            yield call(Api().connect,state.message.stompContext);
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
            state.message.stompClient.subscribe('/user/topic/message',state.message.msgReceiver);
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
