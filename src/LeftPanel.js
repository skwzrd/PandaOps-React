import React, { Component } from 'react';

class LeftPanel extends Component {
  render() {
    return (
      <div id="menu_left">
        <div id="menu_left_content">
            <div className="center med">{this.props.name}</div>
            <br></br>
            Duplicates: {this.props.duplicates}
        </div>
      </div>
    );
}
}

export default LeftPanel;
