import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ListBDV = ({ code_departement, code_commune, elections }) => {
  const [bdvList, setBdvList] = useState([]);
  const [l_bdv_noms, setL_bdv_noms] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:3005/api/bdv?code_departement=${code_departement}&code_commune=${code_commune}&elections=${elections}`);
        setBdvList(response.data);
      } catch (error) {
        console.log('Error fetching BDV list:', error);
      }
    };

    const get_names = async () => {
        const result = await axios(`http://localhost:3005/api/bdv_noms?code_departement=${code_departement}&code_commune=${code_commune}`);
        setL_bdv_noms(result.data); // Only set the first line of data
    };
    fetchData();
    get_names();
  }, [code_departement, code_commune]);

  return (
    <>
    <ul className='list-inline'>
      {bdvList.map(bdv => (
        <li key={bdv.code_bvote} className=" text-capitalize list-inline-item m-1">
            <button type="button" className="btn btn-info text-capitalize">
          {l_bdv_noms.find(item => item.code_normalise_complet == parseInt(bdv.code_bvote))?.nom.toLowerCase()} <small class="text-white"> - {bdv.code_bvote}</small>
          </button>
        </li>
      ))}
    </ul>
  </>  
  );
};

export default ListBDV;
