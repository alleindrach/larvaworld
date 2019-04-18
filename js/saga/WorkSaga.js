import { take, call, select ,put } from 'redux-saga/effects';
import Api from '../service/Api';
import * as Types from '../redux/action/ActionType';
import * as WorkActions from '../redux/action/WorkAction';
import * as MessageActions from '../redux/action/MessageAction';
import * as CacheProvider from '../component/cached/CacheProvider';
import _  from 'lodash'
export function  watchWorkCach() {
    function cacheFiles(work)
    {
        if (!work.isCaching&& !work.isCached) {
            try{
                const {scenes}=work.content;
                files=_.reduce(scenes,(files,scene)=>{
                    if (_.indexOf(files,scene.img)<0)
                        files.push(scene.img);
                    if (_.indexOf(files,scene.snd)<0)
                        files.push(scene.snd);
                    return files;
                },[])
                files=_.sortedUniq(files)
                return CacheProvider.cacheMultipleFiles(files)
                .then(()=>{
                    return true;
                })
                .catch((error)=>{
                    throw new Error('fail cache files!')
                })
            }
            catch(error)
            {
                throw new Error('网络请求失败，请检查网络连接');
            }
        }else
        return false;

    }
    function * worker() {

        const state = yield select();
        if (!state.work.isCaching&& !state.work.isCached) {
            try{
               result=yield call(cacheFiles,state.work)
               if(result)
                    yield put(WorkActions.workcached(state.work))
            }catch(error)
            {
                yield put(WorkActions.workcachefail(state.work,error))
            }
        }
      }
    
    function * watcher() {
        while (true) {
            yield take(Types.WORK_SELECT);
            yield call(worker);
        }
    }
    
    return {
        watcher,
        worker
    };
}
