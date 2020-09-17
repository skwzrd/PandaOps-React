// external imports
import React, { useEffect, memo } from 'react';
import PropTypes from 'prop-types';
import { connect } from '../../../node_modules/react-redux';
import { compose } from 'redux';
import { useBottomScrollListener } from 'react-bottom-scroll-listener';

// our imports
import {
  changeAllRowsLoaded,
  fetchDf,
  fetchRows,
} from './actions';
import '../../styles/index.css';
import configs from '../../configs.json';

import SelectionPanel from '../SelectionPanel';
import DataFrame from '../DataFrame/index';
import LeftPanel from '../LeftPanel/index';
import AddDf from '../AddDf/index';
import Plot from '../Plot/index';

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


function App({
  changeAllRowsLoaded,
  fetchDf,
  fetchRows,

  All,
  cleared,
  cmd,
  fetched_rows,
  length,
  name,
  names,
}) {
  
  useEffect(() => {
    if(configs.debug === true){
      fetchDf("sample", All);
      console.log('App debug mounted.');
    }
  }, [cleared]);// eslint-disable-line

  useEffect(() => {
    fetched_rows === length ? changeAllRowsLoaded(true) : changeAllRowsLoaded(false);
  }, [fetched_rows, length]);// eslint-disable-line

  
  const checkForFetchRows = () => {
    if((fetched_rows < length) && cmd === All){
      fetchRows(name, fetched_rows);
    }
  }

  
  useBottomScrollListener(checkForFetchRows);


  const content = () => {
    // shows us how many renders we get
    console.log("MAKING CONTENT")
    
    if(names.length === 0){
      let start_screen = <>
        <div className="block center">Start by adding a CSV.</div>
        <AddDf logo={"logo"} />
        <div className="block center pad_bottom">Click Me!</div>
      </>;
      return start_screen;
    }
    else{
      let work_screen = <>
        <LeftPanel/>
        <div id="main_content">
          <SelectionPanel/>
          <div id="main_display" className="rendered_html pad_top">
            <Plot/>
            <DataFrame/>
          </div>
        </div>
      </>;
      return work_screen;
    }
  }

  return (
    <div id="App">
      {content()}
    </div>
  );
}

// type checking our given props
App.propTypes = {
  changeAllRowsLoaded: PropTypes.func.isRequired,
  fetchDf: PropTypes.func.isRequired,
  fetchRows: PropTypes.func.isRequired,

  All: PropTypes.string.isRequired,
  all_rows_loaded: PropTypes.bool.isRequired,
  cleared: PropTypes.bool.isRequired,
  cmd: PropTypes.string.isRequired,
  columns: PropTypes.arrayOf(PropTypes.string).isRequired,
  count: PropTypes.number.isRequired,
  data: PropTypes.arrayOf(PropTypes.any).isRequired,
  df: PropTypes.arrayOf(PropTypes.object).isRequired,
  dtypes: PropTypes.object.isRequired,
  duplicates: PropTypes.bool.isRequired,
  duplicates_count: PropTypes.number.isRequired,
  duplicates_index: PropTypes.arrayOf(PropTypes.number).isRequired,
  fetched_rows: PropTypes.number.isRequired,
  length: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  names: PropTypes.arrayOf(PropTypes.string).isRequired,
  uniques: PropTypes.object.isRequired
};

// get our state variables from with reselect
// const mapStateToProps = createStructuredSelector({
//   name: makeSelectName()
// });
const mapStateToProps = state => ({
  All: state.globalState.All,
  all_rows_loaded: state.globalState.all_rows_loaded,
  cleared: state.globalState.cleared,
  cmd: state.globalState.cmd,
  columns: state.globalState.columns,
  count: state.globalState.count,
  data: state.globalState.data,
  df: state.globalState.df,
  dtypes: state.globalState.dtypes,
  duplicates: state.globalState.duplicates,
  duplicates_count: state.globalState.duplicates_count,
  duplicates_index: state.globalState.duplicates_index,
  fetched_rows: state.globalState.fetched_rows,
  length: state.globalState.length,
  name: state.globalState.name,
  names: state.globalState.names,
  uniques: state.globalState.uniques
});

// which actions we are going to be using in this component
const mapDispatchToProps = {
  changeAllRowsLoaded,
  fetchDf,
  fetchRows,
};

// connects state attributes and actions to the redux store
const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

// becomes withConnect( memo( App() ) )
export default compose(
  withConnect,
  memo,
)(App);
