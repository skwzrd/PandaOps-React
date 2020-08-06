import React, { Component } from 'react';

class Operations extends Component {
  render() {

  var operations = null;
  if(this.props.DataFramePresent()){
    operations = <div id="operations">
      <button className="button_secondary" type="button" onClick={(e) => this.props.operator(e)}>All</button>
      <button className="button_secondary" type="button" onClick={(e) => this.props.operator(e)}>Head</button>
      <button className="button_secondary" type="button" onClick={(e) => this.props.operator(e)}>Tail</button>
      <button className="button_secondary" type="button" onClick={(e) => this.props.operator(e)}>Stats</button>
    </div>
  }

  return (
      <div>
          {operations}
      </div>
      );
  }
}

export default Operations;
