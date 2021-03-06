/*
 * DataFrameReducer
 *
 * The reducer takes care of our data. Using actions, we can
 * update our application state. To add a new action,
 * add it to the switch statement in the reducer function
 *
 */

// external imports
import produce from 'immer';

// our imports
import {
  SET_SHOW_METRICS,
  SET_SHOW_METRICS_BTN,
} from './constants';


export const initialState = {
  show_metrics: true,
  show_metrics_btn: true,
};

/* eslint-disable default-case, no-param-reassign */
const DataFrameReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case SET_SHOW_METRICS:
        draft.show_metrics = action.show_metrics;
        break;
      case SET_SHOW_METRICS_BTN:
        draft.show_metrics_btn = action.show_metrics_btn;
        break;
    }
  });

export default DataFrameReducer;
