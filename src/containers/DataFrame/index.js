// external imports
import React, { useEffect, useState, useCallback, memo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import styled from 'styled-components';

// our imports
import {
  setShowPlot,
  setShowMetrics,
  setXAxisButtons,
  setYAxisButtons,
  setXColumn,
  setYColumn,
} from './actions';
import { changeDf } from '../App/actions';
import '../../styles/index.css';
import Plot from '../Plot/index';
import { isPlottable, generateDfTable } from '../utils'

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

function DataFrame({
  changeDf,

  All,
  columns,
  cmd,
  data,
  df,
  dtypes,
  name,
  uniques,

  setShowPlot,
  setShowMetrics,
  setXColumn,
  setYColumn,

  show_metrics,
  show_metrics_btn,
  show_plot,
  x_column,
  y_column,
}) {
  
  const handleColumnSelection = useCallback((e) => {
    let coord = e.target.parentNode.attributes.id.value;
    let col = e.target.innerHTML;
    if(coord === "x"){
      setXColumn(col);
    }
    if(coord === "y"){
      setYColumn(col);
    }
  }, [columns, x_column, y_column]);// eslint-disable-line react-hooks/exhaustive-deps


  const createColBtn = (col, coord, i, classNames) => {
    return <button key={`${coord}${i}`} className={classNames} onClick={(e) => handleColumnSelection(e)}>{col}</button>;
  }

  const [colBtns, setColBtns] = useState(null);
  useEffect(() => {
    const _colBtns = {x: {}, y: {}};
    columns.forEach((col, i) => {
      if(isPlottable(dtypes[col])){
        let default_class = "button_blend";
        let selected_class = "button_success";

        let x_class = (col === x_column) ? selected_class : default_class;
        let y_class = (col === y_column) ? selected_class : default_class;

        _colBtns.x[col] = createColBtn(col, "x", i, x_class);
        _colBtns.y[col] = createColBtn(col, "y", i, y_class);
      }
    });
    setColBtns(_colBtns);
  }, [columns, y_column, x_column]);// eslint-disable-line react-hooks/exhaustive-deps


  const createPlot = () => {
    changeDf(name, All, {status: 1});
    setShowPlot(!show_plot);
  }


  const getDfTable = () => {
    if(cmd === All){
      return generateDfTable(columns, data, dtypes, uniques, show_metrics);
    }
    return df;
  }
  

  let plot = null;
  let cols_y = null;
  if(colBtns!==null){
    cols_y = Object.keys(colBtns.y).map(col => <div id="y" key={col}>{colBtns.y[col]}</div>);
    if(show_plot){
      plot =
        <div className="container wrapper">
            <div className="grid_display">
              <div>
                {cols_y} 
              </div>
              <div className="alignleft">
                <Plot/>
              </div>
            </div>
          <div className="center pad_top">
            <div id="x">
              {Object.keys(colBtns.x).map(col => colBtns.x[col])}
            </div>
          </div>
        </div>
    }
  }
  
  return (
    <div id="main_display" className="rendered_html pad_top">
      <button className="button_feature" onClick={() => createPlot()}>Plot</button>
      {plot}
      <div className="pad_top">
        {show_metrics_btn ? <button id="show_metrics" className="button_blend" onClick={() => setShowMetrics(!show_metrics)}>show/hide metrics</button> : null}
      </div>
      <div id="table">
        {getDfTable()}
      </div>
    </div>
  );
}


// type checking our given props
DataFrame.propTypes = {
  changeDf: PropTypes.func.isRequired,

  setShowPlot: PropTypes.func.isRequired,
  setShowMetrics: PropTypes.func.isRequired,
  setXAxisButtons: PropTypes.func.isRequired,
  setYAxisButtons: PropTypes.func.isRequired,
  setXColumn: PropTypes.func.isRequired,
  setYColumn: PropTypes.func.isRequired,

  All: PropTypes.string.isRequired,
  cmd: PropTypes.string.isRequired,
  columns: PropTypes.arrayOf(PropTypes.string).isRequired,
  data: PropTypes.arrayOf(PropTypes.any).isRequired,
  df: PropTypes.arrayOf(PropTypes.object).isRequired,
  dtypes: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  names: PropTypes.arrayOf(PropTypes.string).isRequired,
  uniques: PropTypes.object.isRequired,

  show_plot: PropTypes.bool.isRequired,
  show_metrics: PropTypes.bool.isRequired,
  show_metrics_btn: PropTypes.bool.isRequired,
  x_column: PropTypes.string.isRequired,
  y_column: PropTypes.string.isRequired,
};

// get our state variables from with reselect
// const mapStateToProps = createStructuredSelector({
//   name: makeSelectName()
// });
const mapStateToProps = state => ({
  All: state.globalState.All,
  cmd: state.globalState.cmd,
  columns: state.globalState.columns,
  data: state.globalState.data,
  df: state.globalState.df,
  dtypes: state.globalState.dtypes,
  name: state.globalState.name,
  names: state.globalState.names,
  uniques: state.globalState.uniques,

  show_plot: state.DataFrameState.show_plot,
  show_metrics: state.DataFrameState.show_metrics,
  show_metrics_btn: state.DataFrameState.show_metrics_btn,
  x_column: state.DataFrameState.x_column,
  y_column: state.DataFrameState.y_column,
});

// which actions we are going to be using in this component
const mapDispatchToProps = {
  changeDf,

  setShowPlot,
  setShowMetrics,
  setXAxisButtons,
  setYAxisButtons,
  setXColumn,
  setYColumn,
};

// connects state attributes and actions to the redux store
const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

// becomes withConnect( memo( DataFrame() ) )
export default compose(
  withConnect,
  memo,
)(DataFrame);
