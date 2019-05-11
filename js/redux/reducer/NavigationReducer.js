
import {AppNavigator} from '../../router';
import Immutable from 'immutable';
import { NavigationActions } from 'react-navigation'
const initialState ={
  index: 0,
  routes: [{
    routeName: 'Login',
    key: 'Login'
  }]
};
//  Immutable.fromJS({
//     index: 0,
//     routes: [{
//       routeName: 'Login',
//       key: 'Login'
//     }]
//   });
  
export default function NavigationReducer (state = initialState, action) {

  const newState = Object.assign({}, state, AppNavigation.router.getStateForAction(action, state));
  return newState || state;

    // if(action.type==NavigationActions.NAVIGATE)
    // {
    //   console.log('navigate to ',action)
    // }
    // const jsState=state.toJS();
    // const actionState=AppNavigator.router.getStateForAction(action, jsState)
    // const newState = state.merge(actionState);
    // return newState || state;
  };
  