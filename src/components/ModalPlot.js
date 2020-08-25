import React, { useState, useEffect } from 'react';

import  { Scatter } from 'react-chartjs-2';

// Props type examples

// columns: [ "A", "B", "C", … ]
// data: [ (7) [ 0, "2020-01-31", 9, … ], (7) […], (7) […], … ]
// x: "A"
// y: "B"

export default function ModalPlot(props) {
  const [plot, setPlot] = useState(null);
  
  const getDataFromProps = () => {
    let x_index = props.columns.indexOf(props.x);
    let y_index = props.columns.indexOf(props.y);
    let cords = [];
    
    for (let index = 0; index < props.data.length; index++) {
      const row = props.data[index];
      cords.push({x: row[x_index], y: row[y_index]});
    }
    
    // sort the values so the line drawn on the scatter plot
    // only ever intercepts a vertical line one. Ie. not like the
    // scatter plot at https://jerairrest.github.io/react-chartjs-2/
    // sortable: [[x, y], [x,y], ...]
    var sortable = [];
    cords.forEach(item => {
      sortable.push([item['x'], item['y']]);
    });
    
    sortable.sort(function(a, b) {
      return a[0] - b[0];
    });
    
    var cordsSorted = [];
    sortable.forEach(function(item){
      cordsSorted.push({x: item[0], y: item[1]});
    });
    
    return cordsSorted;
  }
  
  const createPlot = () => {
    const data = {
      labels: ['Scatter X / Y'],
      datasets: [
        {
          label: 'x: ' + props.x + ' y: ' + props.y,
          fill: false,
          showLine: true,
          lineTension: 0.1,
          backgroundColor: 'rgba(75,192,192,1)',
          borderColor: 'rgba(75,192,192,1)',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: 'rgba(75,192,192,1)',
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: 'rgba(75,192,192,1)',
          pointHoverBorderColor: 'rgba(220,220,220,1)',
          pointHoverBorderWidth: 2,
          pointRadius: 3.6,
          pointHitRadius: 10,
          data: getDataFromProps(),
        }
      ],
    };
    const options = {
      scales: {
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: props.y
          }
        }],
        xAxes: [{
          scaleLabel: {
            display: true,
            labelString: props.x
          }
        }],
      },
      maintainAspectRatio: true,
    };
    
    let _plot = <Scatter
    data={data}
    width={null}
    height={null}
    options={options}
    />
    
    setPlot(_plot);
  };
  
  useEffect(() => {
    createPlot();
  }, [props.x, props.y, props.columns]);// eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div id="plot">
      {plot}
    </div>
  );
}
  