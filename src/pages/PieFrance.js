import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart } from 'chart.js/auto';

import { GroupedNuances, colorNuances } from '../components/utils';

function PieFrance({ data, num_tour }) {
  // Combine all data for the specified tour
  const filteredData = data.filter(item => item.num_tour === num_tour);

  // Create a map to group the data by groupedNuance and sum the values
  const groupedData = new Map();
  filteredData.forEach(item => {
    const nuance = Object.keys(GroupedNuances).find(key => GroupedNuances[key].includes(item.codnua));
    if (groupedData.has(nuance)) {
      groupedData.set(nuance, groupedData.get(nuance) + item.total);
    } else {
      groupedData.set(nuance, item.total);
    }
  });

  
  const sortedData = [...groupedData.entries()].sort(([nuanceA], [nuanceB]) => {
    const nuanceKeyA = nuanceA || '';
    const nuanceKeyB = nuanceB || '';
    return nuanceKeyA.localeCompare(nuanceKeyB);
  });
  
    
  const totalVoix = filteredData.reduce((sum, item) => sum + item.total, 0);

  // Create a single dataset with all the data
  const dataset = {
    data: sortedData.map(([nuance, total]) => total),
    backgroundColor: sortedData.map(([nuance]) => getBackgroundColor(nuance)),
  };

  // Create labels for the pie chart
  const labels = sortedData.map(([nuance]) => `${nuance}`);

  // Construct the chart data
  const chartData = {
    labels: labels,
    datasets: [dataset],
  };

  function rgbToRgba(rgb, alpha) {
    return rgb.replace(')', `, ${alpha})`).replace('rgb', 'rgba');
  }

  // Get the background color based on the nuance
  function getBackgroundColor(nuance) {
    const color = colorNuances[nuance];
    if (color) {
      return rgbToRgba(color, 0.8);
    } else {
      console.warn(`No color found for nuance: ${nuance}`);
      return 'rgba(0, 0, 0, 0.5)'; // Default to black with alpha 0.5 if no color is found
    }
  }

  return (
    <div style={{ height: '450px' }}>
      <Pie data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
    </div>
  );
}

export default PieFrance;
