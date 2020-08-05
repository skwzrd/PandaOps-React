import React, { Component } from 'react';
import Selection from './Selection'
import DataFrame from './DataFrame';
import Operations from './Operations';
import LeftPanel from './LeftPanel';
import './css/home.css'
import ReactHtmlParser from 'react-html-parser'; 

export default class App extends Component {
  constructor(props){
    super(props);
    this.state = this.initialState;
    let debug = true;// manually set while developing
    if(debug === true){
      this.fetchDf("sample", "All");
    }
  }


  get initialState() {
    return {
      name: "NA",
      df: "No df selected.",
      cmd: "All",
      count: 0, // avoids fetching the same df state more than once
      names: [],
      length: null,
      dtypes: null,
      duplicates_bool: null,
      duplicates_count: null,
      duplicates_index: null,
      unique_per_column: null,
    };
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


  Operator = (e) => {
    this.fetchDf(this.state.name, e.target.innerHTML);
  }


  setDf = (name, cmd, data) => {
    // this.setState({
    //   name: name,
    //   df: ReactHtmlParser(df),
    //   cmd: "All",
    //   count: 0,
    //   names: this.state.names.concat(name.toString())
    // })
    if (data.status === 1) {
      var state = null;
      state = {
        name: name,
        df: ReactHtmlParser(data.df),
        cmd: cmd,
        count: this.state.count + 1,
      }
      // we get some extra metrics when cmd === all
      if(cmd==="All"){
        state.duplicates_bool = data.duplicates_bool;
        state.duplicates_count = data.duplicates_count;
        state.duplicates_index = data.duplicates_index;
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

  
  dfLoaded = (name) => {
    if (name === this.state.name && this.state.names.includes(name)){
      return true;
    }
    return false;
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


  render() {
    
    return (
      <div id="main_content">
        <LeftPanel
          state={this.state}
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
          Operator={this.Operator}
        />

        <DataFrame
          df={this.state.df}
        />
        
      </div>
    );
  }
}

