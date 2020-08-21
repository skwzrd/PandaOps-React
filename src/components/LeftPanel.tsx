import React, { useState, useEffect } from 'react';

// Prop type examples
 
// All: "All"
// cmd: "Stats"
// columns: [ "A", "B", "C", … ]
// count: 1
// data: [ (7) [ 0, "2020-01-31", 9, … ], (7) […], (7) […], … ]
// df: <table> element obtained with ReactHTMLParser
// dtypes: {A: "float64", B: "object", ...}
// duplicates: true
// duplicates_count: 2
// duplicates_index: [2, 3]
// fetched_rows: 4
// length: 2
// name: "sample"
// names: ["sample", "sample99.csv"]
// scrollOffset: 100
// uniques: {A: 6, B: 0, ...}

export default function LeftPanel(props) {
  const [info, setInfo] = useState([]);
  
    useEffect(() => {
      let _info = [];

      // length
      if(props.length !== null){
        let rows = []
        rows.push(<div>Rows: {props.length}</div>);
        let displayed = "NA";
        if(props.cmd === props.All){
          displayed = props.fetched_rows;
        }
        rows.push(<div>Displayed: {displayed}</div>);
        rows = rows.map((element, i) => React.cloneElement(element, { key: i }));
  
        _info.push(<div className="left_menu_section rows">{rows}</div>);
      }
      
      // duplicate rows
      if(props.duplicates){
        let dups = [];
        dups.push(<div>Duplicate Rows</div>);
        dups.push(<div className="indent">{"- Count: "+ String(props.duplicates_count)}</div>);
        dups.push(<div className="indent">{"- Index: "+ String(props.duplicates_index)}</div>);
        dups = dups.map((element, i) => React.cloneElement(element, { key: i }));
        
        _info.push(<div className="left_menu_section duplicates">{dups}</div>);
      }
      setInfo(_info.map((element, i) => React.cloneElement(element, { key: i })));

    }, [props.fetched_rows, props.name, props.duplicates, props.duplicates_count, props.duplicates_index, props.cmd]);
    
    return (
      <div id="menu_left">
        <div id="menu_left_content">
            <div className="center med">{props.name}</div>
            <br></br>
            {info}
            <br></br>
        </div>
      </div>
    );
}
