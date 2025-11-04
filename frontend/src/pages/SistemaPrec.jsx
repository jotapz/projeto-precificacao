import React from 'react';
import { Container } from 'react-bootstrap';
import Footer from '../components/Footer.jsx';
import Header from '../components/Header.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import HeaderProfile from '../components/HeaderProfile.jsx';
import NavBar from '../components/NavBar.jsx';


function SistemaPrec() {

    
  return (
    <div>
        <HeaderProfile />
        <div className="">
            <NavBar />
      
      </div>
    </div>
  );
}

export default SistemaPrec;
