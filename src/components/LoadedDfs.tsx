import React, { Component } from "react";

interface Props{
  names: string[];
  fetchDf: (name: string, cmd: string) => void;
  isDataFramePresent: () => boolean;
  All: string;
};

export default class LoadedDfs extends Component<Props>{
  
  getValue = (name: string): void => {
    this.props.fetchDf(name, this.props.All);
  }


  getNames = (names: string[]): null | JSX.Element[] => {
    let content: JSX.Element[] = [];
    if(!this.props.isDataFramePresent()){
      return null;
    }
    for (let i = 0; i < names.length; i++) {
      const name: string = names[i];
      content.push(<li key={i} onClick={() => this.getValue(name)}>{name}</li>);
    }
    return content;
  };

  render() {
    var names = this.getNames(this.props.names);
    var list: null | JSX.Element = null;
    if(this.props.isDataFramePresent()){
      list = <div className="dropdown alignleft">
        <div id="select_df_dropdown">
          <button id="select_df_button" className="dropbtn button_warning">Select ({names.length})</button>
        </div>

        <div className="dropdown-content">
          <ul>
            {names}
          </ul>
        </div>
      </div>
    }
    return (
      <div>
        {list}
      </div>
  );
  }
}
