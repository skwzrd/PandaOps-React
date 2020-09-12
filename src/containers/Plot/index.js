// external imports
import React, { memo, useCallback } from 'react';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import  { Scatter } from 'react-chartjs-2';


// styled components to be used in our component
const Wrapper = styled.div`
  background-color: rgb(201, 201, 201);
  border-radius: 5px;
  max-width: 500px;
  min-width: 500px;
`;

// Props type examples

// columns: [ "A", "B", "C", … ]
// data: [ (7) [ 0, "2020-01-31", 9, … ], (7) […], (7) […], … ]
// x: "A"
// y: "B"

// our functional component with deconstructed props
function ModalPlot({
  columns,
  data,
  x,
  y
}) {
  
  // returns an array of sorted {x: , y: } coord objects
  const getDataFromProps = useCallback(() => {
    let x_index = columns.indexOf(x);
    let y_index = columns.indexOf(y);
    let cords = [];
    
    for (let index = 0; index < data.length; index++) {
      const row = data[index];
      cords.push({x: row[x_index], y: row[y_index]});
    }
    
    // sort the values so any given curve drawn on the scatter plot
    // only ever intercepts a vertical line once. Ie. not like the
    // scatter plot at https://jerairrest.github.io/react-chartjs-2/
    // which goes in all directions on the x axis
    // sortable: [[x, y], [x,y], ...]
    var sortable = [];
    cords.forEach(item => {
      sortable.push([item['x'], item['y']]);
    });
    
    sortable.sort(function(a, b) {
      return a[0] - b[0];
    });
    
    var coordsSorted = [];
    sortable.forEach(function(item){
      coordsSorted.push({x: item[0], y: item[1]});
    });
    
    return coordsSorted;
  }, [columns, data, x, y]);
  
  const createPlot = useCallback(() => {
    const data = {
      labels: ['Scatter X / Y'],
      datasets: [
        {
          label: 'x: ' + x + ' y: ' + y,
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
            labelString: y
          }
        }],
        xAxes: [{
          scaleLabel: {
            display: true,
            labelString: x
          }
        }],
      },
      maintainAspectRatio: true,
    };
    
    const plot = <Scatter
      data={data}
      width={null}
      height={null}
      options={options}
    />
    
    return plot;
  }, [columns, x, y]);// eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Wrapper id="plot">
      {createPlot()}
    </Wrapper>
  );
}

// type checking our given props
ModalPlot.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.string),
  data: PropTypes.array,
  x: PropTypes.number,
  y: PropTypes.string
};


// becomes memo( Operation() )
export default compose(
  memo,
)(ModalPlot);

