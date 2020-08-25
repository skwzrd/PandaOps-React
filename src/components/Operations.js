import React, { useState, useEffect } from 'react';


export default function Operations(props) {
  const [operations, setOperations] = useState(null);

  useEffect(() => {
    if(props.isDataFramePresent()){
      let _operations = <div id="operations">
        <button className="button_secondary" type="button" onClick={(e) => props.operator(e)}>{props.All}</button>
        <button className="button_secondary" type="button" onClick={(e) => props.operator(e)}>Head</button>
        <button className="button_secondary" type="button" onClick={(e) => props.operator(e)}>Tail</button>
        <button className="button_secondary" type="button" onClick={(e) => props.operator(e)}>Stats</button>
      </div>
      setOperations(_operations);
    }
  }, [props.name]);// eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
        {operations}
    </div>
    );
}
