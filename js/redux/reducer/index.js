import {combineReducers} from 'redux'
import  UserReducer from './UserReducer'
import AppReducer from './AppReducer'
import MessageReducer from './MessageReducer'
import  EventReducer from './EventReducer'
import  WorkReducer from './WorkReducer'
import {persistStore, persistReducer, createMigrate} from 'redux-persist'
import {AsyncStorage} from 'react-native'
import hardSet from 'redux-persist/lib/stateReconciler/hardSet'
const userPersistConfig = {
  key: 'user',
  storage: AsyncStorage,
  version: 1.2,
  blacklist: ['isLoading','password','isLogin'],
  // stateReconciler:hardSet
}
const messagePersistConfig = {
  key: 'message',
  storage: AsyncStorage,
  version: 1.4,
  whitelist:[],// ['isConnecting','isConnected','error','stompClient','stompContext','msgReceiver'],
  // stateReconciler:hardSet
}
const eventPersistConfig = {
  key: 'event',
  storage: AsyncStorage,
  version: 1.0,
  whitelist:[],// ['isConnecting','isConnected','error','stompClient','stompContext','msgReceiver'],
  // stateReconciler:hardSet
}
const workPersistConfig = {
  key: 'work',
  storage: AsyncStorage,
  version: 1.1,
  whitelist:[],// ['isConnecting','isConnected','error','stompClient','stompContext','msgReceiver'],
  // stateReconciler:hardSet
}
const RootReducer = combineReducers({
  app:    AppReducer,
  work:   persistReducer(workPersistConfig,WorkReducer),
  user:   persistReducer(userPersistConfig, UserReducer),
  message: persistReducer(messagePersistConfig, MessageReducer),
  event:  persistReducer(eventPersistConfig, EventReducer),
});

export default RootReducer