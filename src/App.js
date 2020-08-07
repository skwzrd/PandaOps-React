import React, { Component } from 'react';

import './css/home.css';
import configs from './configs.json';
import shared_props from './shared_props.json';

import Selection from './Selection';
import DataFrame from './DataFrame';
import Operations from './Operations';
import LeftPanel from './LeftPanel';

import ReactHTMLParser from 'react-html-parser';
import BottomScrollListener from 'react-bottom-scroll-listener';


export default class App extends Component {
  constructor(props){
    super(props);
    this.state = this.initialState;
  }

  get initialState() {
    let _All = shared_props.All;
    return {
      name: "NA", // df name,
      df: ["No df selected."], // df.to_html() cmd!=this.state.All
      df_cols: ["No df selected."], // df.to_json() cmd=this.state.All
      df_rows: ["No df selected."], // df.to_json() cmd=this.state.All
      cmd: _All, // this.state.All, Head, Tail, Stats - basically what kind of df should the server render in html
      fetched_rows: 0, // this.state.All's how many rows have been rendered
      count: 0, // used to avoid fetching the same df state more than once
      names: [], // names of loaded dfs
      length: null, // total rows
      dtypes: null, // column types
      duplicates_bool: null,
      duplicates_count: null,
      duplicates_index: null,
      unique_per_column: null,
      All: _All, // all as in 'displays all unprocessed/manipulated df rows'
    };
  }


  componentDidMount() {
    if(configs.debug === true){
      this.fetchDf("sample", this.state.All);
    }
  }
  

  resetState = () => {
    this.setState(this.initialState);
  }


  isDataFramePresent = () => {
    if(this.state.name!==this.initialState.name){
      return true;
    }
    return false;
  }


  addName = (name) => {
    if(this.state.names.includes(name) === false){
      this.setState({names: this.state.names.concat(name)});
    }
  }


  operator = (e) => {
    // All is the default df display and so we will only ever have to
    // fetchRows() for it. On the otherhand, since we don't store
    // Stats, Head, or Tail we fetch these each time that it's appropriate.

    // e.target.innerHTML is our cmd
    if(e.target.innerHTML !== this.state.All){
      this.fetchDf(this.state.name, e.target.innerHTML);
    } else {
      this.setDf(this.state.name, this.state.All, {status: 1});
    }
  }


  setDf = (name, cmd, data) => {
    if (data.status === 1) {
      var state = null;
      if((cmd === this.state.All) && (name !== this.state.name)){
        var df_json = JSON.parse(data.df);
        state = {
          name: name,
          df_cols: df_json.columns,
          df_rows: df_json.data,
          cmd: cmd,
          count: this.state.count + 1,
          duplicates_bool: data.duplicates_bool,
          duplicates_count: data.duplicates_count,
          duplicates_index: data.duplicates_index,
          fetched_rows: data.fetched_rows,
          length: data.length,
          dtypes: data.dtypes,
          unique_per_column: data.unique_per_column,
        }
      } else {
        state = {
          name: name,
          df: ReactHTMLParser(data.df),
          cmd: cmd,
          count: this.state.count + 1,
        }
      }

      if(state !== null) {
        this.setState(state);
        this.addName(name);
      }

    } else {
      alert("Couldn't acquire dataframe: "+name);
    }
  }

  
  stateLoaded = (name, cmd) => {
    if ((name === this.state.name) &&
        (cmd === this.state.cmd) &&
        (this.state.count !== 0))
    {
      return true;
    }
    return false;
  }


  fetchDf = (name, cmd) => {
    if (this.stateLoaded(name, cmd) === false)
    {
      fetch(`/dataframe?name=${name}&cmd=${cmd}`)
      .then(response => response.json())
      .then((data) =>
      {
        this.setDf(name, cmd, data);
      })
    }
    console.log("Df fetched.");
  }


  fetchRows = (name, lower) => {
    fetch(`/fetchRows?name=${name}&lower=${lower}`)
    .then(response => response.json())
    .then((data) =>
    {
      var df_json = JSON.parse(data.df);
      this.setState({
        df_rows: this.state.df_rows.concat(df_json.data),
        fetched_rows: this.state.fetched_rows + data.fetched_rows,
      });
    })
  }


  checkForFetchRows = () => {
    if((this.state.fetched_rows < this.state.length) && this.state.cmd === this.state.All){
        this.fetchRows(this.state.name, this.state.fetched_rows);
      }
  }


  render() {
    
    return (
      <div>
        <LeftPanel
          state={this.state}
        />
        <div id="main_content">
          <BottomScrollListener
            onBottom={this.checkForFetchRows}
            offset="100"
          />

          <Selection
            name={this.state.name}
            names={this.state.names}
            setDf={this.setDf}
            fetchDf={this.fetchDf}
            resetState={this.resetState}
            isDataFramePresent={this.isDataFramePresent}
            All={this.state.All}
          />
          
          <Operations
            isDataFramePresent={this.isDataFramePresent}
            operator={this.operator}
            All={this.state.All}
          />

          <DataFrame
            cmd={this.state.cmd}
            df={this.state.df}
            df_cols={this.state.df_cols}
            df_rows={this.state.df_rows}
            All={this.state.All}
          />
        </div>
      </div>
    );
  }
}

