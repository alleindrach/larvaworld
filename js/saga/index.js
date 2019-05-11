import { fork ,takeLatest} from 'redux-saga/effects';
import  * as MessageSaga from './MessageSaga';
import  * as UserSaga from './UserSaga';
import * as WorkSaga from './WorkSaga';
import * as SoundChannelsSaga from './SoundChannelsSaga';
export default function * root (): any {
    // Sagas watcher是用来观察redux状态的，如果观察到了某request动作，则执行相关接口调用程序
    // 调用成功，交由reducer进行后续处理,将redux转为新状态，
    yield fork(UserSaga.watchUserLogin().watcher);
    yield fork(UserSaga.watchUserNav2Login().watcher);
    yield fork(UserSaga.watchUserLoginSuccess().watcher);
    yield fork(MessageSaga.watchStompConnected().watcher);
    yield fork(WorkSaga.watchWorkCach().watcher);
    yield fork(WorkSaga.watchWorkStartSync().watcher);
    yield fork(WorkSaga.watchWorkMerge().watcher);
    yield fork(SoundChannelsSaga.watchSoundChannelsPrefetch().watcher);
    yield fork(SoundChannelsSaga.watchChannelsStartSync().watcher);
    yield fork(SoundChannelsSaga.watchSoundChannelMerge().watcher);
    yield fork(SoundChannelsSaga.watchSoundChannelsPrefetchFail().watcher);
    yield fork(SoundChannelsSaga.watchChannelsSendMessage().watcher);
  };