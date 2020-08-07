import React, { Component } from 'react';

export default class DataFrame extends Component {

  // https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.to_json.html
  // we can't use df.to_html() if we want to append row chunks together
  // when we can, we will just render the html
  generateDf = (cols, rows) => {
    var header = [];
    var body = [];
    
    try {
      header.push(<th key={"h"}></th>);
      cols.forEach((col, i) => {
        header.push(<th key={i+"h"}>{col}</th>);
      });
      
      rows.forEach((row, i) => {
        let row_data = [<th key={-1*(i+1)}>{i}</th>];
        row.forEach((col, j) => {
          row_data.push(<td key={(i+1)*10*j}>{col}</td>);
        })
        body.push(<tr key={i}>{row_data}</tr>);
      })
      var table = <table>
        <thead>
          <tr>
            {header}
          </tr>
        </thead>
        <tbody>
          {body}
        </tbody>
      </table>;
      return table;
    } catch (error) {
      return [];
    }
  }

  render() {
    var table = null;
    if(this.props.cmd === this.props.All){
      table = this.generateDf(this.props.df_cols, this.props.df_rows);
    } else {
      table = this.props.df;
    }
    return (
      <div className="rendered_html">
        { table }
      </div>
    );
  }
}