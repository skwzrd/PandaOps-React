import React, { useState, useEffect } from 'react';
import ModalPlot from './ModalPlot';

// Props type examples

// All: "All"
// cmd: "Stats"
// columns: [ "A", "B", "C", … ]
// data: [ (7) [ 0, "2020-01-31", 9, … ], (7) […], (7) […], … ]
// dtypes: {A: "float64", B: "object", ...}
// name: "sample"
// uniques: {A: 6, B: 0, ...}
// x: "A"
// y: "B"

export default function DataFrame(props) {
  const [show_metrics, setShowMetrics] = useState(true);
  const [x, setX] = useState(null);
  const [y, setY] = useState(null);
  const [number_cols_x, setNumberColsX] = useState([]);
  const [number_cols_y, setNumberColsY] = useState([]);
  const [show_plot, setShowPlot] = useState(false);


  const initialClasses = () => {
    let class_names = props.columns.reduce((obj, col) => {
      obj['x'][col] = "button_blend";
      obj['y'][col] = "button_blend";
      return obj;
    }, {x: {}, y: {}});
    return class_names;
  }
  const [class_names, setClassNames] = useState(initialClasses());
  
  
    // update the button classes when selecting a different table
    useEffect(() => {
      setClassNames(initialClasses());
    }, [props.name]);


  const handleColumnSelection = (e) => {
    let cord = e.target.parentNode.attributes.id.value;
    let col = e.target.innerHTML;
    let new_classes = class_names;
    if(cord === "x"){
      new_classes['x'] = initialClasses()['x']
      new_classes['x'][col] = "button_success";
      setX(col);
    }
    if(cord === "y"){
      new_classes['y'] = initialClasses()['y']
      new_classes['y'][col] = "button_success";
      setY(col);
    }
    setClassNames(new_classes);
  }
  

  // create column selection buttons for plotting
  useEffect(() => {
    let count = 0;
    let xbtns = [];
    let ybtns = [];
    for(var col in props.dtypes){
      if(isPlottable(props.dtypes[col]))
      {
        let xbtn = <button key={"x"+count} className={class_names['x'][col]} onClick={handleColumnSelection}>{col}</button>;
        let ybtn = <button key={"y"+count} className={class_names['y'][col]} onClick={handleColumnSelection}>{col}</button>;
        xbtns.push(xbtn);
        ybtns.push(ybtn);
        count++;
      }
    }
    setNumberColsX(xbtns);
    setNumberColsY(ybtns);

  }, [x, y, class_names, props.dtypes]);


  // the main dataframe effect
  const [table, setTable] = useState(null);
  const [show_metrics_btn, setShowMetricsButton] = useState(null);
  const [modal_plot, setModalPlot] = useState(null);
  useEffect(() => {
    if(props.cmd === props.All){
      setShowMetricsButton(<button id="showMetrics_metrics" className="button_blend" onClick={() => setShowMetrics(!show_metrics)}>show/hide metrics</button>);
      setTable(generateDfTable(props.columns, props.data, props.dtypes, props.uniques, show_metrics));
      setModalPlot(
        <ModalPlot
          x={x}
          y={y}
          columns={props.columns}
          data={props.data}
        />
      );
    } else {
      setTable(props.df);
    }
    return () => {
      // cleanup show metric button cus we dont want it when cmd!=="All".
      setShowMetricsButton(null);
    };
  }, [props.df, y, x, props.columns, show_metrics, props.cmd, props.name, props.data, props.dtypes]);


  // dataframe component template
  const [component_body, setComponentBody] = useState(null);
  useEffect(() => {
    let plot_options = null;
    if(show_plot){
      plot_options = (
        <div>
          <div className="pad_top">
            <div id="x">X: {number_cols_x}</div>
            <br></br>
            <div id="y">Y: {number_cols_y}</div>
          </div>
          {modal_plot}
        </div>
      );
    }
    let component_body = (
      <div>
        <div id="main_display" className="rendered_html">
          <button className="button_feature" onClick={() => setShowPlot(!show_plot)}>Plot</button>
          {plot_options}{show_metrics_btn}
          <div id="table">
            {table}
          </div>
        </div>
      </div>
    );
    setComponentBody(component_body);
  }, [table, show_plot]);

  return (
    <div>
      {component_body}
    </div>
  );
}


function isPlottable(col){
  if(col.toString().includes('float') ||
      col.toString().includes('int')){
    return true;
  }
  return false;
}


// https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.to_json.html
// we can't use df.to_html() if we want to append row chunks together
// but when we can, we will just render the html
const generateDfTable = (cols, rows, dtypes, uniques, show_metrics) => {
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
