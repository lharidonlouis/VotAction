import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart } from 'chart.js/auto';

import { Nuances, GroupedNuances, colorNuances } from '../components/utils';

function PieVille({ data, height }) {
  // Combine all data for the specified tour
  console.log(data);
  const filteredData1 = data.filter(item => item.num_tour == 1);
  const filteredData2 = data.filter(item => item.num_tour == 2);

  // Create datasets for each series
  const dataset1 = {
    data: filteredData1.map(item => item.total),
    backgroundColor: filteredData1.map(item => getBackgroundColor(item.codnua)),
  };
  
  const dataset2 = filteredData2 ? {
    data: filteredData2.map(item => item.voix),
    backgroundColor: filteredData2.map(item => getBackgroundColor(item.codnua)),
  } : null;

  // Adjust the length of dataset2 to match dataset1
if (dataset2 && dataset1.data.length !== dataset2.data.length) {
    const adjustedData2 = [];
    const adjustedBGCol = [];

    for (let i = 0; i < dataset1.data.length; i++) {
      const matchingItem = filteredData2.find(item => item.codnua === filteredData1[i].codnua);
      if (matchingItem) {
        adjustedData2.push(matchingItem.total);
        adjustedBGCol.push(getBackgroundColor(matchingItem.codnua));
      } else {
        adjustedData2.push(0); // Or any other default value if no match is found
        adjustedBGCol.push('rgba(0, 0, 0, 0)'); // Or any other default value if no match is found
      }
    }
    dataset2.data = adjustedData2;
    dataset2.backgroundColor = adjustedBGCol;
  }
  const datasets = dataset2 ? [dataset1, dataset2] : [dataset1];
  console.log(datasets);

// Create labels for the pie chart
const labels = filteredData1.map(item => `${Nuances[item.codnua]} - ${Object.keys(GroupedNuances).find(key => GroupedNuances[key].includes(item.codnua))}`);

console.log(labels);

// Construct the chart data
const chartData = {
    labels: labels,
    datasets: datasets,
};

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // Set to true to display the legend
        position: 'bottom', // Adjust the legend position as needed
        labels: {
          font: {
            size: 12, // Adjust the font size of the legend labels
          },
        },
      },
    },
  };

  function rgbToRgba(rgb, alpha) {
    return rgb.replace(')', `, ${alpha})`).replace('rgb', 'rgba');
  }

  // Get the background color based on the codnua
  function getBackgroundColor(codnua) {
    const lbl = Object.keys(GroupedNuances).find(key => GroupedNuances[key].includes(codnua));
    const color = colorNuances[lbl];
    if (color) {
      return rgbToRgba(color, 0.8);
    } else {
      console.warn(`No color found for codnua: ${codnua}`);
      return 'rgba(0, 0, 0, 0.5)'; // Default to black if no color is found
    }
  }

  return (
    <div style={{ height: `${height}px`, width: '100%' }}>
      <Pie data={chartData} options={chartOptions} />
    </div>
  );
}

export default PieVille;
