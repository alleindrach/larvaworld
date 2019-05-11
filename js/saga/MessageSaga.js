import { take, call, select ,put } from 'redux-saga/effects';

import * as Types from '../redux/action/ActionType';
import Api from '../service/Api'
import * as Actions from '../redux/action/index';
import config from '../config/Config'

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
