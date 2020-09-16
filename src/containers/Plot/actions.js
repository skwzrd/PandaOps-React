/*
 * Plot Actions
 *
 * Actions change things in your application
 * Since this boilerplate uses a uni-directional data flow, specifically redux,
 * we have these actions which are the only way your application interacts with
 * your application state. This guarantees that your state is up to date and nobody
 * messes it up weirdly somewhere.
 *
 * To add a new Action:
 * 1) Import your constant
 * 2) Add a function like this:
 *    export function yourAction(var) {
 *        return { type: YOUR_ACTION_CONSTANT, var: var }
 *    }
 */

import {
  SET_SHOW_PLOT,
  SET_X_COLUMN,
  SET_Y_COLUMN,
} from './constants';

export const setShowPlot = (show) => ({
  type: SET_SHOW_PLOT,
  show_plot: show
});

export const setXColumn = (col) => ({
  type: SET_X_COLUMN,
  x_column: col
});

export const setYColumn = (col) => ({
  type: SET_Y_COLUMN,
  y_column: col
});
