import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';

import { Nuances, elections, GroupedNuances, list_elections } from '../components/utils';

const graphUpdate = (mode, rawChartData, setChartData) => {
  const filteredChartData = rawChartData.filter((item) => item.s_voix !== null && item.s_voix !== 0);

  if (filteredChartData.length > 0) {
    let data;
    let yAxisMax;

    if (mode === 1) {
      data = filteredChartData.map((item) => ((Number(item.s_voix) / Number(item.exprimes)) * 100).toFixed(2) || 0);
      yAxisMax = 100;
    } else if (mode === 2) {
      data = filteredChartData.map((item) => Number(item.s_voix) || 0);
      const maxSvoix = Math.max(...filteredChartData.map((item) => Number(item.s_voix) || 0));
      yAxisMax = Math.floor(maxSvoix + maxSvoix * 0.2);
    } else {
      data = [];
      yAxisMax = 100;
    }

    console.log('data', data);

    const chartData = {
      labels: filteredChartData.map((item) => list_elections[item.name]),
      datasets: [
        {
          label: 'Voix',
          data: data,
          backgroundColor: 'rgba(75, 192, 192, 0.4)',
          borderColor: 'rgba(75, 192, 192, 0.8)',
          tension: 0.1,
          fill: false,
        },
      ],
    };

    const chartOptions = {
      scales: {
        y: {
          min: 0,
          max: yAxisMax,
        },
      },
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false, // Set this to false to hide the legend
        },
      },    
    };

    setChartData({ data: chartData, options: chartOptions });
  } else {
    setChartData(null);
  }
};

const NuaCheckboxes = ({ code_departement, code_commune, code_bvote, desired_height }) => {
  const [selectedNuances, setSelectedNuances] = useState([]);
  const [rawChartData, setRawChartData] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [mode, setMode] = useState(1); // Default mode is 1 ("%")

  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      const groupNuances = GroupedNuances[value];
      setSelectedNuances((prevSelectedNuances) => [...prevSelectedNuances, ...groupNuances]);
    } else {
      const groupNuances = GroupedNuances[value];
      setSelectedNuances((prevSelectedNuances) =>
        prevSelectedNuances.filter((nuance) => !groupNuances.includes(nuance))
      );
    }
  };

  const handleModeChange = (event) => {
    setMode(Number(event.target.value));
  };

  useEffect(() => {
    setIsLoading(false);
    setInitialLoad(true);
  }, [code_departement, code_commune, code_bvote]);

  useEffect(() => {
    graphUpdate(mode, rawChartData, setChartData);
  }, [mode, rawChartData]);

  const fetchData = async () => {
    setRawChartData([]);
    setIsLoading(true);
    setInitialLoad(false);
  
    const params = {
      code_departement: code_departement,
      code_commune: code_commune,
      codnuas: selectedNuances.join(','),
    };
  
    if (code_bvote !== -1) {
      params.code_bvote = code_bvote;
    }
  
    try {
      const response = await axios.get(`http://localhost:3005/api/res_nua`, {
        params: params,
      });
  
      setRawChartData(response.data);
      console.log('Data fetched:', response.data);
      setIsLoading(false);
    } catch (error) {
      console.log('Error fetching data:', error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };
  
  const renderCheckboxes = () => {
    return Object.entries(GroupedNuances).map(([label, nuances]) => (
      <div key={label} className="form-check form-check-inline">
        <input
          className="form-check-input"
          type="checkbox"
          value={label}
          checked={nuances.every((nuance) => selectedNuances.includes(nuance))}
          onChange={handleCheckboxChange}
        />
        <label className="form-check-label">{label}</label>
      </div>
    ));
  };

  return (
    <>
      {isLoading ? (
        <div className="col-12 mt-5">
          <div className="alert alert-primary" role="alert">
            <span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span> Chargement du graphe
          </div>
        </div>
      ) : (
        <>
          {!initialLoad ? (
            <>
              {chartData ? (
                <div className="mt-4" style={{ height: `${desired_height}px`, width:"100%" }}>
                  <Line data={chartData.data} options={chartData.options} />
                </div>
              ) : (
                <div className="col-12 mt-5">
                  <div className="alert alert-danger" role="alert">
                    Error
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="alert alert-secondary mt-5" role="alert">
                Chargement initial
              </div>
            </>
          )}
        </>
      )}
      <h3>Historique des nuances</h3>
      <div className="d-flex flex-wrap">{renderCheckboxes()}</div>
      <div className="form-check form-check-inline">
        <input
          className="form-check-input"
          type="radio"
          name="mode"
          id="modePercent"
          value={1}
          checked={mode === 1}
          onChange={handleModeChange}
        />
        <label className="form-check-label" htmlFor="modePercent">
          %
        </label>
      </div>
      <div className="form-check form-check-inline">
        <input
          className="form-check-input"
          type="radio"
          name="mode"
          id="modeVoix"
          value={2}
          checked={mode === 2}
          onChange={handleModeChange}
        />
        <label className="form-check-label" htmlFor="modeVoix">
          Voix
        </label>
      </div>

      <button className="btn btn-primary" onClick={fetchData}>
        Rechercher
      </button>
    </>
  );
};

export default NuaCheckboxes;
