import React, { Component } from "react";
import LoadedDfs from './LoadedDfs';
import IsetDfObject from '../interfaces/setDf';
import ISetDf from "../interfaces/setDf";

interface Props{
  name: string;
  names: string[];
  setDf: (name: string, cmd: string, data: IsetDfObject) => void;
  fetchDf: (name: string, cmd: string) => void;
  resetState: () => void;
  isDataFramePresent: () => boolean;
  All: string;
};

export default class Selection extends Component<Props> {

  uploadFile = async (e_target: EventTarget) => {

    // @ts-ignore
    const file: File = e_target.files[0];
    if(this.props.names.includes(file.name)){
      alert("File already uploaded: " + file.name);
      return;
    }
    if (file != null) {
      const data: FormData = new FormData();
      data.append('file_from_react', file);

      let response: Response = await fetch('/upload_csv',
        {
          method: 'post',
          body: data,
        }
      );

      let res: ISetDf = await response.json();
      if (res.status !== 1){
        alert('Error uploading file');
      } else {
        console.log("File uploaded.");
        this.props.setDf(res.name, this.props.All, res);
      }
    }
  };

  clearCache = (): void => {
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
                  <input type="file" onChange={(e) => this.uploadFile(e.target)} accept=".csv"></input>
              </form>
              <button id="button_sample_df" onClick={() => this.props.fetchDf("sample", this.props.All)}>Add Sample DF</button>
          </div>
        </div>

        <LoadedDfs
          names={this.props.names}
          fetchDf={this.props.fetchDf}
          isDataFramePresent={this.props.isDataFramePresent}
          All={this.props.All}
        />
        
        <button onClick={this.clearCache} id="clear" className="button_error alignright">Clear</button>
        <br></br>
        <br></br>
      </div>
    );
  }
}