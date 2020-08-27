import React, { useState, useEffect } from "react";

import LoadedDfs from './LoadedDfs';
import Operations from './Operations';
import AddDf from './AddDf';


export default function Selection(props) {

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

      {<AddDf
        All={props.All}
        changeDf={props.changeDf}
        names = {props.names}
      />}

      <div className="inline pad_right">{loadedDfs}</div>

      <div className="inline pad_right">{operator_component}</div>
      
      <div className="inline">
        <button onClick={clearCache} id="clear" className="button_error">Clear</button>
      </div>
      
    </div>
  );
}