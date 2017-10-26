import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

// Import reducers
import bridge from './bridge';

export default combineReducers({
  bridge,
  routing: routerReducer
});
