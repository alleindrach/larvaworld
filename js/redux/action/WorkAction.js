import * as types from "./ActionType"

export function selectWork(work) {
  return {
    type: types.WORKS_SELECT,
    work
  }
}
export function workcach(work) {
    return {
      type: types.WORKS_CACHING,
      work
    }
  }
export function workcached(work) {
    return {
      type: types.WORKS_CACHED,
      work
    }
  }
export function updateWork(work) {
    return {
      type: types.WORKS_UPDATE,
      work
    }
}
export function updateWorkSuccess(work) {
return {
    type: types.WORKS_UPDATE_SUCCESS,
    work
    }
}

export function updateWorkFail(work) {
    return {
        type: types.WORKS_UPDATE_FAIL,
        work
    }
}

export function deleteScene(work,index) {
    return {
        type: types.WORKS_SCENE_DEL,
        work,
        index
    }
}
export function addScene(work,insertafter,scene) {
    return {
        type: types.WORKS_SCENE_ADD,
        work,
        insertafter,
        scene
    }
}
export function selectImage(work,index,filepath){
    return {
        type:types.WORKS_SCENE_IMAGE_SELECT,
        work,
        index,
        filepath
    }
}
export function selectAudio(work,index,filepath){
    return {
        type:types.WORKS_SCENE_AUDIO_SELECT,
        work,
        index,
        filepath
    }
}