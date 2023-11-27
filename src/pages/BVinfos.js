import React, { useEffect, useRef, useState, memo } from 'react';
import axios from 'axios';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import icon from '../images/pin.png';
import PieBDV from './PieBDV.js';


import { Nuances, elections } from '../components/utils';
import { list_elections } from '../components/utils';


const BVinfos = React.memo(({ code_departement, code_commune, code_bvote, data }) => {

    const mapContainerRef = useRef(null);
    var mapContainerKey = Math.random().toString();  
  
    const [infos, setInfos] = useState(null);
    const [address, setAddress] = useState(null);
    const [coordinates, setCoordinates] = useState(null);

    const [isLoading, setIsLoading] = useState(true);
    function capitalize(str) {
        return str?.replace(/\b\w/g, char => char.toUpperCase());
      }
      
    useEffect(() => {
        const fetchInfos = async () => {
            const result = await axios(`http://localhost:3005/api/bdv_info?code_departement=${code_departement}&code_commune=${code_commune}&bdv=${code_bvote}`);
            setInfos(await result.data[0]); // Only set the first line of data
        };

        setIsLoading(true);
        fetchInfos();      

      }, [code_departement, code_commune, code_bvote]);  

    useEffect(() => {
    let map = null;
    const fetchCoordinates = async () => {
        if (mapContainerRef.current && coordinates) {
        try {
            map = L.map(mapContainerRef.current).setView([coordinates.latitude, coordinates.longitude], 16);
    
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: 'Map data © OpenStreetMap contributors',
            maxZoom: 18,
            }).addTo(map);
            // Define the custom marker icon
            const markerIcon = L.icon({
                iconUrl : icon,
                iconSize: [25, 25],
                iconAnchor: [12.5, 25],
                popupAnchor: [0, -25],
            })
            L.marker([coordinates.latitude, coordinates.longitude], { icon: markerIcon })
            .addTo(map)
            .bindPopup(`${infos?.libelle} - ${capitalize(infos?.nom.toLowerCase())}`)
            .openPopup();
                            
        } catch (error) {
            console.log('Error:', error);
        }
        }
    };
    setIsLoading(true);
    fetchCoordinates();
    setIsLoading(false);
    }, [mapContainerKey]);          

    useEffect(() => {
    console.log(infos);
    const num_voie = infos?.num_voie;
    const voie = infos?.voie;
    const complement1 = infos?.complement1;
    const complement2 = infos?.complement2;
    const lieu_dit = infos?.lieu_dit;
    const code_postal = infos?.code_postal;
    const commune = infos?.commune;
    const addr = async () => {
        setAddress((`${num_voie} ${voie} ${complement1} ${complement2} ${lieu_dit} ${code_postal} ${commune}`).toString());
    };
    addr();
    }, [infos]);

    useEffect(() => {
    console.log(address);
    const coordo = async () => {
        setCoordinates(await getAddressCoordinates(address));
    };
    coordo();
    }, [address]);

    useEffect(() => {
        console.log(coordinates);
        mapContainerKey = Math.random().toString();
    }, [coordinates]);

    const getInscrits = () => {
    let inscrits = 0;
    //set inscrits to last value of histo_inscrits
    if (infos?.histo_inscrits) {
        inscrits = infos.histo_inscrits[infos.histo_inscrits.length - 1].inscrits;
    }
    return inscrits;
    };
    
  
          
    const getAddressCoordinates = async (address) => {
      try {
        // const encodedAddress = encodeURIComponent(address);
        // const url = `https://nominatim.openstreetmap.org/search?q=${encodedAddress}&format=json&limit=1`;
        // const response = await fetch(url);
        const formattedAddress = address?.replace(/\s+/g, '+');
        const response = await axios.get(`https://api-adresse.data.gouv.fr/search/?q=${formattedAddress}`);
        const results = response.data.features;

        // const data = await response.json();
    
        if (results && results.length > 0) {
          return { latitude: results[0]?.geometry.coordinates[1], longitude: results[0]?.geometry.coordinates[0] };
        }
    
        return null;
      } catch (error) {
        console.error('Error fetching address coordinates:', error);
        return null;
      }
    };



    return (
        <div className='row mt-5' style={{display:"flex"}}>
          {isLoading ? (
            <div className='col-12'>
              <div className="alert alert-primary" role="alert">
                <span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span> Chargement du graphe du bureau de vote
              </div>
            </div>
          ) : (
            <>
              <div className='col-md-5 col-sm-12 bg-light p-5 rounded'>
                <h2 className="mt-2 text-capitalize">{(infos?.nom.toLowerCase())}</h2>
                <hr className='bbr mt-0' />
                <p className='text-capitalize'>
                  {address.toLowerCase}
                </p>              
                <div className='row mt-3'>
                  <div className='col-12'>
                    <PieBDV data={data} num_tour={1} height={225} />
                  </div>
                </div>
              </div>
              <div className='col-md-7 col-sm-12 p-0'>
                <div key={mapContainerKey} ref={mapContainerRef} style={{ height: '100%', width: '100%' }} />
              </div>
            </>
          )}
        </div>
      );
      
});

export default BVinfos;
