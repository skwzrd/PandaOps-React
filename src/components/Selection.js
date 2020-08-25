import React, { useState, useEffect } from "react";
import LoadedDfs from './LoadedDfs';


export default function Selection(props) {

  const uploadFile = async (e_target) => {

    const file = e_target.files[0];
    if(props.names.includes(file.name)){
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
        props.changeDf(res.name, props.All, res);
      }
    }
  };

  const clearCache = () => {
    fetch('/clear_cache')
    .then(response => response.json())
    .then((data) => {
      if(data.status === 1){
        console.log("Cache cleared.");
        props.resetState();
      }
      else {
        alert("Problem clearing cache.");
      }
    })
  }

  const [loadedDfs, setLoadedDfs] = useState(null);
  useEffect(() => {
    
    let _loadedDfs = <LoadedDfs
      All={props.All}
      fetchDf={props.fetchDf}
      isDataFramePresent={props.isDataFramePresent}
      name={props.name}
      names={props.names}
    />
    setLoadedDfs(_loadedDfs);
    
  }, [props.names, props.name]);// eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="selection_width">
      <div className="dropdown alignleft">
        <button className="dropbtn button_warning">Add</button>

        <div className="dropdown-content">
            <form>
                <input type="file" onChange={(e) => uploadFile(e.target)} accept=".csv"></input>
            </form>
        </div>
      </div>
      {loadedDfs}      
      <button onClick={clearCache} id="clear" className="button_error alignright">Clear</button>
      <br></br>
      <br></br>
    </div>
  );
}