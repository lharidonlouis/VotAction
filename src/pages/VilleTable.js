import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import { Nuances, GroupedNuances, colorNuances } from '../components/utils';

const VilleTable = ({ data, numTour, inscrits, votants, total }) => {
  const filteredData = data.filter(item => item.num_tour == numTour);

  function rgbToRgba(rgb, alpha) {
    return rgb?.replace(')', `, ${alpha})`).replace('rgb', 'rgba');
  }

  const getBackgroundColor = (codnua, alpha) => {
    const group = Object.keys(GroupedNuances).find(group =>
      GroupedNuances[group].includes(codnua)
    );
    return rgbToRgba(colorNuances[group], alpha);
  };

  const getUnderlayWidth = percentage => {
    return `${percentage}%`;
  };

  return (
    <div className='p-5'>
      <h2>Tour {numTour}</h2>
      <p>
            Inscrits : <span className="badge bg-info text-dark">{inscrits}</span> |
            Abstentions : <span className="badge bg-info text-dark">{(((inscrits - votants)/inscrits)*100).toFixed(2)}%</span> | 
            Votants : <span className="badge bg-info text-dark">{votants}</span> |
            Blancs&Nuls : <span className="badge bg-info text-dark">{votants - total}</span> |
            Exprimés : <span className="badge bg-info text-dark">{total}</span>           
          </p>
      <Table bordered striped hover size="lg" responsive>
        <thead>
          <tr>
                <th>Nuance</th>
                <th>Libellé</th>
                <th>voix</th>
                <th>% / exprimés</th>
                <th>% / inscrits</th>
          </tr>
        </thead>
        <tbody>
          {filteredData
            .sort((b, a) => a.total - b.total)
            .map(item => (
              <tr key={Math.random() * 1000} style={{ position: 'relative' }}>
                  <th style={{backgroundColor: `${getBackgroundColor(item.codnua, 0.8)}`}}>{item.codnua}</th>
                  <td style={{position:"relative"}}>
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '0',
                      left: '0',
                      width: `${((item.total / total) * 100).toFixed(2)}%`,
                      height: '20%',
                      backgroundColor: `${getBackgroundColor(item.codnua, 0.3)}`,
                      zIndex: '0',
                    }}
                  ></div>
                  {Nuances[item.codnua]}
                  </td>
                  <td>{item.total}</td>
                  <td>{((item.total/total)*100).toFixed(2)}</td>
                  <td>{((item.total/inscrits)*100).toFixed(2)}</td>
              </tr>
            ))}
        </tbody>
      </Table>
    </div>
  );
};

export default VilleTable;
