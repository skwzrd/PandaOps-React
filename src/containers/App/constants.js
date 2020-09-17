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

export const RESET_STATE = 'pandaOps/App/RESET_STATE';
export const CONSUME_HTML_DF = 'pandaOps/App/CONSUME_HTML_DF';
export const CONSUME_JSON_DF = 'pandaOps/App/CONSUME_JSON_DF';
export const INCREMENT_COUNT = 'pandaOps/App/INCREMENT_COUNT';
export const UPDATE_ROWS = 'pandaOps/App/UPDATE_ROWS';

export const CHANGE_NAME = 'pandaOps/App/CHANGE_NAME';
export const CHANGE_CMD = 'pandaOps/App/CHANGE_CMD';
export const CHANGE_ALL_ROWS_LOADED = 'pandaOps/App/CHANGE_ALL_ROWS_LOADED';

