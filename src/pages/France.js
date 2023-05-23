import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';

import { Nuances } from '../components/utils';
import { list_elections } from '../components/utils';
import PieFrance from './PieFrance';


function France() {

const [data, setData] = useState([]);
const [tables, setTables] = useState([]);
const [elec, setElec] = useState('LG22_BVot_T1T2');
const [sum_T1, setSum_T1] = useState(1);
const [sum_T2, setSum_T2] = useState(1);

// useEffect(() => {
//     const fetchDepts = async () => {
//         const result = await axios(`http://localhost:3005/api/tables`);
//         setTables(result.data);
//     };
//     fetchDepts();
//     }, []);


useEffect(() => {
    const fetchData = async () => {
        const result = await axios(`http://localhost:3005/api/natio_codnua?elections=${elec}`);
        setData(result.data);
        set_sum();
        set_sum();

        console.log(elec);
        console.log(result.data);

    };
    fetchData();

    const set_sum = () => {
        let sum = 0;
        data.filter(item => item.num_tour == 1).forEach(item => {
            sum += parseInt(item.total);
        });    
        setSum_T1(sum);

        sum = 0;
        data.filter(item => item.num_tour == 2).map(item => {
            sum += parseInt(item.total);
        });
        setSum_T2(sum);
    };

    console.log(sum_T1);
    console.log(sum_T2);
}, [elec]);
    
    

const handleElecChange = (event) => {
    setElec(event.target.value);
};


  return (
    <div>
        <div className='row'>
            <div className='col-12'>
            <h1 className='text-center stickers stickers-red'>France</h1>
            <hr className='bbr mt-0'/>
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
            </div>
        </div>
        <div className='row'>
        <div className='col-12 mt-5'>
          <div className='row'>
            {data.some(item => item.num_tour == 1) && (
            <div className='col-6'>
              <h2>Tour 1</h2>
              <PieFrance data={data} num_tour={1} />
              </div>
            )}
            {data.some(item => item.num_tour == 2) && (
            <div className='col-6'>
            <h2>Tour 2</h2>
            <PieFrance data={data} num_tour={2} />
            </div>
            )}
            </div>
              
        </div>

            <div className='col-12 mt-5'>
            {data.some(item => item.num_tour == 1) &&
            <>
                <h2>Tour 1</h2>
                <p>Exprimés : {sum_T1}</p>
                <Table striped bordered hover>
                <thead>
                    <tr>
                    <th>Tour</th>
                    <th>Nuance</th>
                    <th>Total</th>
                    <th>%</th>
                    </tr>
                </thead>
                <tbody>
                    {data.filter(item => item.num_tour == 1).map(item => (
                    <tr key={item.codnua}>
                        <td>{item.num_tour}</td>
                        <td>{item.codnua} - {Nuances[item.codnua]}</td>
                        <td>{item.total}</td>
                        <td>{(100*item.total/sum_T1).toFixed(2)}</td>
                    </tr>
                    ))}
                </tbody>
                </Table>
            </>
            }
            {data.some(item => item.num_tour == 2) &&
            <>
                <h2>Tour 2</h2>
                <p>Exprimés : {sum_T2}</p>
                <Table striped bordered hover>
                <thead>
                    <tr>
                    <th>Tour</th>
                    <th>Nuance</th>
                    <th>Total</th>
                    <th>%</th>
                    </tr>
                </thead>
                <tbody>
                    {data.filter(item => item.num_tour == 2).map(item => (
                    <tr key={item.codnua}>
                        <td>{item.num_tour}</td>
                        <td>{item.codnua} - {Nuances[item.codnua]}</td>
                        <td>{item.total}</td>
                        <td>{(100*item.total / sum_T2).toFixed(2) }</td>
                    </tr>
                    ))}
                </tbody>
                </Table>
            </>
            }
            </div>
        </div>
    </div>
);
}

export default France;
