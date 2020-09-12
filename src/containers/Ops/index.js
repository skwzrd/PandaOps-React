// external imports
import React, { memo } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import PropTypes from 'prop-types';
import styled from 'styled-components';

// our imports
import { changeOperation } from './actions';
import { makeSelectOperation } from './selectors';

// styled components to be used in our component
const Wrapper = styled.div`
  display: flex;
  font-size: 18pt;
  margin: 10px;
`;

const Text = styled.div`
  background-color: papayawhip;
  color: rebeccapurple;
`;

const Button = styled.button`
  background-color: grey;
  color: pink;
  border: solid violet 2px;

  &:hover {
    background-color: black;
  }

  &:active {
    background-color: blueviolet;
  }
`;

// our functional component with decontructed props
export function Operations({
  operation,
  onChangeOperation
}) {
  return (
    <>
      <Wrapper>
        <Text>This is for testing our redux/reselect set up</Text>
      </Wrapper>
      <Wrapper>
        <Button onClick={onChangeOperation}>Operation Button</Button>
        <Text>Operation innerHTML: {operation}</Text>
      </Wrapper>
    </>
  );
}

// type checking our given props
Operations.propTypes = {
  operation: PropTypes.string.isRequired,
  onChangeOperation: PropTypes.func.isRequired
};

// get our state variables from with reselect
const mapStateToProps = createStructuredSelector({
  operation: makeSelectOperation()
});

// which actions we are going to be using in this component
export function mapDispatchToProps(dispatch) {
  return {
    onChangeOperation: evt => dispatch(changeOperation(evt.target.innerHTML)),
  };
}

// connects state attributes and actions to the redux store
const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

// becomes withConnect( memo( Operation() ) )
export default compose(
  withConnect,
  memo,
)(Operations);
