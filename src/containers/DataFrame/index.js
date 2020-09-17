// external imports
import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { connect } from '../../../node_modules/react-redux';
import { compose } from 'redux';

// our imports
import {
  setShowMetrics,
} from './actions';
import { changeDf } from '../App/actions';
import '../../styles/index.css';
import { generateDfTable } from '../utils'

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
  All,
  columns,
  cmd,
  data,
  df,
  dtypes,
  table_rows_displayed,
  uniques,

  setShowMetrics,

  show_metrics,
  show_metrics_btn,
  
}) {

  const getDfTable = () => {
    if(cmd === All){
      return generateDfTable(columns, data.slice(0, table_rows_displayed), dtypes, uniques, show_metrics);
    }
    return df;
  }
  
  return (
    <>
      <div className="pad_top">
        {show_metrics_btn ? <button id="show_metrics" className="button_blend" onClick={() => setShowMetrics(!show_metrics)}>show/hide metrics</button> : null}
      </div>
      <div id="table">
        {getDfTable()}
      </div>
    </>
  );
}


// type checking our given props
DataFrame.propTypes = {
  setShowMetrics: PropTypes.func.isRequired,

  All: PropTypes.string.isRequired,
  cmd: PropTypes.string.isRequired,
  columns: PropTypes.arrayOf(PropTypes.string).isRequired,
  data: PropTypes.arrayOf(PropTypes.any).isRequired,
  df: PropTypes.arrayOf(PropTypes.object).isRequired,
  dtypes: PropTypes.object.isRequired,
  table_rows_displayed: PropTypes.number.isRequired,
  uniques: PropTypes.object.isRequired,

  show_metrics: PropTypes.bool.isRequired,
  show_metrics_btn: PropTypes.bool.isRequired,
};

// get our state variables from with reselect
// const mapStateToProps = createStructuredSelector({
//   name: makeSelectName()
// });
const mapStateToProps = state => ({
  All: state.GlobalState.All,
  cmd: state.GlobalState.cmd,
  columns: state.GlobalState.columns,
  data: state.GlobalState.data,
  df: state.GlobalState.df,
  dtypes: state.GlobalState.dtypes,
  table_rows_displayed: state.GlobalState.table_rows_displayed,
  uniques: state.GlobalState.uniques,
  
  show_metrics: state.DataFrameState.show_metrics,
  show_metrics_btn: state.DataFrameState.show_metrics_btn,
});

// which actions we are going to be using in this component
const mapDispatchToProps = {
  changeDf,

  setShowMetrics,
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
