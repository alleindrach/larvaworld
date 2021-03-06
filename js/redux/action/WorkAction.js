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
export function syncWork(work) {
    return {
      type: types.WORK_SYNC,
      work
    }
}
export function syncWorkUploadSuccess(work,merging) {
return {
    type: types.WORK_SYNC_UPLOAD_SUCCESS,
    work,
    merging
    }
}
export function syncWorkMerged(work) {
return {
    type: types.WORK_SYNC_MERGED,
    work,
    }
}


export function syncWorkUploadFail(work,errorCode,error) {
    return {
        type: types.WORK_SYNC_UPLOAD_FAIL,
        work,
        errorCode,
        error
    }
}

export function deleteScene(work,index) {
    return {
        type: types.WORK_SCENE_DEL,
        work,
        index
    }
}
export function selectScene(work,index){
    return {
      type:types.WORK_SCENE_SELECT,
      work,
      index
    }
}
export function addScene(work,scene) {
    return {
        type: types.WORK_SCENE_ADD,
        work,
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
export function selectAudio(work,filepath,play){
    return {
        type:types.WORK_SCENE_AUDIO_SELECT,
        work,
        filepath,
        play
    }
}