import React, { Component } from 'react';

class LeftPanel extends Component {
  render() {
    var info = [];
    
    // length
    if(this.props.state.length !== null){
      let rows = []
      rows.push(<div>Rows: {this.props.state.length}</div>);
      let displayed = "NA";
      if(this.props.state.cmd === this.props.state.All){
        displayed = this.props.state.fetched_rows;
      }
      rows.push(<div>Displayed: {displayed}</div>);
      rows = rows.map((element, i) => React.cloneElement(element, { key: i }));


      info.push(<div className="left_menu_section rows">{rows}</div>);
    }

    // dtypes
    if(this.props.state.dtypes !== null){
      let dtypes = []
      dtypes.push(<div>Dtypes</div>);
      dtypes.push(<div>
        {Object.entries(this.props.state.dtypes).map(x=>x.join(": ")).join("\n")}
        </div>);
      dtypes = dtypes.map((element, i) => React.cloneElement(element, { key: i }));
      
      info.push(<div className="left_menu_section dtypes">{dtypes}</div>);
    }
    
    // duplicate rows
    if(this.props.state.duplicates_bool){
      let dups = [];
      dups.push(<div>Duplicate Rows</div>);
      dups.push(<div className="indent">{"- Count: "+ String(this.props.state.duplicates_count)}</div>);
      dups.push(<div className="indent">{"- Index: "+ String(this.props.state.duplicates_index)}</div>);
      dups = dups.map((element, i) => React.cloneElement(element, { key: i }));
      
      info.push(<div className="left_menu_section duplicates">{dups}</div>);
    }
    
    // unique values in per column
    if(this.props.state.unique_per_column !== null){
      let unique = []
      unique.push(<div>Unique Values</div>);
      unique.push(<div>
        {Object.entries(this.props.state.unique_per_column).map(x=>x.join(": ")).join("\n")}
        </div>);
      unique = unique.map((element, i) => React.cloneElement(element, { key: i }));
      info.push(<div className="left_menu_section unique_per_column">{unique}</div>);
    }
    
    info = info.map((element, i) => React.cloneElement(element, { key: i }));
    
    return (
      <div id="menu_left">
        <div id="menu_left_content">
            <div className="center med">{this.props.state.name}</div>
            <br></br>
            {info}
            <br></br>
        </div>
      </div>
    );
}
}

export default LeftPanel;
