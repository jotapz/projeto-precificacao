import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Inicio from './pages/Inicio.jsx'
import Footer from './components/Footer.jsx'
import Header from './components/Header.jsx'
import Login from './pages/Login.jsx'
import Registrar from './pages/Registrar.jsx'

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';



function App() {

  return (
    <Router>
      <div className="App">
        
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/Login" element={<Login/>} />
          <Route path="/Registrar" element={<Registrar/>}/>
        </Routes>
      </div>
    </Router>
  )
}

export default App
