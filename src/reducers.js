import { combineReducers } from 'redux';
import operationsReducer from './containers/Ops/reducer';
import appReducer from './containers/App/reducer';

export default combineReducers({
  operation: operationsReducer,
  globalState: appReducer
});
