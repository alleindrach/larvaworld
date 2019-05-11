import { take, call, select ,put } from 'redux-saga/effects';
import Api from '../service/Api';
import * as Types from '../redux/action/ActionType';
import * as UserActions from '../redux/action/UserAction';
import * as MessageActions from '../redux/action/MessageAction';
import {AppNavigator} from '../router/index';
import { NavigationActions } from 'react-navigation'
import  NavigationService  from '../service/Nav'
import { SoundChannelsAction } from '../redux/action';

export function  watchUserNav2Login() {

    function * worker() {

        const state = yield select();
        NavigationService.navigate('Login')
        // yield put();

      }
    
    function * watcher() {
        while (true) {
            yield take(Types.USER_NAV_LOGIN);
            yield call(worker);
        }
    }
    
    return {
        watcher,
        worker
    };
}
export function  watchUserLogin() {

    function * worker() {

        const state = yield select();
        if (!state.user.isLogin) {
            // try{
                response =yield call(Api().login,state.user.username,state.user.password,state.user.captcha) ;
                if( response && response.state==1){
                    yield put(UserActions.loginSuccess(response.data,state.user.goBack)),
                    yield call(NavigationService.back,{action:Types.USER_LOGIN_SUCCESS})
                    
                    // if(state.user.goBack)
                    //     state.user.goBack();
                }
                else
                {
                    yield put(UserActions.loginFail(response.message))
                }
            // }catch(error)
            // {
            //     yield put(UserActions.loginFail('网络请求失败，请检查网络连接'));
            // }
        }
      }
    
    function * watcher() {
        while (true) {
            yield take(Types.USER_LOGIN_DOING);
            yield call(worker);
        }
    }
    
    return {
        watcher,
        worker
    };
}
// export function  watchUserLoginSuccess() {

//     function * worker() {
//          yield put(MessageActions.doConect);
//     }
    
//     function * watcher() {
//         while (true) {
//             yield take(Types.USER_LOGIN_SUCCESS);
//             yield call(worker);
//         }
//     }
    
//     return {
//         watcher,
//         worker
//     };
// }
export function  watchUserLoginSuccess () {
    
    function * worker() {
        const state = yield select();
        if (state.user.isLogin) {
            stompClient = state.message.stompContext.newStompClient(config.websocket.base +config.websocket.address)
            yield put(MessageActions.doConect(stompClient));
            yield put(SoundChannelsAction.prefetchChannels());
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

export function  watchHomepageUpdate() {

    function * worker() {

        const state = yield select();
        if (state.user.isLogin) {
            try{
                response =yield call(Api().fetchHomepageInfo) ;
                if(response.state==1){
                    yield put(UserActions(response.data,state.user.goBack))
                }
                else
                {
                    yield put(UserActions.logout())
                }
            }catch(error)
            {
                yield put(UserActions.loginFail('网络请求失败，请检查网络连接'));
            }
        }
      }
    
    function * watcher() {
        while (true) {
            yield take(Types.USER_HOME_PAGE_FETCH);
            yield call(worker);
        }
    }
    
    return {
        watcher,
        worker
    };
}