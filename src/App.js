import React, { createContext, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './App.css';
import './theme.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import Navbar from './components/Navbar.js'
import Footer from './components/Footer.js'

import Accueil from './pages/Accueil'
import France from './pages/France.js'
import Ville from './pages/Ville.js'
import BVote from './pages/Bvote.js'
import Test from './pages/test.js'

export const GlobalContext = createContext();


function App() {

  const [elec, setElec] = useState('LG22_BVot_T1T2');
  const [code_departement, setCode_departement] = useState('95');
  const [code_commune, setCode_commune] = useState('127');
  const [code_bvote, setCode_bvote] = useState('1');

  const globalVariables = {
    elec,
    code_departement,
    code_commune,
    code_bvote,
    setElec,
    setCode_departement,
    setCode_commune,
    setCode_bvote
  };

  return (
    <Router>
      <div className='app'>
        <div className='container-fluid'>
          <Navbar/>
        </div>
        <div className='container my-5'>
        <GlobalContext.Provider value={globalVariables}>
          <Routes>
            <Route path="/" element={<Accueil />} />
            <Route path="/france" element={<France />} />
            <Route path="/Ville" element={<Ville />} />
            <Route path="/BVote" element={<BVote />} />
            <Route path="/BVote" element={<BVote />} />
            <Route path="/Test" element={<Test />} />
          </Routes>
          </GlobalContext.Provider>
        </div>
        <div className='container-fluid'>
          <Footer/>
        </div>
      </div>
      </Router>
  );
}

export default App;
