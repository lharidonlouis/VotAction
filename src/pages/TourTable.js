import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import { Nuances, GroupedNuances, colorNuances } from '../components/utils';

const TourTable = ({ data, numTour }) => {
  const filteredData = data.filter(item => item.num_tour == numTour);

  function rgbToRgba(rgb, alpha) {
    return rgb.replace(')', `, ${alpha})`).replace('rgb', 'rgba');
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
      <Table bordered striped hover size="lg" responsive>
        <thead>
          <tr>
            <th>Nuance</th>
            <th>Nom</th>
            {filteredData.some(item => item.libelle_cand_long) && (
              <th>Liste</th>
            )}
            <th>Libelle</th>
            <th>Voix</th>
            <th>%</th>
          </tr>
        </thead>
        <tbody>
          {filteredData
            .sort((b, a) => a.voix - b.voix)
            .map(item => (
              <tr key={Math.random() * 1000} style={{ position: 'relative' }}>
                  <th style={{backgroundColor: `${getBackgroundColor(item.codnua, 0.5)}`}}>{item.codnua}</th>
                  <td style={{position:"relative"}}>
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '0',
                      left: '0',
                      width: `${((item.voix / item.exprimes) * 100).toFixed(2)}%`,
                      height: '20%',
                      backgroundColor: `${getBackgroundColor(item.codnua, 0.3)}`,
                    }}
                  ></div>
                  &nbsp;  {item.prenom && `  ${item.prenom}`} {item.nom}
                </td>
                {item.libelle_cand_long && <td>{item.libelle_cand_long}</td>}
                <td>{Nuances[item.codnua]}</td>
                <td>{item.voix}</td>
                <td>{((item.voix / item.exprimes) * 100).toFixed(2)}</td>
              </tr>
            ))}
        </tbody>
      </Table>
    </div>
  );
};

export default TourTable;
