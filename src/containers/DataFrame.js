import React, { useState, useEffect } from 'react';
import ModalPlot from './Plot/index';
import {isPlottable, generateDfTable} from './utils'

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
  }, [props.name, props.names, props.columns]);// eslint-disable-line react-hooks/exhaustive-deps


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
  }, [x, y, class_names, props.dtypes, props.name]);// eslint-disable-line react-hooks/exhaustive-deps


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
  }, [show_metrics, y, x, props.df, props.columns, props.cmd, props.name, props.data, props.dtypes]);// eslint-disable-line react-hooks/exhaustive-deps

  const createPlot = () => {
    props.changeDf(props.name, props.All, {status: 1});
    setShowPlot(!show_plot);
    setClassNames(initialClasses());
    setX(null);
    setY(null);
  }

  // dataframe component template
  const [component_body, setComponentBody] = useState(null);
  useEffect(() => {
    let plot = null;
    let cols_y = number_cols_y.map(col_y => <div id="y" key={col_y}>{col_y}</div>);
    if(show_plot){
      plot = (
        <div className="container wrapper">
            <div className="grid_display">
              <div>
                {cols_y}
              </div>
              <div className="alignleft">
                {modal_plot}
              </div>
            </div>
          <div className="center pad_top"><div id="x">{number_cols_x}</div></div>
        </div>
      );
    }
    
    let component_body = (
      <div id="main_display" className="rendered_html pad_top">
        <button className="button_feature" onClick={() => createPlot()}>Plot</button>
        {plot}
        <div className="pad_top">
          {show_metrics_btn}
        </div>
        <div id="table">
          {table}
        </div>
      </div>
    );
    setComponentBody(component_body);
  }, [table, show_plot]);// eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      {component_body}
    </div>
  );
}
