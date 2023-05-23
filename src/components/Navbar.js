import React from 'react';
import { Navbar as BSNavbar, Nav } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
    return (
      <BSNavbar expand='lg' bg="light" variant="light">
        <div className="container-fluid">
          <BSNavbar.Brand as={NavLink} to="/">VotAction</BSNavbar.Brand>
          <BSNavbar.Toggle aria-controls="basic-navbar-nav" />
          <BSNavbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={NavLink} to="/">Accueil</Nav.Link>
              <Nav.Link as={NavLink} to="/france">France</Nav.Link>
              <Nav.Link as={NavLink} to="/Ville">Ville</Nav.Link>
              <Nav.Link as={NavLink} to="/BVote">Bureau de vote</Nav.Link>
            </Nav>
          </BSNavbar.Collapse>
        </div>
      </BSNavbar>
    );
  }
  
  export default Navbar;
  