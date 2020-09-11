/*
 * OperationsReducer
 *
 * The reducer takes care of our data. Using actions, we can
 * update our application state. To add a new action,
 * add it to the switch statement in the reducer function
 *
 */

import produce from 'immer';
import { CHANGE_OPERATION } from './constants';

// The initial state of the App
export const initialState = {
  operation: ''
};

/* eslint-disable default-case, no-param-reassign */
const operationReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case CHANGE_OPERATION:
        // change to the selected operation
        draft.operation = action.payload;
        break;
    }
  });

export default operationReducer;
