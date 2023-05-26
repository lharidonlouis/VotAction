import React, { useState, useEffect, memo } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';

import { list_elections, GroupedNuances, GroupedGroupsNuances } from '../components/utils';
import Form from 'react-bootstrap/Form';

const ChartNuances = React.memo(({ code_departement, code_commune, code_bvote, desired_height }) => {
  const [chartData, setChartData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [mode, setMode] = useState(1); // Default mode is 1 ("%")
  const [rawChartData, setRawChartData] = useState([]);

  const legendContainerRef = React.useRef(null); // Ref for the legend container

  useEffect(() => {
    // Check if cached data exists
    const cachedData = localStorage.getItem('chartDataCache');
    if (cachedData) {
      setChartData(JSON.parse(cachedData));
      setInitialLoad(false);
    } else {
      fetchData(); // Fetch data if no cached data is found
    }
  }, [code_departement, code_commune, code_bvote]);

  useEffect(() => {
    // Cache the chartData
    localStorage.setItem('chartDataCache', JSON.stringify(chartData));
  }, [chartData]);

  const handleModeChange = (event) => {
    setMode(Number(event.target.value));
    };

  useEffect(() => {
    setIsLoading(false);
    setInitialLoad(true);
  }, [code_departement, code_commune, code_bvote]);


  useEffect(() => {
        graphUpdate();
    }, [mode, rawChartData]);

    const graphUpdate = () => {
        console.log('rawChartData:', rawChartData);
        if (rawChartData.length > 0) {
          let yAxisMax = 100;
          console.log('rawChartData:', rawChartData);
          const labels = Object.values(list_elections);
          console.log('labels:', labels);
            let longestArrayLength = 0;

            rawChartData.forEach((item) => {
            const dataLength = item?.data?.length || 0;
            if (dataLength > longestArrayLength) {
                longestArrayLength = dataLength;
            }
            });
            const datasets = Object.entries(GroupedGroupsNuances).map(([group, nuances], index) => {
              const data = Array.from({ length: Object.keys(list_elections).length }, (_, i) => {
                const itemName = Object.keys(list_elections)[i];
                const item = rawChartData[index]?.data.find(item => item.name === itemName);
                                if (mode === 1) {
                  const percentage = (item?.s_voix / item?.exprimes) * 100 || null;
                  return percentage !== null && !isNaN(percentage) ? Number(percentage.toFixed(2)) : null;
                } else if (mode === 2) {
                  const res = Number(item?.s_voix) || null;
                  return res !== null && !isNaN(res) ? Number(res) : null;
                } else {
                  return null;
                }
              });
              if (mode == 1) {
                yAxisMax = 100;
              } else if (mode == 2) {
                yAxisMax = Math.max(yAxisMax, Math.max(...data)) + 250;
              }

              
                                                
              console.log(index, ':', data);
              console.log("yAxisMax:", yAxisMax);
      
              const backgroundColor = getBackgroundColor(index);
              const borderColor = getBorderColor(index);
      
              return {
                label: group,
                data: data,
                backgroundColor: backgroundColor,
                borderColor: borderColor,
                tension: 0.1,
                fill: false,
                spanGaps: true
              };
            }
          );
          console.log('datasets:', datasets);
      
          const chartData = {
            labels: labels,
            datasets: datasets,
          };

          const chartOptions = {
            responsive : true,
            scales: {
              y: {
                beginAtZero: true,
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
        
  const fetchData = async () => {
    setIsLoading(true);
    setInitialLoad(false);
  
    try {
      const promises = Object.entries(GroupedGroupsNuances).map(([group, nuances]) => {
        const codnuas = nuances.flatMap(nuance => GroupedNuances[nuance]);
        return axios.get('http://localhost:3005/api/res_nua', {
          params: {
            code_departement: code_departement,
            code_commune: code_commune,
            code_bvote: code_bvote,
            codnuas: codnuas.join(','),
          },
        });
      });
  
        setRawChartData(await Promise.all(promises));
     
      setIsLoading(false);
      console.log('Data fetched');
    } catch (error) {
      console.log('Error fetching data:', error);
      setIsError(true);
      setIsLoading(false);
    }
  };
  
  const renderLegend = () => {
    const legendItems = Object.entries(GroupedGroupsNuances).map(([group, nuances], index) => {
      const backgroundColor = getBackgroundColor(index);
      const borderColor = getBorderColor(index);

      return (
        <div key={group} className="legend-item d-inline-flex align-items-center mx-1">
          <div className="legend-color me-2" style={{ backgroundColor, borderColor, borderRadius: '50%', width: '10px', height: '10px', borderWidth:"2px", borderStyle:"solid"}}></div>
          <div className="legend-label">{group}</div>
        </div>
      );
    });
    return (
      <div className="legend-container d-inline-flex" ref={legendContainerRef} style={{margin:"0 auto"}}>
        <div className="legend-items">{legendItems}</div>
      </div>
    );
  };


  const getBackgroundColor = (index) => {
    const colors = [
        'rgba(139, 0, 0, 0.4)', // Dark red
        'rgba(255, 0, 0, 0.4)', // bright red
        'rgba(255, 165, 0, 0.4)', // orange-yellow
        'rgba(0, 0, 255, 0.4)', // blue
        'rgba(0, 0, 0, 0.4)',     // black
        'rgba(128, 128, 128, 0.4)', // grey
      ];
          return colors[index % colors.length];
  };

  const getBorderColor = (index) => {
    const colors = [
        'rgba(139, 0, 0, 0.8)', // Dark red
        'rgba(255, 0, 0, 0.8)', // bright red
        'rgba(255, 165, 0, 0.8)', // orange-yellow
        'rgba(0, 0, 255, 0.8)', // blue
        'rgba(0, 0, 0, 0.8)',     // black
        'rgba(128, 128, 128, 0.8)', // grey
      ];
          return colors[index % colors.length];
  };

  return (
    <>
      {isLoading ? (
        <div className="col-12 mt-5" >
          <div className="alert alert-primary" role="alert">
            <span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span> Chargement du graphe
          </div>
        </div>
      ) : (
        <>
          {!initialLoad ? (
            <>
              {chartData ? (
                <>
                <div className="col-12 mt-4" style={{ width: '100%', height: `${desired_height}px` }}>
                  <Line data={chartData.data} options={chartData.options} />
                </div>
                <div className='col-12 mt-4'>
                        {renderLegend()}
                </div>
                </>
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
      <h3>Historique</h3>
      <Form>
        <div className="form-check form-check-inline">
            <input
            className="form-check-input"
            type="radio"
            name="mode"
            id="modePercent2"
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
            id="modeVoix2"
            value={2}
            checked={mode === 2}
            onChange={handleModeChange}
            />
            <label className="form-check-label" htmlFor="modeVoix">
            Voix
            </label>
        </div>
        </Form>
      <button className="btn btn-primary" onClick={fetchData}>
        Charger
      </button>
    </>
  );
});

export default ChartNuances;



