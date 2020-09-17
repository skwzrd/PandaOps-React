// external imports
import React, { memo, useCallback, useEffect, useState } from 'react';
import { compose } from 'redux';
import { connect } from '../../../node_modules/react-redux';
import PropTypes from 'prop-types';
import styled from '../../../node_modules/styled-components';
import  { Scatter } from 'react-chartjs-2';
import  { isPlottable } from '../utils';
import { changeDf, fetchRows } from '../App/actions';
import {
  setXColumn,
  setYColumn,
  setShowPlot,
} from './actions';

import ClipLoader from "react-spinners/ClipLoader";
import { trackPromise, usePromiseTracker } from 'react-promise-tracker';

// styled components to be used in our component
const PlotWrapper = styled.div`
  background-color: rgb(201, 201, 201);
  border-radius: 5px;
  max-width: 500px;
  min-width: 500px;
  float: left;
`;

// Props type examples

// data: [ (7) [ 0, "2020-01-31", 9, … ], (7) […], (7) […], … ]
// columns: [ "A", "B", "C", … ]
// x_column: "A"
// y_column: "B"

// our functional component with deconstructed props
function Plot({
  changeDf,
  fetchRows,
  
  All,
  all_rows_loaded,
  columns,
  dtypes,
  name,
  fetched_rows,
  
  setXColumn,
  setYColumn,
  setShowPlot,

  data,
  show_plot,
  x_column,
  y_column,

}) {
  
  // returns an array of sorted {x: , y: } coord objects
  const getDataFromProps = useCallback(() => {
    let x_index = columns.indexOf(x_column);
    let y_index = columns.indexOf(y_column);
    let cords = [];
    
    for (let index = 0; index < data.length; index++) {
      const row = data[index];
      cords.push({x: row[x_index], y: row[y_index]});
    }
    
    // sort the values so any given curve drawn on the scatter plot
    // only ever intercepts a vertical line once. Ie. not like the
    // scatter plot at https://jerairrest.github.io/react-chartjs-2/
    // which goes in all directions on the x axis
    // sortable: [[x, y], [x,y], ...]
    var sortable = [];
    cords.forEach(item => {
      sortable.push([item['x'], item['y']]);
    });
    
    sortable.sort(function(a, b) {
      return a[0] - b[0];
    });
    
    var coordsSorted = [];
    sortable.forEach(function(item){
      coordsSorted.push({x: item[0], y: item[1]});
    });
    
    return coordsSorted;
  }, [columns, data, x_column, y_column]);
  
  const createPlot = useCallback(() => {
    const data = {
      labels: ['Scatter X / Y'],
      datasets: [
        {
          label: 'x: ' + x_column + ' y: ' + y_column,
          fill: false,
          showLine: true,
          lineTension: 0.1,
          backgroundColor: 'rgba(75,192,192,1)',
          borderColor: 'rgba(75,192,192,1)',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: 'rgba(75,192,192,1)',
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: 'rgba(75,192,192,1)',
          pointHoverBorderColor: 'rgba(220,220,220,1)',
          pointHoverBorderWidth: 2,
          pointRadius: 3.6,
          pointHitRadius: 10,
          data: getDataFromProps(),
        }
      ],
    };
    const options = {
      scales: {
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: y_column
          }
        }],
        xAxes: [{
          scaleLabel: {
            display: true,
            labelString: x_column
          }
        }],
      },
      maintainAspectRatio: true,
    };
    
    const plot = <Scatter
      data={data}
      width={null}
      height={null}
      options={options}
    />
    
    return plot;
  }, [columns, x_column, y_column, data]);// eslint-disable-line


  const handleColumnSelection = useCallback((e) => {
    let coord = e.target.parentNode.attributes.id.value;
    let col = e.target.innerHTML;
    if(coord === "x"){
      setXColumn(col);
    }
    if(coord === "y"){
      setYColumn(col);
    }
  }, [columns, x_column, y_column]);// eslint-disable-line


  const createColBtn = (col, coord, i, classNames) => {
    return <button key={`${coord}${i}`} className={classNames} onClick={(e) => handleColumnSelection(e)}>{col}</button>;
  }

  // CSS class logic for our x and y column selectors to plot
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
  }, [columns, y_column, x_column]);// eslint-disable-line


  const showPlot = () => {
    setShowPlot(!show_plot);
  }

  const { promiseInProgress } = usePromiseTracker({delay: 500});
  const getLoadingMessages = () => {
    let message = null;
    if(all_rows_loaded === false){
      let is_not_loading =  <>
        <div>Not plotting all data!</div>
        <button className="button_error block center pad-t-b" onClick={() => trackPromise(fetchRows(name, fetched_rows, true))}>Load all data</button>
      </>;

      let is_loading = <>
        <div>Fetching data ...</div>
        <div className="pad-t-b"><ClipLoader color={"#e67a1c"}/></div>
      </>;

      message =
      <div className="block center">
        {(promiseInProgress === true) ? is_loading : is_not_loading}
      </div>
    }
    return message;
  }
  

  let plot = null;
  if(colBtns!==null){
    let cols_y = Object.keys(colBtns.y).map(col => <div id="y" key={col}>{colBtns.y[col]}</div>);
    if(show_plot){
      plot =
        <div className="container wrapper">
          { getLoadingMessages() }
          <div className="grid_display">
            <div>
              {cols_y} 
            </div>
            <PlotWrapper>
              { createPlot() }
            </PlotWrapper>
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
    <>
      <button className="button_feature" onClick={() => showPlot()}>Plot</button>
      {plot}
    </>
  );
}

// type checking our given props
Plot.propTypes = {
  changeDf: PropTypes.func.isRequired,
  fetchRows: PropTypes.func.isRequired,

  setXColumn: PropTypes.func.isRequired,
  setYColumn: PropTypes.func.isRequired,
  setShowPlot: PropTypes.func.isRequired,

  All: PropTypes.string.isRequired,
  fetched_rows: PropTypes.number.isRequired,
  columns: PropTypes.arrayOf(PropTypes.string).isRequired,
  data: PropTypes.array.isRequired,
  dtypes: PropTypes.object.isRequired,
  x_column: PropTypes.string.isRequired,
  y_column: PropTypes.string.isRequired,

  show_plot: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
};


// get our state variables from with reselect
// const mapStateToProps = createStructuredSelector({
//   name: makeSelectName()
// });
const mapStateToProps = state => ({
  All: state.GlobalState.All,
  columns: state.GlobalState.columns,
  data: state.GlobalState.data,
  dtypes: state.GlobalState.dtypes,
  fetched_rows: state.GlobalState.fetched_rows,
  name: state.GlobalState.name,
  all_rows_loaded: state.GlobalState.all_rows_loaded,

  show_plot: state.PlotState.show_plot,
  x_column: state.PlotState.x_column,
  y_column: state.PlotState.y_column,

});

// which actions we are going to be using in this component
const mapDispatchToProps = {
  changeDf,
  fetchRows,
  setXColumn,
  setYColumn,
  setShowPlot,
};

// connects state attributes and actions to the redux store
const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

// becomes withConnect( memo( Plot() ) )
export default compose(
  withConnect,
  memo,
)(Plot);

