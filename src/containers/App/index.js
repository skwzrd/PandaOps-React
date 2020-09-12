// external imports
import React, { useEffect, memo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { useBottomScrollListener } from 'react-bottom-scroll-listener';
// import { createStructuredSelector } from 'reselect';
// import styled from 'styled-components';
// import { makeSelectName } from './selectors';

// our imports
import {
  changeCmd,
  changeName,
  consumeHtmlDf,
  consumeJsonDf,
  incrementCount,
  resetState,
  updateRows,
} from './actions';
import '../../styles/index.css';
import configs from '../../configs.json';

import Selection from '../Selection';
import DataFrame from '../DataFrame';
import LeftPanel from '../LeftPanel';
import AddDf from '../AddDf';
import Operations from '../Ops/index';

import { initialState } from './reducer';


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
  changeCmd,
  changeName,
  consumeHtmlDf,
  consumeJsonDf,
  incrementCount,
  resetState,
  updateRows,

  All,
  cleared,
  cmd,
  columns,
  count,
  data,
  df,
  dtypes,
  duplicates,
  duplicates_count,
  duplicates_index,
  fetched_rows,
  length,
  name,
  names,
  uniques
}) {
  
  useEffect(() => {
    if(configs.debug === true){
      fetchDf("sample", All);
      console.log('App debug mounted.');
    }
  }, [cleared]);// eslint-disable-line react-hooks/exhaustive-deps
  

  const isDataFramePresent = () => {
    if(name!==initialState.name){
      return true;
    }
    return false;
  }
  
  
  const operator = (e) => {
    // All is the default df display and so we will only ever have to
    // fetchRows() for it. On the otherhand, since we don't store
    // Stats, Head, or Tail we fetch these each time that it's appropriate.
    
    let cmd = e.target.innerHTML;
    
    if(cmd !== All){
      fetchDf(name, cmd);
    } else {
      changeDf(name, All, {status: 1});
    }
  }
  
  
  const changeDf = (_name, _cmd, _data) => {
    if (_data.status === 1) {
      changeName(_name);
      changeCmd(_cmd);
      incrementCount(1);

      if('df' in _data){
        if(_cmd===All){
          consumeJsonDf(_data);
        } else {
          consumeHtmlDf(_data);
        }
      }
    } else {
      console.error("Couldn't acquire dataframe: "+_name);
    }
  }
  
  
  const stateLoaded = (_name, _cmd) => {
    if ((name === _name) &&
    (cmd === _cmd) &&
    (count !== 0)){
      return true;
    }
    return false;
  }
  
  
  const fetchDf = (_name, _cmd) => {
    let d = null;
    if (stateLoaded(_name, _cmd) === false)
    {
      fetch(`/dataframe?name=${_name}&cmd=${_cmd}`)
      .then(res => res.json())
      .then((data) => {
        d = data;
        changeDf(_name, _cmd, d);
      })
      .catch((error) => {
        console.log(error);
      })
    }
    return d;
  }

  
  const fetchRows = (_name, lower) => {
    fetch(`/fetchRows?name=${_name}&lower=${lower}`)
    .then(response => response.json())
    .then((_data) => updateRows(_data))
    .catch((error) => {
      console.error('Error:', error);
    });
  }
    

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
        <AddDf
          All={All}
          changeDf={changeDf}
          names = {names}
          logo={"logo"}
        />
        <div className="block center pad_bottom">Click Me!</div>
      </>;
      return start_screen;
    }
    else{
      let work_screen = <>
        <LeftPanel
          All={All}
          cmd={cmd}
          duplicates={duplicates}
          duplicates_count={duplicates_count}
          duplicates_index={duplicates_index}
          fetched_rows={fetched_rows}
          length={length}
          name={name}
          names={names}
        />
        <div id="main_content">
          <Selection
            name={name}
            names={names}
            cmd={cmd}
            changeDf={changeDf}
            fetchDf={fetchDf}
            operator={operator}
            resetState={resetState}
            isDataFramePresent={isDataFramePresent}
            All={All}
          />
          <DataFrame
            All={All}
            changeDf={changeDf}
            columns={columns}
            cmd={cmd}
            data={data}
            df={df}
            dtypes={dtypes}
            name={name}
            uniques={uniques}
          />
        </div>
      </>;
      return work_screen;
    }
  }

  return (
    <div id="App">
      <Operations />
      {content()}
    </div>
  );
}

// type checking our given props
App.propTypes = {
  changeCmd: PropTypes.func.isRequired,
  changeName: PropTypes.func.isRequired,
  consumeHtmlDf: PropTypes.func.isRequired,
  consumeJsonDf: PropTypes.func.isRequired,
  incrementCount: PropTypes.func.isRequired,
  resetState: PropTypes.func.isRequired,
  updateRows: PropTypes.func.isRequired,

  All: PropTypes.string.isRequired,
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
  changeCmd,
  changeName,
  consumeHtmlDf,
  consumeJsonDf,
  incrementCount,
  resetState,
  updateRows
};

// connects state attributes and actions to the redux store
const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

// becomes withConnect( memo( Operation() ) )
export default compose(
  withConnect,
  memo,
)(App);
