import React, { useState, useEffect } from 'react';
import ProgressBar from 'react-bootstrap/ProgressBar';
import { Nuances, GroupedNuances, colorNuances } from '../components/utils';

const TourProgress = ({ data, numTour }) => {
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

  return (
    <div className='bg-light p-5 my-5 rounded'>
      <h2>Tour {numTour}</h2>
      {filteredData
        .sort((b, a) => a.voix - b.voix)
        .map(item => (
          <div key={Math.random() * 1000} className='my-3'>
            <h3>
              {item.prenom && ` ${item.prenom} `}
              {item.nom}
              {item.libelle_cand_long && <small className='text-muted'> - {item.libelle_cand_long}</small>}
            </h3>
            <ProgressBar
              now={(item.voix / item.exprimes) * 100}
              label={`${((item.voix / item.exprimes) * 100).toFixed(2)}%`}
              style={{
                height: '30px',
                backgroundColor: getBackgroundColor(item.codnua, 0.2),
              }}
            >
              <div
                style={{
                  width: `${(item.voix / item.exprimes) * 100}%`,
                  height: '100%',
                  backgroundColor: getBackgroundColor(item.codnua, 1),
                }}
              />
              
            </ProgressBar>
            <div className='row'>
                <div className='col-sm-12 col-md-6'>
                    <p className='text-muted text-left'>{Nuances[item.codnua]}</p>
                </div>
                <div className='col-sm-12 col-md-6'>
                <p style={{ textAlign: 'right' }} className='text-left text-md-right'>{item.voix} voix - {((item.voix / item.exprimes) * 100).toFixed(2)}%</p>
                </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default TourProgress;
