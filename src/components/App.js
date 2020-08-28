import React, { useState, useEffect } from 'react';

import '../styles/index.css';
import configs from '../configs.json';

import Selection from './Selection';
import DataFrame from './DataFrame';
import LeftPanel from './LeftPanel';
import AddDf from './AddDf';

import ReactHTMLParser from 'react-html-parser';
import { useBottomScrollListener } from 'react-bottom-scroll-listener';


// State type examples
 
// All: "All"
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
// scrollOffset: 100
// uniques: {A: 6, B: 0, ...}

export default function App() {
  const [All, setAll] = useState(configs.All);
  const [cleared, setCleared] = useState(false);
  const [cmd, setCmd] = useState(configs.All);
  const [columns, setColumns] = useState(null);
  const [count, setCount] = useState(0);
  const [data, setData] = useState(null);
  const [df, setDf] = useState(null);
  const [dtypes, setDtypes] = useState(null);
  const [duplicates, setDuplicates] = useState(null);
  const [duplicates_count, setDuplicatesCount] = useState(null);
  const [duplicates_index, setDuplicatesIndex] = useState(null);
  const [fetched_rows, setFetchedRows] = useState(0);
  const [length, setLength] = useState(null);
  const [name, setName] = useState(null);
  const [names, setNames] = useState([]);
  const [uniques, setUniques] = useState(null);

  
  const initialState = () => {
    return {
      All: configs.All, // "All"
      cleared: false, // when to load initial state from clear button dependency
      cmd: configs.All, // type of table to render
      columns: null, // table columns from pandas' json method
      count: 0, // used to avoid fetching the same df state more than once
      data: null, // data from pandas' json method
      df: null, // table from pandas' html method
      dtypes: null, // dtype per column
      duplicates: null, // are there duplicates
      duplicates_count: null, // how many duplicate rows there are
      duplicates_index: null, // which rows are duplicates
      fetched_rows: 0, // how many rows have been fetched/rendered
      length: null, // total rows
      name: null, // table name
      names: [], // names of loaded dfs
      uniques: null, // unique value count per column
    };
  }
  
  useEffect(() => {
    if(configs.debug === true){
      fetchDf("sample", All);
      console.log('App debug mounted.');
    }
  }, [cleared]);// eslint-disable-line react-hooks/exhaustive-deps
  
  
  const resetState = () => {
    setAll(configs.All);
    setCmd(configs.All);
    setColumns(null);
    setCount(0);
    setData(null);
    setDf(null);
    setDtypes(null);
    setDuplicates(null);
    setDuplicatesCount(null);
    setDuplicatesIndex(null);
    setFetchedRows(configs.ROW_CHUNK);
    setLength(null);
    setName(null);
    setNames([]);
    // setScrollOffset(100);
    setUniques(null);
    setCleared(!cleared);
  }
  
  
  const isDataFramePresent = () => {
    if(name!==initialState.name){
      return true;
    }
    return false;
  }
  
  
  const addName = (_name) => {
    if(names.includes(_name) === false){
      setNames(names.concat(_name));
    }
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
      setCount(count + 1);
      setCmd(_cmd);
      addName(_name);
      setName(_name);
      
      if('df' in _data){
        if(_cmd===All && 'df'){
          setColumns(_data.df.columns);
          setData(_data.df.data);
          setDtypes(_data.dtypes);
          setDuplicates(_data.duplicates);
          setDuplicatesCount(_data.duplicates_count);
          setDuplicatesIndex(_data.duplicates_index);
          setFetchedRows(_data.fetched_rows);
          setLength(_data.length);
          setUniques(_data.uniques);
        } else {
          setDf(ReactHTMLParser(_data.df));
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

  const updateRows = (_data) => {
    setData(data.concat(_data.df.data));
    setFetchedRows(fetched_rows + _data.fetched_rows);
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
  

  const [df_component, setDfComponent] = useState(null);
  useEffect(() => {
    
    if(name !== null && columns!==null && dtypes!==null && uniques!==null){
      let _df_component = <DataFrame
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
        
        setDfComponent(_df_component);
      }
    }, [uniques, cmd, df, data, name, names, columns]);// eslint-disable-line react-hooks/exhaustive-deps
    
    
    const [left_panel_component, setLeftPanelComponent] = useState(null);
    const [selection_component, setSelectionComponent] = useState(null);
    
  useEffect(() => {
    let _left_panel_component = <LeftPanel
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
  
    let _selection_component = <Selection
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

    setLeftPanelComponent(_left_panel_component);
    setSelectionComponent(_selection_component);

  }, [df_component]);// eslint-disable-line react-hooks/exhaustive-deps


  useBottomScrollListener(checkForFetchRows);


  const content = () => {
    if(names.length === 0){
      let start_screen = 
      <>
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
        {left_panel_component}
        <div id="main_content">
          {selection_component}
          {df_component}
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

