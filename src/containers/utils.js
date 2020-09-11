import React from 'react';

export const isPlottable = (col) => {
  if(col.toString().includes('float') ||
    col.toString().includes('int')){
    return true;
  }
  return false;
}


// https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.to_json.html
// we can't use df.to_html() if we want to append row chunks together
// but when we can, we will just render the html
export const generateDfTable = (cols, rows, dtypes, uniques, show_metrics) => {
  var header = [];
  var body = [];

  // column names
  header.push(<th className="col_name" key={"th"}>columns</th>);
  cols.forEach((col, i) => {
      header.push(<th className="col_name" key={"th_"+String(i)}>{col}</th>);
  });

  if(show_metrics){
    // dtypes
    let _dtypes = [<th key={"dtype"}>dtypes</th>];
    cols.map((col, i) => {
      _dtypes.push(<td key={"dtype_"+String(i)}>{dtypes[col]}</td>);
      return null;
    });
    body.push(<tr className="col_metric" key={"tr_dtype"}>{_dtypes}</tr>);
    
    // unique values per column
    let _uniques = [<th key={"uq"}>unique values</th>];
    cols.map((col, i) => {
      _uniques.push(<td key={"uq_"+String(i)}>{uniques[col]}</td>);
      return null;
    });
    body.push(<tr className="col_metric" key={"tr_uq"}>{_uniques}</tr>);
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
}
