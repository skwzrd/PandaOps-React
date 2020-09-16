import { combineReducers } from 'redux';
import appReducer from './containers/App/reducer';
import DataFrameReducer from './containers/DataFrame/reducer';
import PlotReducer from './containers/Plot/reducer';

export default combineReducers({
  globalState: appReducer,
  DataFrameState: DataFrameReducer,
  PlotState: PlotReducer,
});
