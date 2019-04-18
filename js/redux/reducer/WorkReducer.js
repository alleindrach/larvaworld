
import * as types from '../action/ActionType'
import {AsyncStorage} from 'react-native'
const initState = {
  isCaching: false,
  isCached: false,
  isSyncing:false,
  isSynced:false,
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
    case types.WORKS_UPDATE:
      return {
        ...state,
        isSyncing: true,
        isSynced: false,
        content:{
          ...state.content,
          ...action.work.content
        }
      }
    case type.WORKS_UPDATE_SUCCESS:
      return {
        ...state,
        isSyncing: false,
        isSynced: true,
        content:{
          ...state.content,
          ...action.work.content
        }
      }
    case type.WORKS_UPDATE_FAIL:
      return {
        ...state,
        isSyncing: false,
        isSynced: false,
        error:action.error,
        
      }
    case type.WORKS_UPDATE_SUCCESS:
      return {
        ...state,
        isSyncing: false,
        isSynced: true,
        content:{
          ...state.content,
          ...action.work.content
        }
      }
    case type.WORKS_SCENE_DEL:
      return {
        ...state,
        content:{
          ...action.work.content,
          scenes:action.work.content.scenes.splice(action.index-1,1)
        }
      }
    case type.WORKS_SCENE_ADD:
      return {
        ...state,
        content:{
          ...action.work.content,
          scenes:action.work.content.scenes.splice(action.insertAfter-1,action.scene)
        }
      }
    case WORKS_SCENE_IMAGE_SELECT:

      scene=action.work.content.scenes.findIndex(action.index-1);
      scene={
        ...scene,
        img:action.filepath
      }
      preScenes=[];
      if(action.index>1){
        preScenes=[
          ...action.work.content.scenes.slice(0,action.index-2)
        ]
      }
      postScenes=[];
      if(action.index<action.work.content.scenes.length)
      {
        postScenes=[
          ...action.work.content.scenes.slice(action.index)
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

    case WORKS_SCENE_AUDIO_SELECT:
      scene=action.work.content.scenes.findIndex(action.index-1);
      scene={
        ...scene,
        snd:action.filepath
      }
      preScenes=[];
      if(action.index>1){
        preScenes=[
          ...action.work.content.scenes.slice(0,action.index-2)
        ]
      }
      postScenes=[];
      if(action.index<action.work.content.scenes.length)
      {
        postScenes=[
          ...action.work.content.scenes.slice(action.index)
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

