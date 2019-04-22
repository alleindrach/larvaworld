import { take, call, select ,put } from 'redux-saga/effects';
import Api from '../service/Api';
import * as Types from '../redux/action/ActionType';
import * as WorkActions from '../redux/action/WorkAction';
import * as MessageActions from '../redux/action/MessageAction';
import * as CacheProvider from '../component/cached/CacheProvider';
import config from '../config/Config'
import * as FileUtils from '../utils/FileUtils'
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
                // files=_.sortedUniq(files)
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
                else
                    yield put(WorkActions.workcachefail(state.work,'缓存网络文件失败'))
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

export function  watchWorkStartSync() {
    function uploadFiles(work)
    {
        
        return FileUtils.uploadWork(config.api.base+config.api.storySync,work)
        .uploadProgress((written, total) => {
          progress=written/total;
        })
        .then((res) => {
          if(res.data && JSON.parse(res.data).state==1)
          {
              merging=JSON.parse(JSON.parse(res.data).data)
              return {success:true,merging}
          }else if(JSON.parse(res.data).state!=1){
              return {success:false,error:JSON.parse(res.data).message}
          }
          else{
            return {success:false,error:''}
          }
          console.log(res);
        }).catch((err) => {
          return {success:false,error:'网络错误'}
        })
    }
    function * worker() {
        console.log('start uploadding')
        const state = yield select();
        // if (!state.work.isSynced) {
            // try{
               result=yield call(uploadFiles,state.work)
               if(result.success)
                    yield put(WorkActions.syncWorkUploadSuccess(state.work,result.merging))
                else
                    yield put(WorkActions.syncWorkUploadFail(state.work,result.error))
            // }catch(error)
            // {
            //     yield put(WorkActions.syncWorkUploadFail(state.work,error))
            // }
        // }
      }
    
    function * watcher() {
        while (true) {
            yield take(Types.WORK_SYNC);
            yield call(worker);
        }
    }
    
    return {
        watcher,
        worker
    };
}
export function  watchWorkMerge() {
    function mergeFiles(local,merging)
    {
        
        allUrls=_.filter(_.reduce(_.mergeWith(_.cloneDeep(local.scenes),merging.scenes,(local,remote)=>{
            return {
                img:{local:local.img,remote:remote.img},
                snd:{local:local.snd,remote:remote.snd},
            }
        }),(acc,scene) =>{
            acc.push(scene.img);
            acc.push(scene.snd);
            return acc;
        } ,[]),(item)=>{ 
            if( item.local!=item.remote && FilesUtils.isLocalFile(item.local.img)) 
            return true;
            else 
            return false;
        });
        if(allUrls && allUrls.length>0)
            return  CacheProvider.cacheMultipleFiles(allUrls).then(()=>{
                return true;
            }).catch(()=>{
                return false;
            })
        else
            return true;
    }

    function * worker() {

        const state = yield select();
       
            try{
               result=yield call(mergeFiles,state.work.content,state.work.merging)
               if(result)
                    yield put(WorkActions.syncWorkMerged(state.work))
                else
                    yield put(WorkActions.syncWorkUploadFail(state.work,'缓存本地文件失败'))
            }catch(error)
            {
                yield put(WorkActions.syncWorkUploadFail(state.work,error))
            }
        
      }
    
    function * watcher() {
        while (true) {
            yield take(Types.WORK_SYNC_UPLOAD_SUCCESS);
            yield call(worker);
        }
    }
    
    return {
        watcher,
        worker
    };
}




