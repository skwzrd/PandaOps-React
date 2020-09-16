import { combineReducers } from 'redux';
import appReducer from './containers/App/reducer';
import DataFrameReducer from './containers/DataFrame/reducer';

export default combineReducers({
  globalState: appReducer,
  DataFrameState: DataFrameReducer,
});
