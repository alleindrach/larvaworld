
import * as types from "./ActionType"
import config from '../../config/Config'
import _ from 'lodash'

export function fetch(index, action) {
    return {
        type: types.EVENT_LIST_FETCH_DOING,
        index,
        action
    }
}
export function fetchSuccess(index, data,hasMore) {
    return {
        type: types.EVENT_LIST_FETCH_SUCCESS,
        index,
        data: cacheData,
        hasMore
      }
}

export function fetchFail(index, message) {
    return {
        type: types.EVENT_LIST_FETCH_SUCCESS,
        index,
        error:message
      }
}

export function deleteRow(index, eventID) {
    return {
      type: types.EVENT_LIST_DELETE_ROW,
      index,
      eventID
    }
  }

  export function doPraise(eventID,getState) {
    return {
        type: types.EVENT_LIST_PRAISE_EVENT,
        eventID,
        getState
      }
  }

  export function praiseDone(eventID,getState) {
    return {
        type: types.EVENT_LIST_PRAISE_EVENT_DONE,
        eventID,
        getState
      }
  }


export function switchIndex(index) {
    return {
      type: types.EVENT_LIST_SWITCH_INDEX,
      index
    }
  }

export function workDoPraise(workId, action) {
  return {
    type: types.EVENT_LIST_PRAISE_WORK,
    workId,
    action
  }
}