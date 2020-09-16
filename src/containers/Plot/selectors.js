/**
 * Plot selectors
 */

import { createSelector } from 'reselect';
import { initialState } from './reducer';

// take only what's important from our app's state
// reselect memoizes our selected state attributes
// this helps us avoid recalculating things and limits renders

// selectors that act on state
const selectGlobalState = state => state || initialState;

// why create makeSelectOperation?
// it's so that we don't run into memoization errors
// if we decide to use prop arguments and have multiple instances
// of the component that uses this selector
// read more here:
// https://medium.com/@pearlmcphee/selectors-react-redux-reselect-9ab984688dd4
const makeSelectData = () =>
  createSelector(
    selectGlobalState,
    globalState => globalState.data,
  );

export { selectGlobalState, makeSelectData };
