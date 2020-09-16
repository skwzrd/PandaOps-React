/*
 * AppConstants
 * Each action has a corresponding type, which the reducer knows and picks up on.
 * To avoid weird typos between the reducer and the actions, we save them as
 * constants here. We prefix them with 'yourproject/YourComponent' so we avoid
 * reducers accidentally picking up actions they shouldn't.
 *
 * Follow this format:
 * export const YOUR_ACTION_CONSTANT = 'yourproject/YourContainer/YOUR_ACTION_CONSTANT';
 */

export const RESET_COL_BTN_CLASSNAMES = 'pandaOps/DataFrame/RESET_COL_BTN_CLASSNAMES';
export const SET_SHOW_PLOT = 'pandaOps/DataFrame/SET_SHOW_PLOT';
export const SET_SHOW_METRICS = 'pandaOps/DataFrame/SET_SHOW_METRICS';
export const SET_SHOW_METRICS_BTN = 'pandaOps/DataFrame/SET_SHOW_METRICS_BTN';
export const SET_X_COLUMN = 'pandaOps/DataFrame/SET_X_COLUMN';
export const SET_Y_COLUMN = 'pandaOps/DataFrame/SET_Y_COLUMN';
export const SET_INITIAL_COL_BTN_CLASSNAMES = 'pandaOps/DataFrame/SET_INITIAL_COL_BTN_CLASSNAMES';
export const SET_X_AXIS_BUTTONS = 'pandaOps/DataFrame/SET_X_AXIS_BUTTONS';
export const SET_Y_AXIS_BUTTONS = 'pandaOps/DataFrame/SET_Y_AXIS_BUTTONS';
