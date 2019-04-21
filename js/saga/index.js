import { fork ,takeLatest} from 'redux-saga/effects';
import  * as MessageSaga from './MessageSaga';
import  * as UserSaga from './UserSaga';
import * as WorkSaga from './WorkSaga'
import * as Types from '../redux/action/ActionType';
export default function * root (): any {
    // Sagas watcher是用来观察redux状态的，如果观察到了某request动作，则执行相关接口调用程序
    // 调用成功，交由reducer进行后续处理,将redux转为新状态，
    yield fork(UserSaga.watchUserLogin().watcher);
    yield fork(MessageSaga.watchStompStart().watcher);
    yield fork(MessageSaga.watchStompConnected().watcher);
    yield fork(WorkSaga.watchWorkCach().watcher);
    yield fork(WorkSaga.watchWorkSync().watcher);
  };