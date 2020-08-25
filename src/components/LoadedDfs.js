import React, { useState, useEffect } from "react";


export default function LoadedDfs(props) {
  
  const getValue = (name) => {
    props.fetchDf(name, props.All);
  }


  const getNames = (names) => {
    let content = [];
    if(!props.isDataFramePresent()){
      return null;
    }
    for (let i = 0; i < names.length; i++) {
      const name = names[i];
      content.push(<li key={i} onClick={() => getValue(name)}>{name}</li>);
    }
    return content;
  };

  const [dfs, setDfs] = useState(null);
  useEffect(() => {
    var names = getNames(props.names);
    if(props.isDataFramePresent()){
      let _dfs = (<div className="dropdown alignleft">
        <div id="select_df_dropdown">
          <button id="select_df_button" className="dropbtn button_warning">Select ({names.length})</button>
        </div>
  
        <div className="dropdown-content">
          <ul>
            {names}
          </ul>
        </div>
      </div>);
      setDfs(_dfs);
    }
  }, [props.names, props.name]);// eslint-disable-line react-hooks/exhaustive-deps


  return (
    <div>
      {dfs}
    </div>
  );
}
