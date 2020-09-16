/*
 * PlotReducer
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
  SET_X_COLUMN,
  SET_Y_COLUMN,
} from './constants';


export const initialState = {
  show_plot: false,
  x_column: '',
  y_column: '',
};

/* eslint-disable default-case, no-param-reassign */
const PlotReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case SET_SHOW_PLOT:
        draft.show_plot = action.show_plot;
        break;
      case SET_X_COLUMN:
        draft.x_column = action.x_column;
        break;
        case SET_Y_COLUMN:
        draft.y_column = action.y_column;
        break;
    }
  });

export default PlotReducer;
