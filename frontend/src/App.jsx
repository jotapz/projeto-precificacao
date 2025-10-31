import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Inicio from './pages/Inicio.jsx'
import Footer from './components/Footer.jsx'
import Header from './components/Header.jsx'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';



function App() {

  return (
    <Router>
      <div className="App">
        <Header/>
        <Routes>
          <Route path="/" element={<Inicio />} />
        </Routes>
        <Footer/>
      </div>
    </Router>
  )
}

export default App
