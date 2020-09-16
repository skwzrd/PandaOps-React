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
  SET_SHOW_PLOT,
  SET_SHOW_METRICS,
  SET_SHOW_METRICS_BTN,
  SET_X_COLUMN,
  SET_Y_COLUMN,
  SET_X_AXIS_BUTTONS,
  SET_Y_AXIS_BUTTONS,
} from './constants';


export const initialState = {
  show_metrics: true,
  show_metrics_btn: true,
  show_plot: false,
  x_column: '',
  y_column: '',
};

/* eslint-disable default-case, no-param-reassign */
const DataFrameReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case SET_SHOW_PLOT:
        draft.show_plot = action.show_plot;
        break;
      case SET_SHOW_METRICS:
        draft.show_metrics = action.show_metrics;
        break;
      case SET_SHOW_METRICS_BTN:
        draft.show_metrics_btn = action.show_metrics_btn;
        break;
      case SET_X_COLUMN:
        draft.x_column = action.x_column;
        break;
        case SET_Y_COLUMN:
        draft.y_column = action.y_column;
        break;
      case SET_X_AXIS_BUTTONS:
        draft.x_axis_buttons = action.x_axis_buttons;
        break;
      case SET_Y_AXIS_BUTTONS:
        draft.y_axis_buttons = action.y_axis_buttons;
        break;
    }
  });

export default DataFrameReducer;
