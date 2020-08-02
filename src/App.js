import React, { Component } from 'react';
import Selection from './Selection'
import './css/home.css'
import ReactHtmlParser from 'react-html-parser'; 

export default class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      name: "sample",
      df: "No df selected.",
      cmd: "All",
      count: 0, // avoids fetching the same df state more than once
      names: ["sample"],
    };
  }

  addName(name) {
    if(this.state.names.includes(name) === false){
      this.setState({names: this.state.names.concat(name)});
    }
  }

  componentDidMount() {
    this.fetchDf(this.state.name, this.state.cmd);
  }


  Operator = (cmd) => {
    this.fetchDf(this.state.name, cmd.target.innerHTML);
  }


  setDf = (newName, newDf) => {
    this.setState({
      name: newName,
      df: ReactHtmlParser(newDf),
      cmd: "All",
      count: 0,
      names: this.state.names.concat(newName.toString())
    })
    this.addName(newName);
  }


  stateLoaded(name, cmd){
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
          alert("Couldn't acquire dataframe");
        }
      })
      this.addName(name);
    }
  }

  render() {
    return (
      <div>
        <Selection
          name={this.state.name}
          names={this.state.names}
          setDf={this.setDf}
          fetchDf={this.fetchDf}
        />

        <h3>
          { this.state.name }
        </h3>
        
        <div id="operations">
          <button className="button_secondary" type="button" onClick={this.Operator}>All</button>
          <button className="button_secondary" type="button" onClick={this.Operator}>Head</button>
          <button className="button_secondary" type="button" onClick={this.Operator}>Tail</button>
          <button className="button_secondary" type="button" onClick={this.Operator}>Stats</button>
        </div>

        <div className="rendered_html">
          { this.state.df }
        </div>
      </div>
    );
  }
}

