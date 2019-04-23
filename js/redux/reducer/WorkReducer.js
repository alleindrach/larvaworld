
import * as types from '../action/ActionType'
import {AsyncStorage} from 'react-native'

const initState = {
  isCaching: false,
  isCached: false,
  isSyncing:false,
  isSynced:false,
  uploadingProcess:100,
  content:null
}

export default function messageReducer(state = initState, action) {
  switch (action.type) {
    case types.WORK_SELECT:
      return {
        ...state,
        isCaching: false,
        isCached: false,
        isSyncing:false,
        isSynced:false,
        uploadingProcess:100,
        error: '',
        content:{
          ...state.content,
          ...action.work.content
        }
      }
    case types.WORK_CACHING:
      return {
        ...state,
        isCaching: ture,
        isCached: true,
        content:{
          ...state.content,
          ...action.work.content
        }
      }
    case types.WORK_CACHED:
      return {
        ...state,
        isCaching: false,
        isCached: true,
        content:{
          ...state.content,
          ...action.work.content
        }
      }
    case types.WORK_CACHE_FAIL:
      return {
        ...state,
        isCaching: false,
        isCached: true,
        content:{
          ...state.content,
          ...action.work.content
        },
        error:action.error

    }
    case types.WORK_SYNC:
      return {
        ...state,
        isSyncing: true,
        isSynced: false,
        uploadingProcess:0,
        content:{
          ...state.content,
          ...action.work.content
        }
      }
    case types.WORK_SYNC_UPLOADING:
      return {
        ...state,
        uploadingProcess:action.process,
      }
    case types.WORK_SYNC_UPLOAD_SUCCESS:
      return {
        ...state,
        uploadingProcess:100,
        merging:action.merging
      }
    case types.WORK_SYNC_MERGED:
    return {
      ...state,
      isSyncing: false,
      isSynced: true,
      content:{
        ...state.merging, 
      },
      merging:null
    }
    case types.WORK_SYNC_UPLOAD_FAIL:
      return {
        ...state,
        isSyncing: false,
        isSynced: false,
        uploadingProcess:100,
        error:action.error,
        
      }
  
    case types.WORK_SCENE_DEL:
      return {
        ...state,
        content:{
          ...action.work.content,
          scenes:action.work.content.scenes.splice(action.index,1)
        }
      }
    case types.WORK_SCENE_ADD:
      state.content.scenes.splice(action.insertAs,0,action.scene)
      return {
        ...state,
        
      }
    case types.WORK_SCENE_IMAGE_SELECT:

      scene=action.work.content.scenes[action.index];
      scene={
        ...scene,
        img:action.filepath
      }
      preScenes=[];
      if(action.index>0){
        preScenes=[
          ...action.work.content.scenes.slice(0,action.index)
        ]
      }
      postScenes=[];
      if(action.index<action.work.content.scenes.length-1)
      {
        postScenes=[
          ...action.work.content.scenes.slice(action.index+1)
        ]
      } 
      return {
        ...state,
        content:{
          ...action.work.content,
          scenes:[
            ...preScenes,
            scene,
            ...postScenes
          ]
        }
      }

    case types.WORK_SCENE_AUDIO_SELECT:
      scene=action.work.content.scenes[action.index];
      scene={
        ...scene,
        snd:action.filepath
      }
      preScenes=[];
      if(action.index>0){
        preScenes=[
          ...action.work.content.scenes.slice(0,action.index)
        ]
      }
      postScenes=[];
      if(action.index<action.work.content.scenes.length-1)
      {
        postScenes=[
          ...action.work.content.scenes.slice(action.index+1)
        ]
      } 
      return {
        ...state,
        content:{
          ...action.work.content,
          scenes:[
            ...preScenes,
            scene,
            ...postScenes
          ]
        }
      }    
    default:
      return state;
  }
}

