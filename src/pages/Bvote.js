import React, { useState, useEffect, useContext, Suspense } from 'react';
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Dropdown from 'react-bootstrap/Dropdown';
import { Chart } from 'chart.js';
import { Collapse } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import Nav from 'react-bootstrap/Nav';
import { useNavigate } from 'react-router-dom';


import { GlobalContext } from '../App';


import { Nuances, elections } from '../components/utils';
import { list_elections } from '../components/utils';
import TourTable from './TourTable.js';
import TourProgress from './TourProgress.js';

const ChartInscritsAsync = React.lazy(() => import('./chartInscrits.js'));
const NuaCheckboxes = React.lazy(() => import('./NuaCheckboxes.js'));
const Test = React.lazy(() => import('./chartNuances.js'));
const BVinfos = React.lazy(() => import('./BVinfos.js'));



function BVote() {
  
  const [data, setData] = useState([]);
  const { elec, setElec } = useContext(GlobalContext);
  const { code_departement, setCode_departement } = useContext(GlobalContext);
  const { code_commune, setCode_commune } = useContext(GlobalContext);
  const { code_bvote, setCode_bvote } = useContext(GlobalContext);
  const [villes, setVilles] = useState([]);
  const [depts, setDepartements] = useState([]);
  const [bvotes, setBvotes] = useState([]);
  const [canLoad, setCanLoad] = useState(false);

  const [l_bdv_noms, setL_bdv_noms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [displayProgress, setDisplayProgress] = useState(true); // Toggle for displaying TourProgress or TourTable


  
  useEffect(() => {
    console.log("after useEffect:", code_departement, code_commune, code_bvote);
  }, []);
    
  const handleCollapseToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleToggleDisplay = () => {
    setDisplayProgress(!displayProgress);
  };


  const handleElecChange = (event) => {
      setElec(event.target.value);
  };

  const handleCode_departementChange = (event) => {
    setCode_departement(event.target.value);
  };

  const handleVilleChange = (event) => {
    setCode_commune(event.target.value);
  }

  const handleCode_bvoteChange = (event) => {
    setCode_bvote(event.target.value);
  }

  const fetchDepts = async () => {
    const result = await axios(`http://localhost:3005/api/dept`);
    setDepartements(result.data);
};
  const fetchVilles = async () => {
    const result = await axios(`http://localhost:3005/api/villes?elections=${elec}&dept="${code_departement}"`);
    await setVilles(result.data);
  };

  const fetchBDV = async () => {
    const result = await axios(`http://localhost:3005/api/bdv?code_departement="${code_departement}"&code_commune=${code_commune}&elections="${elec}"`);
    setBvotes(result.data);
  };
  const get_names = async () => {
    const result = await axios(`http://localhost:3005/api/bdv_noms?code_departement=${code_departement}&code_commune=${code_commune}`);
    setL_bdv_noms(result.data); // Only set the first line of data
    // console.log("noms : ", l_bdv_noms);
    // console.log("l_bdv_noms : ", l_bdv_noms);
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const result = await axios.get(`http://localhost:3005/api/data_bdv?elections=${elec}&code_departement=${code_departement}&code_commune=${code_commune}&code_bvote=${code_bvote}`);
      setData(result.data);
      setIsLoading(false);
    } catch (error) {
      console.log('Error fetching data:', error);
      setIsLoading(false);
    }
  };


  // useEffect(() => {
  //   setCode_bvote('1');
  // }, [code_commune]);


  useEffect(() => {
      fetchDepts();
    }, []);

  useEffect(() => {
      fetchVilles();
    }, [elec, code_departement]);


  useEffect(() => {
      get_names();
  }, [code_departement, code_commune]);

  useEffect(() => {
      fetchBDV();
  }, [elec, code_departement, code_commune]);


  useEffect(() => {
      var t1 = performance.now();
      fetchData();
      var t2 = performance.now();
      console.log("fetchData took " + (t2 - t1) + " milliseconds.");
  }, [elec, code_departement, code_commune, code_bvote]);

  
    
    //LOGS
    useEffect(() => {
      console.log(data);
    }, [data]);
   
  
  return (
    <div>
      <div className='row'>
        <div className='col-12'>
          <h1 className='text-center stickers stickers-red'>Bureau de vote</h1>
          <hr className='bbr mt-0'/>
        </div>
      </div>
      <div className='row'>
        <div className='col-12'>

        </div>
      </div>
      <div className='row'>
        <div className='col-3'>
        <Form>
          <Form.Group controlId='formTables'>
            <Form.Label>Election</Form.Label>
            <Form.Select value={elec} onChange={handleElecChange}>
              {Object.entries(list_elections).map(([key, value]) => (
                <option key={Math.random()*1000} value={key}>{value}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Form>
        </div>
        <div className='col-3'>
        <Form>
            <Form.Group controlId='formCity'>
              <Form.Label>Departement</Form.Label>
              <Form.Select value={code_departement} onChange={handleCode_departementChange}>
                {depts.map((dept, index) => (
                  <option key={Math.random()*1000} value={dept.code_departement}>{dept.code_departement} - {dept.libelle_departement}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Form>
          </div>
          <div className='col-3'>
          <Form>
            <Form.Group controlId='formCity'>
              <Form.Label>Ville</Form.Label>
              <Form.Select value={code_commune} onChange={handleVilleChange}>
                {villes.map((ville, index) => (
                  <option key={Math.random()*1000} value={ville.code_commune}>{ville.libelle_commune}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Form>
        </div>
        <div className='col-3'>
          <Form>
            <Form.Group controlId='formCity'>
              <Form.Label>Bureau de vote</Form.Label>
              <Form.Select value={code_bvote} onChange={handleCode_bvoteChange} className='text-capitalize'>
                {bvotes.map((bdv, index) => (
                  <option key={Math.random()*1000} value={bdv.code_bvote}>{bdv.code_bvote} - {l_bdv_noms.find(item => item.code_normalise_complet == parseInt(bdv.code_bvote))?.nom.toLowerCase()}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Form>
        </div>
      </div>


      <React.Suspense fallback={<div>Loading...</div>}>
         <BVinfos code_departement={code_departement} code_commune={code_commune} code_bvote={code_bvote} data={data} />
      </React.Suspense>

      <div className='row'>
        <div className='col-12 mt-5 bg-light p-5'>
          <div className='jumbotron'>
            <h2>Les graphes</h2>
            <hr className='my-4' />
            <button
              className='btn btn-secondary'
              type='button'
              onClick={handleCollapseToggle}
              aria-expanded={!isCollapsed}
              aria-controls='evolution-section'
            >
              Afficher les graphes
            </button>
          </div>
          <Collapse in={!isCollapsed} className='collapse'>
            <div className='row'>
              <div className='col-4 mt-5 p-5 bg-light'>
                <React.Suspense fallback={<div>Loading...</div>}>
                  <ChartInscritsAsync code_departement={code_departement} code_commune={code_commune} code_bvote={code_bvote} desired_height={450} />
                </React.Suspense>
              </div>
              <div className='col-4 mt-5 bg-light p-5'>
                <React.Suspense fallback={<div>Loading...</div>}>
                  <NuaCheckboxes code_departement={code_departement} code_commune={code_commune} code_bvote={code_bvote} mode={1} desired_height={450}/>
                </React.Suspense>
              </div>
              <div className='col-4 mt-5 bg-light p-5'>
                <React.Suspense fallback={<div>Loading...</div>}>
                  <Test code_departement={code_departement} code_commune={code_commune} code_bvote={code_bvote} desired_height={450} />
                </React.Suspense>
              </div>
            </div>
          </Collapse>
        </div>
      </div>

      <div className='row'>
        <div className='col-12 mt-5 bg-white jumbotron p-5'>
          {!isLoading ? (
            <>
              <h2>Les résultats</h2>
              <button className='btn btn-secondary m-3' onClick={handleToggleDisplay}>
              {displayProgress ? "Affichage tableau" : "Affichage simplifié"}
            </button>
            <hr className='my-4' />


              {displayProgress ? (
                <>
                  {data.some(item => item.num_tour == 2) && (
                    <TourProgress data={data} numTour={2} />
                  )}
                  {data.some(item => item.num_tour == 1) && (
                    <TourProgress data={data} numTour={1} />
                  )}
                </>
              ) : (
                <>
                  {data.some(item => item.num_tour == 2) && (
                    <TourTable data={data} numTour={2} />
                  )}
                  {data.some(item => item.num_tour == 1) && (
                    <TourTable data={data} numTour={1} />
                  )}
                </>
              )}
            </>
          ) : (
              <div className="alert alert-primary" role="alert">
                  <span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span> Chargement des résultats du bureau de vote 
              </div>
            )}
          </div>
      </div>
    </div>
  );
}

export default BVote;
