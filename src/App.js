import React, { useState, useEffect } from 'react';
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

function App() {

  return (
    <Router>
      <div className='app'>
        <div className='container-fluid'>
          <Navbar/>
        </div>
        <div className='container my-5'>
          <Routes>
            <Route path="/" element={<Accueil />} />
            <Route path="/france" element={<France />} />
            <Route path="/Ville" element={<Ville />} />
            <Route path="/BVote" element={<BVote />} />
            <Route path="/Test" element={<Test />} />
          </Routes>
        </div>
        <div className='container-fluid'>
          <Footer/>
        </div>
      </div>
      </Router>
  );
}

export default App;
