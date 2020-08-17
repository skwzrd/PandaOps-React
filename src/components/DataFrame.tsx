import React, { Component } from 'react';
import IDict from '../interfaces/dict';

interface Props{
  cmd: string;
  dtypes: IDict;
  uniques: IDict;
  df: string;
  df_cols: string[];
  df_data: any[][];
  All: string;
}

interface State{
  showing: boolean;
}

export default class DataFrame extends Component<Props, State> {
  constructor(props){
    super(props);
    this.state = {
      showing: true,
    }
  }

  show_hide = (): void => {
    this.setState({ showing: !this.state.showing });
  }

  // https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.to_json.html
  // we can't use df.to_html() if we want to append row chunks together
  // when we can, we will just render the html
  generateDf = (cols: string[], rows: any[][]): JSX.Element | null => {
    var header: JSX.Element[] = [];
    var body: JSX.Element[] = [];
    
    try {
      // column names
      header.push(<th className="col_name" key={"th"}>columns</th>);
      cols.forEach((col, i) => {
        header.push(<th className="col_name" key={"th_"+String(i)}>{col}</th>);
      });

      if(this.state.showing){
        // dtypes
        if(this.props.dtypes){
          let dtypes: JSX.Element[] = [<th key={"dtype"}>dtypes</th>];
          cols.map((col, i) => {
            dtypes.push(<td key={"dtype_"+String(i)}>{this.props.dtypes[col]}</td>);
            return null;
          });
          body.push(<tr className="col_metric" key={"tr_dtype"}>{dtypes}</tr>);
        }
        
        // unique values per column
        if(this.props.uniques){
          let uniques: JSX.Element[] = [<th key={"uq"}>unique values</th>];
          cols.map((col, i) => {
            uniques.push(<td key={"uq_"+String(i)}>{this.props.uniques[col]}</td>);
            return null;
          });
          body.push(<tr className="col_metric" key={"tr_uq"}>{uniques}</tr>);
        }
      }

      // data
      rows.forEach((row, i) => {
        let row_data: JSX.Element[] = [<th key={"i_"+String(i)}>{i}</th>];
        row.forEach((col, j) => {
          row_data.push(<td key={"row_"+String(j)}>{col}</td>);
        })
        body.push(<tr key={i}>{row_data}</tr>);
      })
      var table: JSX.Element = <table>
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
      return null;
    }
  }

  render() {
    var table: null | JSX.Element | string = null;
    var show_hide: null | JSX.Element = null;
    if(this.props.cmd === this.props.All){
      show_hide = <button id="show_hide_metrics" className="button_blend" onClick={this.show_hide}>show/hide metrics</button>
      table = this.generateDf(this.props.df_cols, this.props.df_data);
    } else {
      table = this.props.df;
    }
    return (
      <div id="main_display" className="rendered_html">
        {show_hide}
        <div id="table">
          {table}
        </div>
      </div>
    );
  }
}