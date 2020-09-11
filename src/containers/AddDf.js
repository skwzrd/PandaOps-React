import React from "react";

import logo from '../images/logo.svg';

export default function AddDf(props) {

  const uploadFile = async (e_target) => {

    const file = e_target.files[0];
    if(props.names.includes(file.name)){
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
        props.changeDf(res.name, props.All, res);
      }
    }
  };

  const content = () => {
    let label = null;
    let position_css = null;
    if(props.logo !== undefined){
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
  // return <></>;
}
