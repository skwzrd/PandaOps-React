import React, { Component } from 'react';

interface Props{
  isDataFramePresent: () => boolean;
  operator: (e: React.MouseEvent<HTMLButtonElement>) => void;
  All: string;
}

class Operations extends Component<Props> {
  render() {

  var operations = null;
  if(this.props.isDataFramePresent()){
    operations = <div id="operations">
      <button className="button_secondary" type="button" onClick={(e) => this.props.operator(e)}>{this.props.All}</button>
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
