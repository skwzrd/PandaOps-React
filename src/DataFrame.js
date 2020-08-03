import React, { Component } from 'react';

export default class DataFrame extends Component {
  render() {
    return (
      <div className="rendered_html">
        { this.props.df }
      </div>
    );
  }
}