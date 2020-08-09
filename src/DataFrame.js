import React, { Component } from 'react';

export default class DataFrame extends Component {
  constructor(props){
    super(props);
    this.state = {
      showing: true,
    }
  }

  show_hide = () => {
    this.setState({ showing: !this.state.showing });
  }

  // https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.to_json.html
  // we can't use df.to_html() if we want to append row chunks together
  // when we can, we will just render the html
  generateDf = (cols, rows) => {
    var header = [];
    var body = [];
    
    try {
      // column names
      header.push(<th className="column_names" key={"th"}>columns</th>);
      cols.forEach((col, i) => {
        header.push(<th className="column_names" key={"th_"+String(i)}>{col}</th>);
      });

      if(this.state.showing){
        // dtypes
        if(this.props.dtypes){
          let dtypes = [<th key={"dtype"}>dtypes</th>];
          cols.map((col, i) => {
            dtypes.push(<td key={"dtype_"+String(i)}>{this.props.dtypes[col]}</td>);
            return null;
          });
          body.push(<tr className="column_info" key={"tr_dtype"}>{dtypes}</tr>);
        }
        
        // unique values per column
        if(this.props.uniques){
          let uniques = [<th key={"uq"}>unique values</th>];
          cols.map((col, i) => {
            uniques.push(<td key={"uq_"+String(i)}>{this.props.uniques[col]}</td>);
            return null;
          });
          body.push(<tr className="column_info" key={"tr_uq"}>{uniques}</tr>);
        }
      }

      // data
      rows.forEach((row, i) => {
        let row_data = [<th key={"i_"+String(i)}>{i}</th>];
        row.forEach((col, j) => {
          row_data.push(<td key={"row_"+String(j)}>{col}</td>);
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
      // alert("Error making table: " + error);
      return [];
    }
  }

  render() {
    var table = null;
    var show_hide = null;
    if(this.props.cmd === this.props.All){
      show_hide = <button className="button_blend" onClick={this.show_hide}>show/hide metrics</button>
      table = this.generateDf(this.props.df_cols, this.props.df_rows);
    } else {
      table = this.props.df;
    }
    return (
      <div className="rendered_html">
        {show_hide}
        {table}
      </div>
    );
  }
}