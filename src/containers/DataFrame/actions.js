/*
 * DataFrame Actions
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
  SET_SHOW_METRICS,
  SET_SHOW_METRICS_BTN,
} from './constants';

export const setShowMetrics = (show) => ({
  type: SET_SHOW_METRICS,
  show_metrics: show
});

export const setShowMetricsBtn = (show) => ({
  type: SET_SHOW_METRICS_BTN,
  show_metrics_btn: show
});
