/**
 * Created by jialing on 2017/10/30.
 */

import * as types from '../action/ActionType'
import _ from 'lodash'

const listInitState = {
  hasMore: false,
  data: [],
  error: '',
  action: ''
}
const initState = {
  userEventList: listInitState,
  allEventList: listInitState,
  index: 1
}

export default function EventReducer(state = initState, action) {
  switch (action.type) {
    case types.USER_LOGIN_SUCCESS:
      return {
        ...state,
        userEventList: listInitState,
        allEventList: listInitState,
        index: 0
      }
    case types.USER_LOGOUT:
      return {
        ...state,
        userEventList: listInitState,
        index: 1
      }
    case types.EVENT_LIST_FETCH_DOING:
      if (action.index === 0)
        return {
          ...state,
          userEventList: {
            ...state.userEventList,
            action: action.action,
            error: '',
          }
        }
      else
        return {
          ...state,
          allEventList: {
            ...state.allEventList,
            action: action.action,
            error: '',
          }
        }
    case types.EVENT_LIST_FETCH_SUCCESS:
      if (action.index === 0)
        return {
          ...state,
          userEventList: {
            ...state.userEventList,
            action: '',
            data: action.data,
            hasMore: action.hasMore
          }
        }
      else
        return {
          ...state,
          allEventList: {
            ...state.allEventList,
            action: '',
            data: action.data,
            hasMore: action.hasMore
          }
        }
    case types.EVENT_LIST_FETCH_FAIL:
      if (action.index === 0)
        return {
          ...state,
          userEventList: {
            ...state.userEventList,
            action: '',
            error: action.error
          }
        }
      else
        return {
          ...state,
          allEventList: {
            ...state.allEventList,
            action: '',
            error: action.error
          }
        }
    case types.EVENT_LIST_DELETE_ROW:
      let data = action.index === 0 ? state.userEventList.data.slice() : state.allEventList.data.slice()
      data.splice(action.rowID, 1)
      if (action.index === 0)
        return {
          ...state,
          userEventList: {
            ...state.userEventList,
            data
          }
        }
      else
        return {
          ...state,
          allEventList: {
            ...state.allEventList,
            data
          }
        }
    case types.EVENT_LIST_SWITCH_INDEX:
      return {
        ...state,
        index: action.index
      }
    case types.EVENT_LIST_PRAISE_EVENT: {
      let userEvData = state.userEventList.data.slice();
      let allEvData = state.allEventList.data.slice();
      for (let i = 0; i < 2; i++) {
        let data = i === 0 ? userEvData : allEvData;
        let index = _.findIndex(data, {eventId: action.eventId});
        let rowData = {...data[index]};
        rowData.praise = action.action;
        rowData.praiseNum = rowData.praiseNum || 0;
        action.action === 'yes' ? rowData.praiseNum++ : rowData.praiseNum--;
        data[index] = rowData;
      }
      return {
        ...state,
        userEventList: {
          ...state.userEventList,
          data: userEvData
        },
        allEventList: {
          ...state.allEventList,
          data: allEvData
        },
        getState:action.getState
      }
    }
    case types.EVENT_LIST_PRAISE_WORK: {
      let userEvData = state.userEventList.data.slice();
      let allEvData = state.allEventList.data.slice();
      for (let i = 0; i < 2; i++) {
        let data = i === 0 ? userEvData : allEvData;
        let index = _.findIndex(data, {type: 'NewsWorks', content: {workId: action.workId}});
        let rowData = {...data[index]};
        rowData.praise = action.action;
        rowData.praiseNum = rowData.praiseNum || 0;
        action.action === 'yes' ? rowData.praiseNum++ : rowData.praiseNum--;
        data[index] = rowData;
      }
      return {
        ...state,
        userEventList: {
          ...state.userEventList,
          data: userEvData
        },
        allEventList: {
          ...state.allEventList,
          data: allEvData
        }
      }
    }
    default:
      return state;
  }
}