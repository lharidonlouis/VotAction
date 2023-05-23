import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';

import { list_elections, GroupedNuances, GroupedGroupsNuances } from '../components/utils';
import Form from 'react-bootstrap/Form';

const ChartNuances = ({ code_departement, code_commune, code_bvote }) => {
  const [chartData, setChartData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [mode, setMode] = useState(1); // Default mode is 1 ("%")
  const [rawChartData, setRawChartData] = useState([]);

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
          const labels = rawChartData.length > 0
          ? rawChartData.reduce((acc, item) => {
              if (item.data.length > acc.length) {
                return item.data;
              }
              return acc;
            }, [])
            .map((item) => {
              return list_elections[item.name] || '';
            })
          : [];
            console.log('labels:', labels);
            let longestArrayLength = 0;

            rawChartData.forEach((item) => {
            const dataLength = item?.data?.length || 0;
            if (dataLength > longestArrayLength) {
                longestArrayLength = dataLength;
            }
            });

            const datasets = Object.entries(GroupedGroupsNuances).map(([group, nuances], index) => {
            let data;
            if (mode === 1) {
                data = Array.from({ length: longestArrayLength }, (_, i) => {
                const item = rawChartData[index]?.data[i];
                if (item) {
                    const percentage = parseFloat(item.s_voix) / parseFloat(item.exprimes) * 100;
                    return isNaN(percentage) ? null : Number(percentage.toFixed(2));
                }
                return null;
                });
                yAxisMax = 100;
            } else if (mode === 2) {
                data = Array.from({ length: longestArrayLength }, (_, i) => {
                const item = rawChartData[index]?.data[i];
                if (item) {
                    const res = Number(item.s_voix) || 0;
                    return isNaN(res) ? null : Number(res);
                }
                return null;
                });
                const maxSvoix = Math.max(
                ...rawChartData[index]?.data.map((item) => Number(item?.s_voix) || 0)
                );
                yAxisMax = Math.max(Math.ceil(maxSvoix * 1.2), yAxisMax); // Compute the maximum as 120% of the maximum value
            } else {
                data = Array.from({ length: longestArrayLength }, () => null);
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
            maintainAspectRatio: true,
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
  

  const getBackgroundColor = (index) => {
    const colors = [
        'rgba(139, 0, 0, 0.4)', // Dark red
        'rgba(255, 0, 0, 0.4)', // bright red
        'rgba(255, 255, 0, 0.4)', // yellow
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
        'rgba(255, 255, 0, 0.8)', // yellow
        'rgba(0, 0, 255, 0.8)', // blue
        'rgba(0, 0, 0, 0.8)',     // black
        'rgba(128, 128, 128, 0.8)', // grey
      ];
          return colors[index % colors.length];
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
                <div className="col-12 mt-4" style={{ maxHeight: '600px', width: '100%' }}>
                    <Line data={chartData.data} options={chartData.options} height={1080} width={1920} />
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
};

export default ChartNuances;



