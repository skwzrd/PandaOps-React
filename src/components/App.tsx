import React, { Component } from 'react';

import '../styles/index.css';
import configs from '../configs.json';

import Selection from './Selection';
import DataFrame from './DataFrame';
import Operations from './Operations';
import LeftPanel from './LeftPanel';

import ReactHTMLParser from 'react-html-parser';
import BottomScrollListener from 'react-bottom-scroll-listener';

import IState from '../interfaces/state';
import ISetDf from '../interfaces/setDf';

interface IProps{}

export default class App extends Component<IProps, IState> {
  constructor(props: IProps){
    super(props);
    this.state = this.initialState;
  }

  get initialState(): IState {
    let _All: string = configs.All;
    return {
      name: "NA", // df name,
      df: "No df selected.", //        df.to_html() cmd != this.state.All
      df_cols: ["No df selected."], // df.to_json() cmd  = this.state.All
      df_rows: ["No df selected."], // df.to_json() cmd  = this.state.All
      cmd: _All, // this.state.All, Head, Tail, Stats - basically what kind of df should the server render in html
      fetched_rows: 0, // this.state.All's how many rows have been rendered
      count: 0, // used to avoid fetching the same df state more than once
      names: [], // names of loaded dfs
      length: null, // total rows
      dtypes: null, // column types
      duplicates: null,
      duplicates_count: null,
      duplicates_index: null,
      uniques: null, // unique value count per column (df[col].nunique())
      All: _All, // display the normal df - not Head, Tail, Stats, etc.
      scrollOffset: 100,
    };
  }

  componentDidMount() {
    if(configs.debug === true){
      this.fetchDf("sample", this.state.All);
    }
  }
  

  resetState = (): void => {
    this.setState(this.initialState);
    if(configs.debug === true){
      this.fetchDf("sample", this.state.All);
    }
  }


  isDataFramePresent = (): boolean => {
    if(this.state.name!==this.initialState.name){
      return true;
    }
    return false;
  }


  addName = (name: string): void => {
    if(this.state.names.includes(name) === false){
      this.setState({names: this.state.names.concat(name)});
    }
  }


  operator = (e: React.MouseEvent<HTMLButtonElement>): void => {
    // All is the default df display and so we will only ever have to
    // fetchRows() for it. On the otherhand, since we don't store
    // Stats, Head, or Tail we fetch these each time that it's appropriate.
    
    // @ts-ignore
    let cmd: string = e.target.innerHTML;

    if(cmd !== this.state.All){
      this.fetchDf(this.state.name, cmd);
    } else {
      this.setDf(this.state.name, this.state.All, {status: 1});
    }
  }

  

  setDf = (name: string, cmd: string, data: ISetDf): void => {
    if (data.status === 1) {
      let state: IState = null;
      if((cmd === this.state.All) && (name !== this.state.name)){
        var df_json = JSON.parse(data.df);
        state = {
          name: name,
          df_cols: df_json.columns,
          df_rows: df_json.data,
          cmd: cmd,
          count: this.state.count + 1,
          duplicates: data.duplicates,
          duplicates_count: data.duplicates_count,
          duplicates_index: data.duplicates_index,
          fetched_rows: data.fetched_rows,
          length: data.length,
          dtypes: data.dtypes,
          uniques: data.uniques,
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

  
  stateLoaded = (name: string, cmd: string): boolean => {
    if ((name === this.state.name) &&
        (cmd === this.state.cmd) &&
        (this.state.count !== 0))
    {
      return true;
    }
    return false;
  }


  fetchDf = (name: string, cmd: string): void => {
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


  fetchRows = (name: string, lower: number): void => {
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


  checkForFetchRows = (): void => {
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
            offset={this.state.scrollOffset}
            triggerOnNoScroll={false}
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
            dtypes={this.state.dtypes}
            uniques={this.state.uniques}
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

