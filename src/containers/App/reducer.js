/*
 * AppReducer
 *
 * The reducer takes care of our data. Using actions, we can
 * update our application state. To add a new action,
 * add it to the switch statement in the reducer function
 *
 */

// external imports
import produce from 'immer';
import ReactHTMLParser from 'react-html-parser';

// our imports
import {
  RESET_STATE,
  INCREMENT_COUNT,
  CONSUME_HTML_DF,
  CONSUME_JSON_DF,
  UPDATE_ROWS,
  SHOW_MORE_TABLE_ROWS,

  CHANGE_CMD,
  CHANGE_NAME,
  CHANGE_ALL_ROWS_LOADED,
} from './constants';
import configs from '../../configs.json';


// State type examples
 
// All: "All"
// cleared: false
// cmd: "Stats"
// columns: [ "A", "B", "C", … ]
// count: 1
// data: [ (7) [ 0, "2020-01-31", 9, … ], (7) […], (7) […], … ]
// df: <table> element obtained with ReactHTMLParser
// dtypes: {A: "float64", B: "object", ...}
// duplicates: true
// duplicates_count: 2
// duplicates_index: [2, 3]
// fetched_rows: 4
// length: 2
// name: "sample"
// names: ["sample", "sample99.csv"]
// uniques: {A: 6, B: 0, ...}


// The initial state of the App
export const initialState = {
  All: configs.All, // "All"
  all_rows_loaded: false,
  cleared: false, // when to load initial state from clear button dependency
  cmd: configs.All, // type of table to render
  columns: [], // table columns from pandas' json method
  count: 0, // used to avoid fetching the same df state more than once
  data: [], // data from pandas' json method
  df: [], // table from pandas' html method
  dtypes: {}, // dtype per column
  duplicates: false, // are there duplicates
  duplicates_count: -1, // how many duplicate rows there are
  duplicates_index: [], // which rows are duplicates
  fetched_rows: -1, // how many rows have been fetched/rendered
  length: -1, // total rows
  name: '', // table name
  names: [], // names of loaded dfs
  table_rows_displayed: configs.ROW_CHUNK,
  uniques: {}  // unique value count per column
};

/* eslint-disable default-case, no-param-reassign */
const appReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case RESET_STATE:
        return initialState;

      case INCREMENT_COUNT:
        draft.count = draft.count + action.value;
        break;
      
      case CHANGE_NAME:
        draft.name = action.name;
        draft.names = (draft.names.includes(action.name) === false) ? (draft.names.concat(action.name)) : draft.names;
        break;

      case CHANGE_ALL_ROWS_LOADED:
        draft.all_rows_loaded = action.all_rows_loaded;
        break;

      case CHANGE_CMD:
        draft.cmd = action.cmd;
        break;

      case CONSUME_JSON_DF:
        draft.columns = action.data.df.columns;
        draft.data = action.data.df.data;
        draft.dtypes = action.data.dtypes;
        draft.duplicates = action.data.duplicates;
        draft.duplicates_count = action.data.duplicates_count;
        draft.duplicates_index = action.data.duplicates_index;
        draft.fetched_rows = action.data.fetched_rows;
        draft.length = action.data.length;
        draft.uniques = action.data.uniques;
        break;

      case CONSUME_HTML_DF:
        draft.df = ReactHTMLParser(action.data.df);
        break;
      
      case UPDATE_ROWS:
        draft.data = draft.data.concat(action.data.df.data);
        draft.fetched_rows = draft.data.length;
        draft.table_rows_displayed = action.scrollFetch ? draft.data.length : state.table_rows_displayed;
        break;

      case SHOW_MORE_TABLE_ROWS:
        draft.table_rows_displayed += configs.ROW_CHUNK;
    }
  });

export default appReducer;
