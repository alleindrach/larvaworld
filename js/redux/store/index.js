
import {persistStore, persistReducer, createMigrate} from 'redux-persist'
import {AsyncStorage} from 'react-native'
import {createStore, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import logger from 'redux-logger'
import rootReducer from '../reducer/index'
import createSagaMiddleware from 'redux-saga';       // 引入redux-saga中的createSagaMiddleware函数
import sagas from '../../saga/index';                    // 引入saga.js

const sagaMiddleware = createSagaMiddleware()        // 执行

//redux state 版本迁移
const migrations = {
    1.1: (state) => {
      return {
        ...state,
        //other modify state
      }
    },
  }
  
const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    version: 1.4,
    // whitelist: ['user'],
    blacklist: ['user','message'],
    migrate: createMigrate(migrations, {debug: false}),
}
  
const reducer = persistReducer(persistConfig, rootReducer)
  
const middlewares =[sagaMiddleware];// [thunk]
  
// process.env.NODE_ENV === `development` &&
middlewares.push(logger)

const createStoreWithMiddleware = applyMiddleware(...middlewares)(createStore)
  
export default function configureStore(onComplete: () => void) {
    const store = createStoreWithMiddleware(reducer)
    const persistor = persistStore(store, {}, onComplete)
    sagaMiddleware.run(sagas) ;
    return {store, persistor}
}

