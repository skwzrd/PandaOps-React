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
    
    // duplicate rows
    if(this.props.state.duplicates_bool){
      let dups = [];
      dups.push(<div>Duplicate Rows</div>);
      dups.push(<div className="indent">{"- Count: "+ String(this.props.state.duplicates_count)}</div>);
      dups.push(<div className="indent">{"- Index: "+ String(this.props.state.duplicates_index)}</div>);
      dups = dups.map((element, i) => React.cloneElement(element, { key: i }));
      
      info.push(<div className="left_menu_section duplicates">{dups}</div>);
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
