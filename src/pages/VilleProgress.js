import React, { useState, useEffect } from 'react';
import ProgressBar from 'react-bootstrap/ProgressBar';
import { Nuances, GroupedNuances, GroupedGroupsNuances, colorNuances } from '../components/utils';
import { FaUsers, FaBan, FaCheck, FaClipboard } from 'react-icons/fa';


const VilleProgress = ({ data, numTour, total, inscrits, votants }) => {
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

  const getGroupedGroupsNuance = (nuance) => {
            let groupLabel = "";
            
            for (const [group, nuances] of Object.entries(GroupedGroupsNuances)) {
            if (nuances.includes(nuance)) {
                groupLabel = group;
                break;
            }
            }
            return groupLabel;
        }

    const getGroupedNuance = (nuance) => {
            let lbl = ""
            for (const [label, codnua] of Object.entries(GroupedNuances)) {
            if (codnua.includes(nuance)) {
                lbl = label;
                break;
                }
            }
            return lbl;
        }
  
  
      
  return (
    <div className='bg-light p-5 my-5 rounded'>
      <h2 className='text-center'>Tour {numTour}</h2>
      <div className='row'>
        <div className='col-6'>
            <div className="px-1 py-2 bg-pastel-primary m-3 rounded">
            <h3 className="text-primary text-center"><FaUsers /><br/> Inscrits</h3>
            <p className="text-muted text-center"><strong>{inscrits}</strong></p>
            </div>
        </div>
        <div className='col-6'>
            <div className="px-1 py-2 bg-pastel-info m-3 rounded">
            <h3 className="text-info text-center"><FaBan /><br/> Abstentions</h3>
            <p className="text-muted text-center"><strong>{(((inscrits - votants) / inscrits) * 100).toFixed(2)}%</strong></p>
            </div>
        </div>
        <div className='col-6'>
            <div className="px-1 py-2 bg-pastel-success m-3 rounded">
            <h3 className="text-success text-center"><FaCheck /><br/> Votants</h3>
            <p className="text-muted text-center"><strong>{votants}</strong></p>
            </div>
        </div>
        <div className='col-6'>
            <div className="px-1 py-2 bg-pastel-secondary m-3 rounded">
            <h3 className="text-secondary text-center"><FaClipboard /><br/> Blancs&Nuls</h3>
            <p className="text-muted text-center"><strong>{votants - total}</strong></p>
            </div>
        </div>
        </div>
      {filteredData
        .sort((b, a) => a.total - b.total)
        .map(item => (
          <div key={Math.random() * 1000} className='my-3'>
            <h3>
                {Nuances[item.codnua]}
                <small className='text-muted'> - {getGroupedNuance(item.codnua)} </small>
            </h3>
            <ProgressBar
              now={(item.total / total) * 100}
              label={`${((item.total / total) * 100).toFixed(2)}%`}
              style={{
                height: '30px',
                backgroundColor: getBackgroundColor(item.codnua, 0.2),
              }}
            >
              <div
                style={{
                  width: `${(item.total / total) * 100}%`,
                  height: '100%',
                  backgroundColor: getBackgroundColor(item.codnua, 1),
                }}
              />
              
            </ProgressBar>
            <div className='row'>
                <div className='col-sm-12 col-md-6'>
                    <p className='text-muted text-left'>
                    {getGroupedGroupsNuance(getGroupedNuance(item.codnua))}
                    </p>
                </div>
                <div className='col-sm-12 col-md-6'>
                <p style={{ textAlign: 'right' }} className='text-left text-md-right'>{item.total} voix - {((item.total / total) * 100).toFixed(2)}%</p>
                </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default VilleProgress;
