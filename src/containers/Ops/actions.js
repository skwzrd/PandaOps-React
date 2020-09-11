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

import { CHANGE_OPERATION } from './constants';

/**
 * Changes the input field of the form
 *
 * @param  {string} operation The operation of the dataframe we are displaying
 *
 * @return {object} An action object with a type of CHANGE_USERNAME
 */
export function changeOperation(operation) {
  return {
    type: CHANGE_OPERATION,
    payload: operation,
  };
}
