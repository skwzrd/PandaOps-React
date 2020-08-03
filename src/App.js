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
  }


  get initialState() {
    return {
      name: "NA",
      df: "No df selected.",
      cmd: "All",
      count: 0, // avoids fetching the same df state more than once
      names: [],
      duplicates: "NA"
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


  fetchDfMetadata = (name) => {
    fetch(`/metadata?name=${name}`)
    .then(response => response.json())
    .then((data) =>
    {
      if (data.status === 1) {
        this.setState({
          duplicates: data.duplicates,
        });
      } else {
        alert("Couldn't acquire metadata for: "+name);
      }
    })
  }


  setDf = (name, df) => {
    this.setState({
      name: name,
      df: ReactHtmlParser(df),
      cmd: "All",
      count: 0,
      names: this.state.names.concat(name.toString())
    })
    this.addName(name);
    this.fetchDfMetadata(name);
    console.log("Df set.");
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
        if (data.status === 1) {
          this.setState({
            name: name,
            df: ReactHtmlParser(data.df),
            cmd: cmd,
            count: this.state.count + 1,
          });
        } else {
          alert("Couldn't acquire dataframe: "+name);
        }
      })
      this.addName(name);
      this.fetchDfMetadata(name);
    }
    console.log("Df fetched.");
  }


  render() {
    
    return (
      <div id="main_content">
        <LeftPanel
          name={this.state.name}
          duplicates={this.state.duplicates}
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

