import { take, call, select ,put } from 'redux-saga/effects';
import Api from '../service/Api';
import * as Types from '../redux/action/ActionType';
import * as SoundChannelsAction from '../redux/action/SoundChannelsAction';
import * as MessageActions from '../redux/action/MessageAction';
import * as CacheProvider from '../component/cached/CacheProvider';
import config from '../config/Config'
import * as FileUtils from '../utils/FileUtils'
import _  from 'lodash'
import { UserAction } from '../redux/action';
export function  watchSoundChannelsPrefetch() {
    function fetchFiles()
    {
        return Api().get(config.api.soundChannelsPrefetch).then((result)=>
        {
            return result
        }).catch(ex=>{
            return {state:0,error:''}
        })

    }
    function * worker() {

        const state = yield select();
        if (!state.soundChannels.isFetched) {
            try{
               result=yield call(fetchFiles,state.soundChannels)
               if(result.state==1)
                    yield put(SoundChannelsAction.prefetchChannelsSuccess(result.data))
                else
                    yield put(SoundChannelsAction.prefetchChannelsFail(result.reason))
            }catch(error)
            {
                yield put(SoundChannelsAction.prefetchChannelsFail(error))
            }
        }
      }
    
    function * watcher() {
        while (true) {
            yield take(Types.SOUND_CHANNELS_PREFETCH);
            yield call(worker);
        }
    }
    
    return {
        watcher,
        worker
    };
}

export function  watchSoundChannelsPrefetchFail() {
    
    function * worker() {
        yield setTimeout(
            ()=>{ put(SoundChannelsAction.prefetchChannels());},5000
        )
    }
    
    function * watcher() {
        while (true) {
            yield take(Types.SOUND_CHANNELS_PREFETCH_FAIL);
            yield call(worker);
        }
    }
    
    return {
        watcher,
        worker
    };
}


export function  watchChannelsStartSync() {
    function uploadFiles(channels)
    {
        
        return FileUtils.uploadChannels(config.api.base+config.api.soundChannelsSync,channels)
        // .uploadProgress((written, total) => {
        //   progress=written/total;
        // })
        .then((res) => {
          if(res.data && JSON.parse(res.data).state==1)
          {
              merging=JSON.parse(res.data).data
              return {success:true,merging}
          }else if(JSON.parse(res.data).state!=1){
              return {success:false,error:JSON.parse(res.data).message,errorCode:JSON.parse(res.data).reason}
          }
          else{
            return {success:false,error:'',errorCode:0}
          }
          console.log(res);
        }).catch((err) => {
          return {success:false,error:'网络错误'}
        })
    }
    function * worker() {
        console.log('start channels sync')
        const state = yield select();
        // if (!state.work.isSynced) {
            // try{
               result=yield call(uploadFiles,state.soundChannels.channels)
               if(result.success)
                    yield put(SoundChannelsAction.soundChannelsSyncSuccess(state.soundChannels,result.merging))
                else
                {
                    yield put(SoundChannelsAction.soundChannelsSyncFail(state.soundChannels,result.error))
                    if(result.errorCode=='000001')
                        yield put(UserAction.logout())
                }
                    
            // }catch(error)
            // {
            //     yield put(WorkActions.syncWorkUploadFail(state.work,error))
            // }
        // }
      }
    
    function * watcher() {
        while (true) {
            yield take(Types.SOUND_CHANNELS_SYNC);
            yield call(worker);
        }
    }
    
    return {
        watcher,
        worker
    };
}
export function  watchSoundChannelMerge() {
    async function  mergeFiles(local,merging)
    {
        
        allUrls=_.filter(_.reduce(_.mergeWith(_.cloneDeep(local),merging,(local,remote)=>{
            return {
                img:{local:local.img,remote:remote.img}
            }
        }),(acc,channel) =>{
            acc.push(channel.img);
            return acc;
        } ,[]),(item)=>{ 
            if( item.local!=item.remote && FileUtils.isLocalFile(item.local)) 
            return true;
            else 
            return false;
        });
        if(allUrls && allUrls.length>0)
        {
            result=  await  CacheProvider.cacheMultipleFiles(allUrls).then(()=>{
                console.log('cached finished!')
                return true
            }).catch((err)=>{
                return false;
            });
            console.log('mergefile finished!')
            return result;
        }            
        else
            return true;
    }

    function * worker() {

        const state = yield select();
       
            try{
               result=yield call(mergeFiles,state.soundChannels.channels,state.soundChannels.mergingChannels)
               if(result)
                    yield put(SoundChannelsAction.soundChannelsSyncMerged())
                else
                    yield put(SoundChannelsAction.soundChannelsSyncFail('缓存本地文件失败'))
            }catch(error)
            {
                yield put(SoundChannelsAction.soundChannelsSyncFail(error))
            }
        
      }
    
    function * watcher() {
        while (true) {
            yield take(Types.SOUND_CHANNELS_SYNC_UPLOAD_SUCCESS);
            yield call(worker);
        }
    }
    
    return {
        watcher,
        worker
    };
}




