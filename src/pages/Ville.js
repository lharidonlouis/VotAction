import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Dropdown from 'react-bootstrap/Dropdown';
import { Collapse } from 'react-bootstrap';

import { GlobalContext } from '../App';

import { useNavigate } from 'react-router';


import { Nuances } from '../components/utils';
import { list_elections } from '../components/utils';

import PieVille from './PieVille.js';
import { Pie } from 'react-chartjs-2';

import NuaCheckboxes from './NuaCheckboxes';
import ChartNuances from './chartNuances.js';
import VilleTable from './VilleTable.js';
import VilleProgress from './VilleProgress.js';
import ListBDV from './listBDV.js';

function Ville() {
  const [data, setData] = useState([]);
  const { elec, setElec } = useContext(GlobalContext);
  const { code_departement, setCode_departement } = useContext(GlobalContext);
  const { code_commune, setCode_commune } = useContext(GlobalContext);
  const { code_bvote, setCode_bvote } = useContext(GlobalContext);
  const [villes, setVilles] = useState([]);
  const [depts, setDepartements] = useState([]);
  const [tables, setTables] = useState([]);
  const [data_filtered, setData_filtered] = useState([]);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const [total1, setTotal1] = useState(0);
  const [total2, setTotal2] = useState(0);

  const [inscrits1, setInscrits1] = useState(0);
  const [inscrits2, setInscrits2] = useState(0);

  const [votants1, setVotants1] = useState(0);
  const [votants2, setVotants2] = useState(0);


  const [nom_by_codnua1, setNom_by_codnua1] = useState([]);
  const [nom_by_codnua2, setNom_by_codnua2] = useState([]);

  const [displayProgress, setDisplayProgress] = useState(true); // Toggle for displaying TourProgress or TourTable

  const navigate = useNavigate();

  const handleToggleDisplay = () => {
    setDisplayProgress(!displayProgress);
  };

  const handleElecChange = (event) => {
    setElec(event.target.value);
  };
  const handleCollapseToggle = () => {
    setIsCollapsed(!isCollapsed);
  };


  const handleCode_communeChange = (event) => {
    setCode_commune(event.target.value);
  };

  const handleCode_departementChange = (event) => {
    setCode_departement(event.target.value);
  };

  const handleVilleChange = (event) => {
    setCode_commune(event.target.value);
  }


    const handleBVoteClick = (code_bvote) => {
      setCode_bvote(code_bvote);
      navigate('/BVote');
    };


  // useEffect(() => {
  //   const fetchTables = async () => {
  //       const result = await axios(`http://localhost:3005/api/tables`);
  //       setTables(result.data);
  //   };
  //   fetchTables();
  //   }, []);

  
  useEffect(() => {
    const fetchDepts = async () => {
        const result = await axios(`http://localhost:3005/api/dept`);
        setDepartements(result.data);
    };
    fetchDepts();
    }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const result = await axios(`http://localhost:3005/api/data?elections=${elec}&code_departement=${code_departement}&code_commune=${code_commune}`);
      //sort data by bdv asc
        result.data.sort((a, b) => (a.code_bvote > b.code_bvote) ? 1 : -1);
      
      setData(result.data);
      setIsLoading(false);
    };
    fetchData();
  }, [elec, code_commune]);

  

  useEffect(() => {
    const fetchVilles = async () => {
      const result = await axios(`http://localhost:3005/api/villes?elections=${elec}&dept=${code_departement}`);
      setVilles(result.data);
    };
    fetchVilles();
  }, [elec, code_departement]);


  useEffect(() => {
    console.log('data', data);

    // sum the votes for each num_tour
    const sumVotes = (data, num_tour) => {
      var sum = 0
      data.filter(item => item.num_tour == num_tour).map(item => (
        sum += parseInt(item[`voix`])
      ))
      return sum
    };

    // get a list of the unique codnua for given num_tour
    const uniqueCodnua1 = [...new Set(data.filter(item => item.num_tour == 1).map(item => item.codnua))];
    const uniqueCodnua2 = [...new Set(data.filter(item => item.num_tour == 2).map(item => item.codnua))];

    // function to sum the votes for each uniqueCodnua

    const sumVotesByCodnua = (data, codnua, num_tour) => {
      var sum = 0
      data.filter(item => item.codnua == codnua && item.num_tour == num_tour).map(item => (
        sum += parseInt(item[`voix`])
      ))
      return sum
    }

    setTotal1(sumVotes(data, 1));
    setTotal2(sumVotes(data, 2));

    const sumInscrits = (data, num_tour) => {
      const uniqueCodeBvotes = [...new Set(data.filter(item => item.num_tour == num_tour).map(item => item.code_bvote))];
      let sum = 0;
    
      uniqueCodeBvotes.forEach(code_bvote => {
        const matchingItem = data.find(item => item.code_bvote == code_bvote && item.num_tour == num_tour);
        if (matchingItem) {
          sum += parseInt(matchingItem.inscrits);
        }
      });
        
      return sum;
    };
    setInscrits1(sumInscrits(data, 1));
    setInscrits2(sumInscrits(data, 2));

    const sumVotants = (data, num_tour) => {
      const uniqueCodeBvotes = [...new Set(data.filter(item => item.num_tour == num_tour).map(item => item.code_bvote))];
      let sum = 0;
    
      uniqueCodeBvotes.forEach(code_bvote => {
        const matchingItem = data.find(item => item.code_bvote == code_bvote && item.num_tour == num_tour);
        if (matchingItem) {
          sum += parseInt(matchingItem.votants);
        }
      });
        
      return sum;
    };

    setVotants1(sumVotants(data, 1));
    setVotants2(sumVotants(data, 2));    
    
    const total1ByCodnua = uniqueCodnua1.map(codnua => ({
      num_tour : 1,
      codnua,
      total: sumVotesByCodnua(data, codnua, 1)
    }));
    const total2ByCodnua = uniqueCodnua2.map(codnua => ({
      num_tour : 2,
      codnua,
      total: sumVotesByCodnua(data, codnua, 2)
    }));    

    setData_filtered(total1ByCodnua.concat(total2ByCodnua));
    console.log(data_filtered);

  }, [data]);


  return (
    <div>
      <div className='row'>
        <div className='col-12'>
          <h1 className='text-center stickers stickers-red'>Ville</h1>
          <hr className='bbr mt-0'/>
        </div>
      </div>
      <div className='row'>
      <div className='col-4'>
      <Form>
          <Form.Group controlId='formTables'>
            <Form.Label>Election</Form.Label>
            <Form.Select value={elec} onChange={handleElecChange}>
              {Object.entries(list_elections).map(([key, value]) => (
                <option key={key} value={key}>{value}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Form>
        </div>
        <div className='col-4'>
        <Form>
            <Form.Group controlId='formCity'>
              <Form.Label>Departement</Form.Label>
              <Form.Select value={code_departement} onChange={handleCode_departementChange}>
                {depts.map((dept, index) => (
                  <option key={index} value={dept.code_departement}>{dept.code_departement} - {dept.libelle_departement}</option>
                  ))}
              </Form.Select>
            </Form.Group>
          </Form>
          </div>
          <div className='col-4'>
          <Form>
            <Form.Group controlId='formCity'>
              <Form.Label>Ville</Form.Label>
              <Form.Select value={code_commune} onChange={handleVilleChange}>
                {villes.map((ville, index) => (
                  <option key={index} value={ville.code_commune}>{ville.libelle_commune}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Form>
        </div>
        <div className='col-12 mt-5 bg-light p-5'>
        <div className='jumbotron'>
          <h2>Les graphes</h2>
          <hr className='my-4'/>
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
            <Collapse in={!isCollapsed}>
            <div className='row mt-4'>
            {data_filtered.some(item => item.num_tour == 1) && (
            <div className='col-4'>
              <h3>Tour 1</h3>
              <PieVille data={data_filtered} num_tour={1} />
              </div>
            )}
            {data_filtered.some(item => item.num_tour == 2) && (
            <div className='col-4'>
            <h3>Tour 2</h3>
            <PieVille data={data_filtered} num_tour={2} />
            </div>
            )}
            <div className='col-4'>
              <h3>Evolution</h3>
              <NuaCheckboxes code_departement={code_departement} code_commune={code_commune} code_bvote={-1} desired_height={450} />
              </div>
              <div className='col-12'>
              <h3>Evolution</h3>
              <ChartNuances code_departement={code_departement} code_commune={code_commune} code_bvote={-1} desired_height={450} />
              </div>
            </div>
            </Collapse>
      </div>

      <div className='row'>
        <div className='col-12 mt-5 bg-light jumbotron p-5'>
          <h2>Les bureaux de vote</h2>
          <hr className='my-4'/>
          <ListBDV elections={elec} code_departement={code_departement} code_commune={code_commune} handleBVoteClick={handleBVoteClick} />
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
                <div className='row'>
                  <div className='col-6'>
                  {data_filtered.some(item => item.num_tour == 1) && (
                  <VilleProgress data={data_filtered} numTour={1} inscrits={inscrits1} votants={votants1} total={total1}/>
                )}
                </div>
                <div className='col-6'>
                {data_filtered.some(item => item.num_tour == 2) && (
                  <VilleProgress data={data_filtered} numTour={2} inscrits={inscrits2} votants={votants2} total={total2}/>
                )}
                </div>
                </div>
              </>
              ) : (
                <>
                {data_filtered.some(item => item.num_tour == 2) && (
                  <VilleTable data={data_filtered} numTour={2} inscrits={inscrits2} votants={votants2} total={total2}/>
                )}
                {data_filtered.some(item => item.num_tour == 1) && (
                  <VilleTable data={data_filtered} numTour={1} inscrits={inscrits1} votants={votants1} total={total1}/>
                )}
                </>                           
              )}       
              </>
            ): (
              <div className="alert alert-primary" role="alert">
                <span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span> Chargement des résultats du bureau de vote 
              </div>
            )}
            </div>
        </div>
      </div>
    </div>
  );
}

export default Ville;
