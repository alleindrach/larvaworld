import * as types from "./ActionType";

export function netStateChange(isConnected) {
  return {
    type: types.APP_NETWORK_AVAILABLE_CHANGE,
    isConnected
  }
}