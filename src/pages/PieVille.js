import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart } from 'chart.js/auto';

import { GroupedNuances, colorNuances } from '../components/utils';

function PieVille({ data, num_tour }) {
  // Combine all data for the specified tour
  const filteredData = data.filter(item => item.num_tour === num_tour);

// Sort the data by GroupedNuance
filteredData.sort((a, b) => {
  const nuanceA = Object.keys(GroupedNuances).find(key => GroupedNuances[key].includes(a.codnua)) || '';
  const nuanceB = Object.keys(GroupedNuances).find(key => GroupedNuances[key].includes(b.codnua)) || '';
  return nuanceA.localeCompare(nuanceB);
});


  const totalVoix = filteredData.reduce((sum, item) => sum + item.total, 0);

  // Create a single dataset with all the data
  const dataset = {
    data: filteredData.map(item => item.total),
    backgroundColor: filteredData.map(item => getBackgroundColor(item.codnua)),
  };

  // Create labels for the pie chart
  const labels = filteredData.map(item => `${item.codnua} - ${Object.keys(GroupedNuances).find(key => GroupedNuances[key].includes(item.codnua))}`);

  // Construct the chart data
  const chartData = {
    labels: labels,
    datasets: [dataset],
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
    <div style={{height:"450px"}}>
      <Pie data={chartData} options={chartOptions} />
    </div>
  );
}

export default PieVille;
