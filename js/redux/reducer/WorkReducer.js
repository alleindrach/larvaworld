
import * as types from '../action/ActionType'
const initState = {
  isCaching: false,
  isCached: false,
  isSyncing:false,
  isSynced:false,
  uploadingProcess:100,
  content:null,
  current:0
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
        current:0,
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
    case types.WORK_SCENE_SELECT:
      return {
        ...state ,
        current:action.index
      }
    case types.WORK_SCENE_DEL:
      preScenes=[];
      current=state.current
      if(current>=0){
        preScenes=[
          ...action.work.content.scenes.slice(0,current)
        ]
      }
      postScenes=[];
      if(current<action.work.content.scenes.length-1)
      {
        postScenes=[
          ...action.work.content.scenes.slice(current+1)
        ]
      } 
      if(current=action.work.content.scenes.length-1)
        current--;

      return {
        ...state,
        current,
        content:{
          ...action.work.content,
          scenes:[
            ...preScenes,
            ...postScenes
          ]
        }
      }

    case types.WORK_SCENE_ADD:
      current=state.current;
      preScenes=[];
      if(current>=0){
        preScenes=[
          ...action.work.content.scenes.slice(0,current+1)
        ]
      }
      postScenes=[];
      if(current<action.work.content.scenes.length-1)
      {
        postScenes=[
          ...action.work.content.scenes.slice(current+1)
        ]
      } 
      return {
        ...state,
        content:{
          ...action.work.content,
          scenes:[
            ...preScenes,
            action.scene,
            ...postScenes
          ]
        }
      }

    case types.WORK_SCENE_IMAGE_SELECT:

      scene=action.work.content.scenes[state.current];
      scene={
        ...scene,
        img:action.filepath
      }
      preScenes=[];
      if(state.current>0){
        preScenes=[
          ...action.work.content.scenes.slice(0,state.current)
        ]
      }
      postScenes=[];
      if(state.current<action.work.content.scenes.length-1)
      {
        postScenes=[
          ...action.work.content.scenes.slice(state.current+1)
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
      scene=action.work.content.scenes[state.current];
      scene={
        ...scene,
        snd:action.filepath
      }
      preScenes=[];
      if(state.current>0){
        preScenes=[
          ...action.work.content.scenes.slice(0,state.current)
        ]
      }
      postScenes=[];
      if(state.current<action.work.content.scenes.length-1)
      {
        postScenes=[
          ...action.work.content.scenes.slice(state.current+1)
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

