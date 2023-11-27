import React, { useState, useEffect } from 'react';
import ProgressBar from 'react-bootstrap/ProgressBar';
import { Nuances, GroupedNuances, colorNuances } from '../components/utils';
import { FaUsers, FaBan, FaCheck, FaClipboard } from 'react-icons/fa';

const TourProgress = ({ data, numTour }) => {
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

  return (
    <div className='bg-light p-5 my-5 rounded'>
      <h2 className='text-center'>Tour {numTour}</h2>
      {/* <div className='row'>
        <div className='col-6'>
            <div className="px-1 py-2 bg-pastel-primary m-3 rounded">
            <h3 className="text-primary text-center"><FaUsers /><br/> Inscrits</h3>
            <p className="text-muted text-center"><strong>{filteredData[0].inscrits}</strong></p>
            </div>
        </div>
        <div className='col-6'>
            <div className="px-1 py-2 bg-pastel-info m-3 rounded">
            <h3 className="text-info text-center"><FaBan /><br/> Abstentions</h3>
            <p className="text-muted text-center"><strong>{(((filteredData[0].inscrits - filteredData[0].votants) / filteredData[0].inscrits) * 100).toFixed(2)}%</strong></p>
            </div>
        </div>
        <div className='col-6'>
            <div className="px-1 py-2 bg-pastel-success m-3 rounded">
            <h3 className="text-success text-center"><FaCheck /><br/> Votants</h3>
            <p className="text-muted text-center"><strong>{filteredData[0].exprimes}</strong></p>
            </div>
        </div>
        <div className='col-6'>
            <div className="px-1 py-2 bg-pastel-secondary m-3 rounded">
            <h3 className="text-secondary text-center"><FaClipboard /><br/> Blancs&Nuls</h3>
            <p className="text-muted text-center"><strong>{filteredData[0].votants - filteredData[0].exprimes}</strong></p>
            </div>
        </div>
        </div> */}
        <div className='row p-0'>
          <div className='col-12 p-0'>
            <div className='row py-3 px-2 bg-white m-3 rounded shadow'>
              <div className='col-12 col-xl-6 align-items-center d-flex  d-xl-inline-flex justify-content-start justify-content-xl-center'>
                <p style={{fontSize:"2.5rem"}}>
                    <FaUsers className='rounded-circle p-2 m-2 shadow-sm' style={{backgroundColor : `rgba(33, 150, 243, 0.2)`, color : `rgba(33, 150, 243, 0.8)`}}/>
                </p>
                <p className='h6 text-left'>
                  <strong>Inscrits</strong><br/>
                  <span className='text-muted'>{filteredData[0].inscrits}</span>
                </p>
              </div>
              <div className='col-12 col-xl-6 align-items-center d-flex  d-xl-inline-flex justify-content-start justify-content-xl-center'>
                <p className='text-left' style={{ fontSize: '2.5rem' }}>
                  <FaBan className='rounded-circle p-2 m-2 shadow-sm' style={{ backgroundColor: 'rgba(255, 152, 0, 0.2)', color: 'rgba(255, 152, 0, 0.8)' }} />
                </p>
                <p className='h6 text-left'>
                  <strong>Abstention</strong><br />
                  <span className='text-muted'>{(((filteredData[0].inscrits - filteredData[0].votants) / filteredData[0].inscrits) * 100).toFixed(2)}%</span>
                </p>
              </div>
              <div className='col-12 col-xl-6 align-items-center d-flex  d-xl-inline-flex justify-content-start justify-content-xl-center'>
                <p style={{ fontSize: '2.5rem' }}>
                  <FaCheck className='rounded-circle p-2 m-2 shadow-sm' style={{ backgroundColor: 'rgba(76, 175, 80, 0.2)', color: 'rgba(76, 175, 80, 0.8)' }} />
                </p>
                <p className='h6 text-left'>
                  <strong>Exprimés</strong><br />
                  <span className='text-muted'>{filteredData[0].exprimes}</span>
                </p>
              </div>
              <div className='col-12 col-xl-6 align-items-center d-flex  d-xl-inline-flex justify-content-start justify-content-xl-center'>
                <p style={{ fontSize: '2.5rem' }}>
                  <FaClipboard className='rounded-circle p-2 m-2 shadow-sm' style={{ backgroundColor: 'rgba(125, 125, 125, 0.2)', color: 'rgba(125, 125, 125, 0.8)' }} />
                </p>
                <p className='h6 text-left'>
                  <strong>Blancs&Nuls</strong><br />
                  <span className='text-muted'>{filteredData[0].votants - filteredData[0].exprimes}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className='row p-2' style={{ display: 'flex' }}>
      {filteredData
        .sort((b, a) => a.voix - b.voix)
        .map((item, index) => (
          <div className='col-12 col-xl-6' style={{ display: 'flex' }}>
          <div key={Math.random() * 1000} className='my-2 shadow p-4 bg-white w-100 align-item-center'>
            <h3>
              {item.prenom && ` ${item.prenom} `}
              {item.nom}
              {item.libelle_cand_long && <small className='text-muted'> - {item.libelle_cand_long}</small>}
              <small className='text-muted'>&nbsp;#{index+1}</small>

            </h3>
            <ProgressBar className='shadow'
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
          </div>
        ))}
        </div>
    </div>
  );
};

export default TourProgress;
