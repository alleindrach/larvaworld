import {combineReducers} from 'redux'
import * as UserReducer from './UserReducer'
import AppReducer from './AppReducer'
import {persistStore, persistReducer, createMigrate} from 'redux-persist'

const RootReducer = combineReducers({
  app: AppReducer,
  user: persistReducer(UserReducer.userPersistConfig,UserReducer.userReducer),
});

export default RootReducer