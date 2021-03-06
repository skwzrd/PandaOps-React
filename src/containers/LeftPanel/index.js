import React, { useState, useEffect, memo } from 'react';

// external imports
import PropTypes from 'prop-types';
import { connect } from '../../../node_modules/react-redux';
import { compose } from 'redux';

// our imports
import '../../styles/index.css';

// Prop type examples
 
// All: "All"
// cmd: "Stats"
// columns: [ "A", "B", "C", … ]
// count: 1
// data: [ (7) [ 0, "2020-01-31", 9, … ], (7) […], (7) […], … ]
// df: <table> element obtained with ReactHTMLParser
// duplicates: true
// duplicates_count: 2
// duplicates_index: [2, 3]
// fetched_rows: 4
// length: 2
// name: "sample"
// names: ["sample", "sample99.csv"]
// scrollOffset: 100
// uniques: {A: 6, B: 0, ...}

function LeftPanel({
  All,
  cmd,
  data,
  length,
  fetched_rows,
  table_rows_displayed,
  name,
  names,
  duplicates,
  duplicates_count,
  duplicates_index,
}) {
  const [info, setInfo] = useState([]);
  
    useEffect(() => {
      let _info = [];

      // length
      if(length !== null){
        let rows = []
        rows.push(<div>Rows: {length}</div>);
        let _table_rows_displayed = "NA";
        if(cmd === All){
          _table_rows_displayed = table_rows_displayed;
        }
        rows.push(<div>In Plot: {fetched_rows}</div>);
        rows.push(<div>In Table: {_table_rows_displayed}</div>);
        rows = rows.map((element, i) => React.cloneElement(element, { key: i }));
  
        _info.push(<div className="left_menu_section rows">{rows}</div>);
      }
      
      // duplicate rows
      if(duplicates){
        let dups = [];
        dups.push(<div>Duplicate Rows</div>);
        dups.push(<div className="indent">{"- Count: "+ String(duplicates_count)}</div>);
        dups.push(<div className="indent">{"- Index: "+ String(duplicates_index)}</div>);
        dups = dups.map((element, i) => React.cloneElement(element, { key: i }));
        
        _info.push(<div className="left_menu_section duplicates">{dups}</div>);
      }
      setInfo(_info.map((element, i) => React.cloneElement(element, { key: i })));
      
    }, [fetched_rows, name, names, duplicates, duplicates_count, duplicates_index, cmd, data, table_rows_displayed]);// eslint-disable-line
    
    return (
      <div id="menu_left">
        <div className="container">
            <div className="center med">{name}</div>
            <br></br>
            {info}
            <br></br>
        </div>
      </div>
    );
}

// type checking our given props
LeftPanel.propTypes = {
  All: PropTypes.string.isRequired,
  cmd: PropTypes.string.isRequired,
  duplicates: PropTypes.bool.isRequired,
  duplicates_count: PropTypes.number.isRequired,
  duplicates_index: PropTypes.arrayOf(PropTypes.number).isRequired,
  fetched_rows: PropTypes.number.isRequired,
  table_rows_displayed: PropTypes.number.isRequired,
  length: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  names: PropTypes.arrayOf(PropTypes.string).isRequired,
  uniques: PropTypes.object.isRequired
};

// get our state variables from with reselect
// const mapStateToProps = createStructuredSelector({
//   name: makeSelectName()
// });
const mapStateToProps = state => ({
  All: state.GlobalState.All,
  cmd: state.GlobalState.cmd,
  duplicates: state.GlobalState.duplicates,
  duplicates_count: state.GlobalState.duplicates_count,
  duplicates_index: state.GlobalState.duplicates_index,
  fetched_rows: state.GlobalState.fetched_rows,
  table_rows_displayed: state.GlobalState.table_rows_displayed,
  length: state.GlobalState.length,
  name: state.GlobalState.name,
  names: state.GlobalState.names,
  uniques: state.GlobalState.uniques
});

// which actions we are going to be using in this component
// None here! We only display stuff in the left panel
const mapDispatchToProps = {
};

// connects state attributes and actions to the redux store
const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

// becomes withConnect( memo( LeftPanel() ) )
export default compose(
  withConnect,
  memo,
)(LeftPanel);
