/*
 * App Actions
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
  SHOW_MORE_TABLE_ROWS,

  CHANGE_CMD,
  CHANGE_NAME,
  CHANGE_ALL_ROWS_LOADED,
} from './constants';
import configs from '../../configs.json';
import { initialState } from './reducer';
import { setShowMetricsBtn } from '../DataFrame/actions';

export const resetState = () => ({
  type: RESET_STATE
})

export const changeName = (name) => ({
  type: CHANGE_NAME,
  name
})

export const changeAllRowsLoaded = (all_rows_loaded) => ({
  type: CHANGE_ALL_ROWS_LOADED,
  all_rows_loaded
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

export const updateRows = (data, scrollFetch) => ({
  type: UPDATE_ROWS,
  data,
  scrollFetch,
})

export const showMoreTableRows = () => ({
  type: SHOW_MORE_TABLE_ROWS
})

export const changeDf = (name, cmd, data) => dispatch => {
  if (data.status === 1) {
    dispatch(changeName(name));
    dispatch(changeCmd(cmd));
    dispatch(incrementCount(1));

    if('df' in data){
      if(cmd === configs.All){
        dispatch(consumeJsonDf(data));
      } else {
        dispatch(consumeHtmlDf(data));
      }
    }
  } else {
    console.error("Couldn't acquire dataframe: "+name);
  }
}

// below functions aren't exactly an action creator
// just somewhere to access the state
// and also be accessible in other components
export const stateLoaded = (_name, _cmd) => (dispatch, getState) => {
  const {name, cmd, count} = getState().GlobalState;
  if ((name === _name) &&
    (cmd === _cmd) &&
    (count !== 0))
  {
    return true;
  }
  return false;
}

export const isDataFramePresent = (name) => (dispatch) => {
  if(name!==initialState.name){
    return true;
  }
  return false;
}

export const fetchDf = (name, cmd) => dispatch => {
  let d = null;
  if (dispatch(stateLoaded(name, cmd)) === false)
  {
    fetch(`/dataframe?name=${name}&cmd=${cmd}`)
    .then(res => res.json())
    .then((data) => {
      d = data;
      dispatch(changeDf(name, cmd, d));
    })
    .catch((error) => {
      console.log(error);
    })
  }
  return d;
}

export const fetchRows = (name, lower, all=false, scrollFetch=false) => (dispatch) => {  
  return fetch(`/fetchRows?name=${name}&lower=${lower}&all=${all}`)
  .then(response => response.json())
  .then((data) => dispatch(updateRows(data, scrollFetch)))
  .catch((error) => {
    console.error('Error:', error);
  });
}



export const operator = (e) => (dispatch, getState) => {
  // All is the default df display and so we will only ever have to
  // fetchRows() for it. On the otherhand, since we don't store
  // Stats, Head, or Tail we fetch these each time that it's appropriate.
  
  let cmd = e.target.innerHTML;
  const {name, All} = getState().GlobalState;
  
  if(cmd !== All){
    dispatch(fetchDf(name, cmd));
    dispatch(setShowMetricsBtn(false));
  } else {
    dispatch(changeDf(name, All, {status: 1}));
    dispatch(setShowMetricsBtn(true));
  }
}
