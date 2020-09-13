// external imports
import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import styled from 'styled-components';

// our imports
import {
  resetState
} from '../App/actions';
import '../../styles/index.css';

import LoadedDfs from '../LoadedDfs/index';
import Operations from '../Operations/index';
import AddDf from '../AddDf/index';

const Item = styled.div`
  display: inline-block;
  padding-right: 32px;
`;

const Container = styled.div`
  max-width: 600px;
`;

function Selection({
  resetState
}) {

  const clearCache = () => {
    fetch('/clear_cache')
    .then(response => response.json())
    .then((data) => {
      if(data.status === 1){
        console.log("Cache cleared.");
        resetState();
      }
      else {
        alert("Problem clearing cache.");
      }
    })
  }

  return (
    <Container>
      <Item>
        <AddDf/>
      </Item>

      <Item>
        <LoadedDfs/>
      </Item>

      <Item>
        <Operations/>
      </Item>

      <Item>
        <button onClick={clearCache} id="clear" className="button_error">Clear</button>
      </Item>
    </Container>
  );
}


// type checking our given props
Selection.propTypes = {
  resetState: PropTypes.func.isRequired
};

const mapStateToProps = null;

// which actions we are going to be using in this component
const mapDispatchToProps = {
  resetState
};

// connects state attributes and actions to the redux store
const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

// becomes withConnect( memo( Selection() ) )
export default compose(
  withConnect,
  memo,
)(Selection);
