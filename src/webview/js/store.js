import { createStore } from 'redux';
import { syncHistoryWithStore } from 'react-router-redux';
import { hashHistory } from 'react-router';
import rootReducer from './reducers';

import { defaultState as bridge } from './reducers/bridge';

const defaultState = {
  bridge
};

const store = createStore(rootReducer, defaultState, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
export const history = syncHistoryWithStore(hashHistory, store);

export default store;
