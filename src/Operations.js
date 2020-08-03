import React, { Component } from 'react';

class Operations extends Component {
  render() {

  var operations = null;
  if(this.props.DataFramePresent()){
    operations = <div id="operations">
      <button className="button_secondary" type="button" onClick={(e) => this.props.Operator(e)}>All</button>
      <button className="button_secondary" type="button" onClick={(e) => this.props.Operator(e)}>Head</button>
      <button className="button_secondary" type="button" onClick={(e) => this.props.Operator(e)}>Tail</button>
      <button className="button_secondary" type="button" onClick={(e) => this.props.Operator(e)}>Stats</button>
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
