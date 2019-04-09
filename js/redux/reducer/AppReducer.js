import * as types from "../action/ActionType";

const initState = {
  networkAvailable: true
}

export default function appReducer(state = initState, action) {
  switch (action.type) {
    case types.APP_NETWORK_AVAILABLE_CHANGE:
      return {
        ...state,
        networkAvailable: action.isConnected
      }
    default:
      return state
  }
}