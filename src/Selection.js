import React, { Component } from "react";
import LoadedDfs from './LoadedDfs'

export default class Selection extends Component {

  uploadFile = async (e) => {
    const file = e.target.files[0];
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
        this.props.setDf(res.name, res.df);
      }
    }
  };

  render() {
    return (
      <div>
        <div className="dropdown alignleft">
          <button className="dropbtn button_warning">Add</button>

          <div className="dropdown-content">
              <form>
                  <input
                    type="file"
                    onChange={this.uploadFile}>
                  </input>
              </form>
              <button onClick={() => this.props.fetchDf("sample", "All")}>Add Sample DF</button>
          </div>
        </div>

        <LoadedDfs 
          names={this.props.names}
          fetchDf={this.props.fetchDf}
        />
        
        <button id="clear_df_cache" className="button_error alignright">Clear</button>
        <br></br>
        <br></br>
      </div>
    );
  }
}