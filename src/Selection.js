import React, { Component } from "react";
import LoadedDfs from './LoadedDfs'

export default class Selection extends Component {

  uploadFile = async (e) => {
    const file = e.target.files[0];
    if(this.props.names.includes(file.name)){
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
        this.props.setDf(res.name, this.props.All, res);
      }
    }
  };

  clearCache = () => {
    fetch('/clear_cache')
    .then(response => response.json())
    .then((data) => {
      if(data.status === 1){
        console.log("Cache cleared.");
        this.props.resetState();
      }
      else {
        alert("Problem clearing cache.");
      }
    })
  }

  render() {
    return (
      <div className="selection_width">
        <div className="dropdown alignleft">
          <button className="dropbtn button_warning">Add</button>

          <div className="dropdown-content">
              <form>
                  <input type="file" onChange={this.uploadFile}></input>
              </form>
              <button onClick={() => this.props.fetchDf("sample", this.props.All)}>Add Sample DF</button>
          </div>
        </div>
        <LoadedDfs 
          initial_name={this.props.names}
          names={this.props.names}
          fetchDf={this.props.fetchDf}
          isDataFramePresent={this.props.isDataFramePresent}
          All={this.props.All}
        />
        
        <button onClick={this.clearCache} className="button_error alignright">Clear</button>
        <br></br>
        <br></br>
      </div>
    );
  }
}