/*
 * Plot Constants
 * Each action has a corresponding type, which the reducer knows and picks up on.
 * To avoid weird typos between the reducer and the actions, we save them as
 * constants here. We prefix them with 'yourproject/YourComponent' so we avoid
 * reducers accidentally picking up actions they shouldn't.
 *
 * Follow this format:
 * export const YOUR_ACTION_CONSTANT = 'yourproject/YourContainer/YOUR_ACTION_CONSTANT';
 */

export const SET_SHOW_PLOT = 'pandaOps/Plot/SET_SHOW_PLOT';
export const SET_X_COLUMN = 'pandaOps/Plot/SET_X_COLUMN';
export const SET_Y_COLUMN = 'pandaOps/Plot/SET_Y_COLUMN';
