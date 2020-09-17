// external imports
import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { connect } from '../../../node_modules/react-redux';
import { compose } from 'redux';

// our imports
import {
  isDataFramePresent,
  operator,
} from '../App/actions';

function Operations({
  isDataFramePresent,
  operator,

  All,
  cmd,
}) {

  if(isDataFramePresent()){
    // our buttons list
    let ops = [All, "Head", "Tail", "Stats"];
    let ops_css = ops.reduce((css_map, op) => {
      css_map[op] = "button_secondary";
      return css_map;
    }, {});

    // our selected button
    ops_css[cmd] = "button_secondary_selected";
    let op_btns = ops.map((op, i) => <button key={i} className={ops_css[op]} type="button" onClick={(e) => operator(e)}>{op}</button>);

    let _operations = <div id="operations">
      <br></br>
      {op_btns}
    </div>

    return _operations;
  }

  return null;
}


// type checking our given props
Operations.propTypes = {
  isDataFramePresent: PropTypes.func.isRequired,
  operator: PropTypes.func.isRequired,

  All: PropTypes.string.isRequired,
  cmd: PropTypes.string.isRequired,
};

// get our state variables from with reselect
// const mapStateToProps = createStructuredSelector({
//   name: makeSelectName()
// });
const mapStateToProps = state => ({
  All: state.globalState.All,
  cmd: state.globalState.cmd,
});

// which actions we are going to be using in this component
const mapDispatchToProps = {
  isDataFramePresent,
  operator,
};

// connects state attributes and actions to the redux store
const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

// becomes withConnect( memo( Operations() ) )
export default compose(
  withConnect,
  memo,
)(Operations);
