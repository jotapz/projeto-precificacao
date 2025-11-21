import './App.css'
import Inicio from './pages/Inicio.jsx'
import Login from './pages/Login.jsx'
import Registrar from './pages/Registrar.jsx'
import SistemaPrec from './pages/SistemaPrec.jsx'
import Perfil from './pages/Perfil.jsx'
import LoginAdmin from './pages/LoginAdmin.jsx'
import AdminDashboard from "./pages/AdminDashboard";


import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import AOS from 'aos';
import 'aos/dist/aos.css'; 



function App() {

  AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: true,
    mirror: false
  });

  return (
    <Router>
      <div className="App">
        
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/Login" element={<Login/>} />
          <Route path="/Registrar" element={<Registrar/>}/>
          <Route path="/SistemaPrec" element={<SistemaPrec/>}/>
          <Route path="/Perfil" element={<Perfil/>}/>
          <Route path="/Login" element={<Login/>}/>

          <Route path="/login-admin" element={<LoginAdmin />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          
        </Routes>
      </div>
    </Router>
  )
}

export default App
