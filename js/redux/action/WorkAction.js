import * as types from "./ActionType"

export function selectWork(work) {
  return {
    type: types.WORK_SELECT,
    work
  }
}
export function workcache(work) {
    return {
      type: types.WORK_CACHING,
      work
    }
  }
export function workcached(work) {
    return {
      type: types.WORK_CACHED,
      work
    }
  }
export function workcachefail(work,error) {
    return {
      type: types.WORK_CACHE_FAIL,
      work,
      error
    }
  }  
export function updateWork(work) {
    return {
      type: types.WORK_UPDATE,
      work
    }
}
export function updateWorkSuccess(work) {
return {
    type: types.WORK_UPDATE_SUCCESS,
    work
    }
}

export function updateWorkFail(work) {
    return {
        type: types.WORK_UPDATE_FAIL,
        work
    }
}

export function deleteScene(work,index) {
    return {
        type: types.WORK_SCENE_DEL,
        work,
        index
    }
}
export function addScene(work,insertafter,scene) {
    return {
        type: types.WORK_SCENE_ADD,
        work,
        insertafter,
        scene
    }
}
export function selectImage(work,index,filepath){
    return {
        type:types.WORK_SCENE_IMAGE_SELECT,
        work,
        index,
        filepath
    }
}
export function selectAudio(work,index,filepath){
    return {
        type:types.WORK_SCENE_AUDIO_SELECT,
        work,
        index,
        filepath
    }
}