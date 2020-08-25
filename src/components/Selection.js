import React, { useState, useEffect } from "react";

import LoadedDfs from './LoadedDfs';
import Operations from './Operations';



export default function Selection(props) {

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

  const clearCache = () => {
    fetch('/clear_cache')
    .then(response => response.json())
    .then((data) => {
      if(data.status === 1){
        console.log("Cache cleared.");
        props.resetState();
      }
      else {
        alert("Problem clearing cache.");
      }
    })
  }

  const [loadedDfs, setLoadedDfs] = useState(null);
  const [operator_component, setOperatorComponent] = useState(null);
  useEffect(() => {
    
    let _loadedDfs = <LoadedDfs
      All={props.All}
      fetchDf={props.fetchDf}
      isDataFramePresent={props.isDataFramePresent}
      name={props.name}
      names={props.names}
    />
    
    let _operator_component = <Operations
      All={props.All}
      name={props.name}
      cmd={props.cmd}
      isDataFramePresent={props.isDataFramePresent}
      operator={props.operator}
    />
    setLoadedDfs(_loadedDfs);
    setOperatorComponent(_operator_component);

  }, [props.names, props.name, props.cmd]);// eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="selection_width">

      <label for="file_upload" class="custom-file-upload">
          <i></i>Add
      </label>
      <input id="file_upload" type="file" onChange={(e) => uploadFile(e.target)} accept=".csv"></input>

      <div className="inline pad_right">{loadedDfs}</div>

      <div className="inline pad_right">{operator_component}</div>
      
      <div className="inline">
        <button onClick={clearCache} id="clear" className="button_error">Clear</button>
      </div>
      
    </div>
  );
}