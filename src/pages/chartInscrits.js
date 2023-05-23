import Chart from 'chart.js/auto';

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import axios from 'axios';

import { list_elections } from '../components/utils';

const ChartInscrits = ({ code_departement, code_commune, code_bvote }) => {
  const chartRef = useRef(null);
  const [histo_inscrits, setHisto_inscrits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
    const [initialLoad, setInitialLoad] = useState(true);

//   const fetchData = useCallback(async () => {
//     try {
//       const response = await axios.get(
//         `http://localhost:3005/api/inscrits?code_departement=${code_departement}&code_commune=${code_commune}&code_bvote=${code_bvote}`
//       );
//       setHisto_inscrits(response.data);
//     } catch (error) {
//       console.log('Error fetching data:', error);
//     }
//     setIsLoading(false);
//   }, [code_departement, code_commune, code_bvote]);


useEffect(() => {

    setIsLoading(false);
    setInitialLoad(true);
}, [code_departement, code_commune, code_bvote]);

const fetchData = async () => {
    setInitialLoad(false);
    setIsLoading(true);
    try {
        const response = await axios.get(
        `http://localhost:3005/api/inscrits?code_departement=${code_departement}&code_commune=${code_commune}&code_bvote=${code_bvote}`
        );
        setHisto_inscrits(response.data);
    } catch (error) {
        console.log('Error fetching data:', error);
    }
    setIsLoading(false);
};

//   useEffect(() => {
 
//     const t1 = performance.now();
//     fetchData();
//     setIsLoading(false);
//     const t2 = performance.now();
//     console.log('perf graph', t2 - t1 + ' ms');

//   }, [fetchData]);

  const max = useMemo(() => {
    return Math.max(...histo_inscrits.map(item => +item.inscrits)) + 250;
  }, [histo_inscrits]);

  const chartOptions = useMemo(
    () => ({
      scales: {
        y: {
          beginAtZero: true,
          max: max,
        },
      },
      maintainAspectRatio: true,
    }),
    [max]
  );

  const chartData = useMemo(
    () => ({
      labels: histo_inscrits.map(item => list_elections[item.name]),
      datasets: [
        {
          label: 'Inscrits',
          data: histo_inscrits.map(item => Number(item.inscrits)),
          fill: false,
          borderColor: 'rgb(58, 89, 152)',
          backgroundColor: 'rgb(58, 89, 152)',
          tension: 0.1,
        },
      ],
    }),
    [histo_inscrits]
  );

  useEffect(() => {
    if (chartRef.current) {
        console.log('chartRef:', chartRef.current);

      const chartCanvas = chartRef.current;
      const ctx = chartCanvas.getContext('2d');

      // Destroy the previous chart instance if it exists
      if (chartCanvas.chart) {
        chartCanvas.chart.destroy();
      }

      chartCanvas.chart = new Chart(ctx, {
        type: 'line',
        data: chartData,
        options: chartOptions,
      });
    }
  }, [chartData, chartOptions]);


  return (
    <>
      {initialLoad ? (
        <div className="alert alert-secondary mt-5" role="alert">
          Chargement initial
        </div>
      ) : (
        <>
          {isLoading ? (
            <div className="alert alert-primary mt-5" role="alert">
              <span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span> Chargement du graphe du bureau de vote
            </div>
          ) : (
            <div className="mt-4" style={{ height: '450px' }}>
                <canvas ref={chartRef} height={"450px"} style={{height:"450px"}} />
            </div>
          )}
        </>
      )}

      <h3>Historique des inscrits</h3>
      <button className="btn btn-primary" onClick={fetchData}>
        Charger le graphe
      </button>
    </>
  );
  

};

export default ChartInscrits;
