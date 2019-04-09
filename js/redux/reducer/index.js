import {combineReducers} from 'redux'
import  UserReducer from './UserReducer'
import AppReducer from './AppReducer'
import {persistStore, persistReducer, createMigrate} from 'redux-persist'
import {AsyncStorage} from 'react-native'
import hardSet from 'redux-persist/lib/stateReconciler/hardSet'
export const userPersistConfig = {
  key: 'user',
  storage: AsyncStorage,
  version: 1.2,
  blacklist: ['isLoading','password','isLogin'],
  // stateReconciler:hardSet
}
const RootReducer = combineReducers({
  app: AppReducer,
  user: persistReducer(userPersistConfig, UserReducer)
});

export default RootReducer