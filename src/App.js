import React, { Component } from 'react';

import './css/home.css';
import configs from './configs.json';

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
    return {
      name: "NA", // df name,
      df: ["No df selected."], // df.to_html()
      df_cols: ["No df selected."], // df.to_json()
      df_rows: ["No df selected."], // df.to_json()
      cmd: "All", // All, Head, Tail, Stats - basically what kind of df should the server render in html
      fetched_rows: 0, // how many rows have been rendered
      count: 0, // avoids fetching the same df state more than once
      names: [], // names of loaded dfs
      length: null, // total rows
      dtypes: null, // column types
      duplicates_bool: null,
      duplicates_count: null,
      duplicates_index: null,
      unique_per_column: null,
    };
  }


  componentDidMount() {
    if(configs.debug === true){
      this.fetchDf("sample", "All");
    }
  }
  

  resetState = () => {
    this.setState(this.initialState);
  }


  DataFramePresent = () => {
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
    this.fetchDf(this.state.name, e.target.innerHTML);
  }


  setDf = (name, cmd, data) => {
    if (data.status === 1) {
      var state = null;
      if(cmd === "All"){
        var df_json = JSON.parse(data.df);
        state = {
          name: name,
          df_cols: df_json.columns,
          df_rows: df_json.data,
          cmd: cmd,
          count: this.state.count + 1,
          fetched_rows: 0,
        }
      } else {
        state = {
          name: name,
          df: ReactHTMLParser(data.df),
          cmd: cmd,
          count: this.state.count + 1,
          fetched_rows: 0,
        }
      }
      // we get some extra metrics when cmd === all
      if(cmd==="All"){
        state.duplicates_bool = data.duplicates_bool;
        state.duplicates_count = data.duplicates_count;
        state.duplicates_index = data.duplicates_index;
        state.fetched_rows = data.fetched_rows;
        state.length = data.length;
        state.dtypes = data.dtypes;
        state.unique_per_column = data.unique_per_column;
      }
      this.setState(state);
      this.addName(name);
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
    if((this.state.fetched_rows < this.state.length) && this.state.cmd === "All"){
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
            DataFramePresent={this.DataFramePresent}
          />
          
          <Operations
            DataFramePresent={this.DataFramePresent}
            operator={this.operator}
          />

          <DataFrame
            cmd={this.state.cmd}
            df={this.state.df}
            df_cols={this.state.df_cols}
            df_rows={this.state.df_rows}
          />
        </div>
      </div>
    );
  }
}

