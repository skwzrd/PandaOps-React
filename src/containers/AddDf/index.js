// external imports
import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
// import styled from 'styled-components';

// our imports
import logo from '../../images/logo.svg';
import { changeDf } from '../App/actions';

function AddDf({
  changeDf,

  All,
  names,
}) {

  const uploadFile = async (e_target) => {

    const file = e_target.files[0];
    if(names.includes(file.name)){
      alert("File already uploaded: " + file.name);
      return;
    }

    if (file != null) {
      const data = new FormData();
      data.append('file_from_react', file);

      let response = await fetch('/upload_csv',
        {
          method: 'post',
          body: data,
        }
      );

      let res = await response.json();
      if (res.status !== 1){
        alert('Error uploading file');
      } else {
        console.log("File uploaded.");
        changeDf(res.name, All, res);
      }
    }
  };

  const content = () => {
    let label = null;
    let position_css = null;
    if(names.length === 0){
      label =
        <label htmlFor="file_upload" className="pad_top pad_bottom logo_margin">
          {<img src={logo} id="logo" width="300" alt="logo" />}
        </label>
    }
    else {
      label =
        <label htmlFor="file_upload" className={"add_button"}>
          <i></i>Add
        </label>
      position_css = "inline";
    }
    return (
      <div className={position_css}>
        {label}
        <input id="file_upload" type="file" onChange={(e) => uploadFile(e.target)} accept=".csv"></input>
      </div>
    );
  }

  return <>{content()}</>;
}


// type checking our given props
AddDf.propTypes = {
  changeDf: PropTypes.func.isRequired,

  All: PropTypes.string.isRequired,
  names: PropTypes.arrayOf(PropTypes.string).isRequired,
};

// get our state variables from with reselect
// const mapStateToProps = createStructuredSelector({
//   name: makeSelectName()
// });
const mapStateToProps = state => ({
  All: state.globalState.All,
  names: state.globalState.names,
});

// which actions we are going to be using in this component
const mapDispatchToProps = {
  changeDf,
};

// connects state attributes and actions to the redux store
const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

// becomes withConnect( memo( AddDf() ) )
export default compose(
  withConnect,
  memo,
)(AddDf);
