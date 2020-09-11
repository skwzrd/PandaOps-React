import { combineReducers } from 'redux';
import operationsReducer from './containers/Ops/reducer';

export default combineReducers({
  operation: operationsReducer
});
