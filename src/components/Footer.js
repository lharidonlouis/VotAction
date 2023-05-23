import React from 'react';
import { Container, Row, Col, Nav, NavItem, NavLink, Image } from 'react-bootstrap';
import pscergy from './images/cergy_tr.png';
import js from './images/js_tr.png';

function Footer() {
  return (
    <footer className="mt-5 bg-light">
      <Container fluid={true}>
          <Row className="border-top justify-content-center p-3 align-items-center align-items-end">
            <Col className="p-0" md={4} sm={12}>
                <ul className="list-unstyled mb-0">
                    <li><a as={NavLink} href='/' to="/" className="text-muted">Accueil</a></li>
                    <li><a as={NavLink} href='/France' to="/France" className="text-muted">France</a></li>
                    <li><a as={NavLink} href='/Ville' to="/Ville" className="text-muted">Ville</a></li>
                    <li><a as={NavLink} href='/BVote' to="/BVote" className="text-muted">Bureau de vote</a></li>
                </ul>
            </Col>
            <Col className="p-0 d-flex" md={4} sm={12}>
                <ul className="list-unstyled mb-0">
                    <li>
                        <a href="https://twitter.com/lharidonlouis" target="_blank" className="text-muted">
                            Twitter
                        </a>
                    </li>
                    <li>
                        <a href="https://github.com/lharidonlouis" target="_blank" className="text-muted">
                            GitHub
                        </a>
                    </li>
                    <li>
                        <p className="text-muted">
                            &copy; 2023 Louis Haridon
                        </p>
                    </li>
                </ul>
            </Col>
        </Row>
        <Row className='justify-content-center align-items-center'>
            <Col className='p-0 text-center' md={8} sm={12}>
                <p>Données officielles des élections et référendums disponibles sur <a href="https://www.data.gouv.fr/fr/pages/donnees-des-elections-et-referendums/" target="_blank">www.data.gouv.fr</a></p>
            </Col>
        </Row>
        <Row className="justify-content-center p-3 mt-0 align-items-center">
            <Col className="p-0" md={3} sm={8}>
                <ul className='list-unstyled mb-0 mt-0 d-flex align-items-center'>
                <li className='text-logo ml-5 mr-5' style={{whiteSpace: 'nowrap'}}>
                    <a href='https://www.louislharidon.fr' target='_blank' className='text-decoration-none text-dark'>
                    Louis L'Haridon
                    <hr className='bbr m-0'/>
                    </a>
                </li>
                <li>
                    &nbsp;
                </li>
                <li className='ml-5 mr-5' style={{marginRight: '1rem'}}>
                    <a href='https://www.ps-cergy.fr' target='_blank' className='text-muted'>
                    <Image src={pscergy} fluid={true} className="mb-3"/>
                    </a>
                </li>
                <li>
                    &nbsp;
                </li>

                <li className='ml-5 mr-5'>
                    <a href='https://www.lesjeunes-soc.fr' target='_blank' className='text-muted'>
                    <Image src={js} fluid={true} className="mb-3"/>
                    </a>
                </li>                
                </ul>
            </Col>
            </Row>
      </Container>
    </footer>
  );
}

export default Footer;
