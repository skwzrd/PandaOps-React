/*
 * Operation Actions
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
  RESET_STATE,
  CONSUME_HTML_DF,
  CONSUME_JSON_DF,
  INCREMENT_COUNT,
  UPDATE_ROWS,

  CHANGE_CMD,
  CHANGE_NAME,
} from './constants';

export const resetState = () => ({
  type: RESET_STATE
})

export const changeName = (name) => ({
  type: CHANGE_NAME,
  name
})

export const incrementCount = (value) => ({
  type: INCREMENT_COUNT,
  value
})

export const changeCmd = (cmd) => ({
  type: CHANGE_CMD,
  cmd
})

export const consumeHtmlDf = data => ({
  type: CONSUME_HTML_DF,
  data
})

export const consumeJsonDf = data => ({
  type: CONSUME_JSON_DF,
  data
})

export const updateRows = data => ({
  type: UPDATE_ROWS,
  data
})
