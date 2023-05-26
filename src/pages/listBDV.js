import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';

import icon from '../images/pin.png';

const getAddress =  (infos) => {
    const num_voie = infos?.num_voie;
    const voie = infos?.voie;
    const complement1 = infos?.complement1;
    const complement2 = infos?.complement2;
    const lieu_dit = infos?.lieu_dit;
    const code_postal = infos?.code_postal;
    const commune = infos?.commune;
    // return (`${num_voie} ${voie} ${complement1} ${complement2} ${lieu_dit} ${code_postal} ${commune}`).toString();
    return (`${num_voie} ${voie} ${lieu_dit} ${code_postal} ${commune}`).toString();
};

const GeocodeMarker = ({ address, infos, handleBVoteClick }) => {
    const [location, setLocation] = React.useState(null);
  
    React.useEffect(() => {
      const geocode = async () => {
        const formattedAddress = address.replace(/\s+/g, '+');
        const response = await axios.get(`https://api-adresse.data.gouv.fr/search/?q=${formattedAddress}`);
        const results = response.data.features;
        if (results && results.length > 0) {
          const x = results[0]?.geometry.coordinates[0] || {};
          const y = results[0]?.geometry.coordinates[1] || {};
          if (x !== undefined && y !== undefined) {
            setLocation([y, x]);
          }
        }
      };
  
      geocode();
    }, [address]);
  
    const markerIcon = new Icon({
      iconUrl: icon,
      iconSize: [25, 25],
      iconAnchor: [12.5, 25],
      popupAnchor: [0, -25],
    });

    return location ? 
        <Marker position={location} icon={markerIcon} >
            <Popup>
                <div onClick={() => handleBVoteClick(infos?.code_normalise_complet)}>
                    <h6 className="text-capitalize">{infos?.nom.toLowerCase()}</h6>            
                </div>
            </Popup>
        </Marker> : null;
  };
    

  const MapComponent = ({ bdvlist, l_bdv_noms, handleBVoteClick }) => {

    const [xM , setX] = useState(0);
    const [yM , setY] = useState(0);

    useEffect(() => {
        setX(0);
        setY(0);
        const geocode = async () => {
            const address = getAddress(l_bdv_noms.find(item => item.code_normalise_complet == parseInt(1)))
            const formattedAddress = address.replace(/\s+/g, '+');
            const response = await axios.get(`https://api-adresse.data.gouv.fr/search/?q=${formattedAddress}`);
            const results = response.data.features;
            setX(results[0]?.geometry.coordinates[0] || {});
            setY(results[0]?.geometry.coordinates[1] || {});                
        };
        if (bdvlist?.length >0 && l_bdv_noms?.length >0) {
            geocode();
        }
    }, [bdvlist, l_bdv_noms]);

    return (
        <>
        { bdvlist?.length >0 && l_bdv_noms?.length >0 ? (
            <>
            {xM !=0 && yM != 0 ? (
            <MapContainer center={[yM, xM]} zoom={12} style={{ height: '400px' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {bdvlist.map((bdv, index) => {
            //   console.log(bdv);
            //   console.log(l_bdv_noms.find(item => item.code_normalise_complet == parseInt(bdv.code_bvote)));
                const bdvInfos = l_bdv_noms.find(item => item.code_normalise_complet == parseInt(bdv.code_bvote));
                const address = getAddress(bdvInfos);
                const marker = l_bdv_noms.find(item => item.code_normalise_complet == parseInt(bdv.code_bvote)) ? (
                <GeocodeMarker key={index} address={address} icon={icon} infos={bdvInfos} handleBVoteClick={handleBVoteClick} />
                ) : null;
                return marker;
            })}
            </MapContainer>
            ) : null}
            </>
        ) : 
        <div className="alert alert-primary" role="alert">
            <span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span> chargement de la carte 
        </div>
        }
        </>
    );
  }; 
  
const ListBDV = ({ code_departement, code_commune, elections, handleBVoteClick }) => {
  const [bdvList, setBdvList] = useState([]);
  const [l_bdv_noms, setL_bdv_noms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
    setIsLoading(true);
      try {
        const response = await axios.get(`http://localhost:3005/api/bdv?code_departement=${code_departement}&code_commune=${code_commune}&elections=${elections}`);
        setBdvList(response.data);
        setIsLoading(false);
      } catch (error) {
        console.log('Error fetching BDV list:', error);
        setIsLoading(false);
      }
    };
    const get_names = async () => {
      const result = await axios(`http://localhost:3005/api/bdv_noms?code_departement=${code_departement}&code_commune=${code_commune}`);
      setL_bdv_noms(result.data); // Only set the first line of data
      setIsLoading(false);
    };
    fetchData();
    get_names();
  }, [code_departement, code_commune]);

  return (
    <>
    {!isLoading ? (
    <>
      <ul className='list-inline'>
        {bdvList.map(bdv => (
          <li key={bdv.code_bvote} className=" text-capitalize list-inline-item m-1">
            <button type="button" className="btn btn-sm btn-outline-secondary text-capitalize" onClick={() => handleBVoteClick(bdv.code_bvote)}>
              {l_bdv_noms.find(item => item.code_normalise_complet == parseInt(bdv.code_bvote))?.nom.toLowerCase()} <small style={{backgroundColor:"rgba(1,56,150,0.8)"}} className="text-white badge px-2">{bdv.code_bvote}</small>
            </button>
          </li>
        ))}
      </ul>
        {bdvList?.length >0 && l_bdv_noms?.length >0 ? (
            <MapComponent bdvlist={bdvList} l_bdv_noms={l_bdv_noms} handleBVoteClick={handleBVoteClick} />
        ) : null }
    </>
    ) : (
        <div className="alert alert-primary" role="alert">
            <span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span> Chargement des bdv 
        </div>
    )}
    </>
  );
};

export default ListBDV;
