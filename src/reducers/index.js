import { combineReducers } from 'redux';
// import { routerReducer } from 'react-router-redux';
import { tree } from './tree';
import { user } from './user';
import { circuit } from './circuit';
import { global } from './global';

export default combineReducers({
  // router: routerReducer,
  tree,
  user,
  circuit,
  global
});
