import { take, call, select ,put } from 'redux-saga/effects';
import Api from '../service/Api';
import * as Types from '../redux/action/ActionType';
import * as UserActions from '../redux/action/UserAction';
import * as MessageActions from '../redux/action/MessageAction';
export function  watchUserLogin() {

    function * worker() {

        const state = yield select();
        if (!state.user.isLogin) {
            try{
                response =yield call(Api().login,state.user.username,state.user.password,state.user.captcha) ;
                if(response.state==1){
                    yield put(UserActions.loginSuccess(response.data,state.user.goBack))
                    if(state.user.goBack)
                        state.user.goBack();
                }
                else
                {
                    yield put(UserActions.loginFail(response.message))
                }
            }catch(error)
            {
                yield put(UserActions.loginFail('网络请求失败，请检查网络连接'));
            }
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
export function  watchUserLoginSuccess() {

    function * worker() {
         yield put(MessageActions.doConect);
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