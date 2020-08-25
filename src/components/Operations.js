import React, { useState, useEffect } from 'react';


export default function Operations(props) {
  const [operations, setOperations] = useState(null);

  useEffect(() => {
    if(props.isDataFramePresent()){
      let ops = [props.All, "Head", "Tail", "Stats"];
      let ops_css = ops.reduce((css_map, op) => {
        css_map[op] = "button_secondary";
        return css_map;
      }, {});
      ops_css[props.cmd] = "button_secondary_selected";
      let op_btns = ops.map(op => <button className={ops_css[op]} type="button" onClick={(e) => props.operator(e)}>{op}</button>);
      let _operations = <div id="operations">
        <br></br>
        {op_btns}
      </div>
      setOperations(_operations);
    }
  }, [props.name, props.cmd]);// eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
        {operations}
    </div>
    );
}
