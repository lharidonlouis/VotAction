import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';


function France() {

const [data, setData] = useState([]);
const [tables, setTables] = useState([]);

const elections = [
  'ER99_Bvot',
  'CN01_BVot_T1T2',
  'LG02_BVot_T1T2',
  'CN04_BVot_T1T2',
  'RG04_BVot_T1T2',
  'ER04_BVot',
  'CN08_BVot_T1T2',
  'ER09_BVOT',
  'RG10_BVot_T1T2',
  'CN11_BVot_T1T2',
  'LG07_Bvot_T1T2',
  'ER14_BVOT',
  'RG15_BVot_T1T2',
  'DP15_Bvot_T1T2',
  'LG17_BVot_T1T2',
  // 'ER19_BVot',
  'DP21_BVot_T1T2',
  'RG21_BVot_T1T2',
  'LG22_BVot_T1T2',
];


// useEffect(() => {
//   const fetchData = async () => {
//     const results = [];
//     for (const election of elections) {
//       console.log(election);
//       const result = await axios(`http://localhost:3005/api/chartData?elections=${election}`);
//       results.push(result.data);
//     }
//     if (results.length === elections.length) {
//       setData(results);
//       console.log(results);
//     }
//   };
//   fetchData();
// }, []);
  

useEffect(() => {
  const fetchData = async () => {
    const response = await axios.get('http://localhost:3005/api/chartData2');
    setData(response.data);
  };
  fetchData();
}, []);



return (
  <div>
    <h2>Chart Data</h2>
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Table</th>
          <th>Tour</th>
          <th>Nuance</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={index}>
            <td>{item.table_name}</td>
            <td>{item.num_tour}</td>
            <td>{item.codnua}</td>
            <td>{item.total}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  </div>
);
}

export default France;
