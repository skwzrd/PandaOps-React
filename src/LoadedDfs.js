import React, { Component } from "react";

export default class LoadedDfs extends Component{
  
  getValue = (e) => {
    this.props.fetchDf(e.target.innerHTML, "All");
  }


  getNames = (names) => {
    let content = [];
    if(!this.props.DataFramePresent()){
      return null;
    }
    for (let i = 0; i < names.length; i++) {
      const name = names[i];
      content.push(<li key={i} onClick={this.getValue}>{name}</li>);
    }
    return content;
  };


  render() {
    var names = this.getNames(this.props.names);
    var list = null;
    if(this.props.DataFramePresent()){
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