// external imports
import React, { memo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from '../../../node_modules/react-redux';
import { compose } from 'redux';

// our imports
import {
  fetchDf,
  isDataFramePresent,
} from '../App/actions';


function LoadedDfs({
  fetchDf,
  isDataFramePresent,

  All,
  name,
  names,
}) {

  const getNames = useCallback((names) => {
    let content = [];
    for (let i = 0; i < names.length; i++) {
      const _name = names[i];
      content.push(<li key={i} onClick={() => fetchDf(_name, All)}>{_name}</li>);
    }
    return content;
  }, [names]);// eslint-disable-line

  const content = () => {
    if(isDataFramePresent(name)){
      let loadedDfs = 
        <div className="dropdown">
          <div id="select_df_dropdown">
            <button id="select_df_button" className="dropbtn button_warning">Select ({names.length})</button>
          </div>
    
          <div className="dropdown-content">
            <ul>
              {getNames(names)}
            </ul>
          </div>
        </div>
      return loadedDfs;
    }
    return null;
  }

  return (
    <>
      {content()}
    </>
  );
}


// type checking our given props
LoadedDfs.propTypes = {
  fetchDf: PropTypes.func.isRequired,
  isDataFramePresent: PropTypes.func.isRequired,

  All: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  names: PropTypes.arrayOf(PropTypes.string).isRequired,
};

// get our state variables from with reselect
const mapStateToProps = state => ({
  All: state.GlobalState.All,
  name: state.GlobalState.name,
  names: state.GlobalState.names,
});

// which actions we are going to be using in this component
const mapDispatchToProps = {
  fetchDf,
  isDataFramePresent,
};

// connects state attributes and actions to the redux store
const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

// becomes withConnect( memo( LoadedDfs() ) )
export default compose(
  withConnect,
  memo,
)(LoadedDfs);
