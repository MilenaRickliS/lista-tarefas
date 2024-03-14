

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Login from './pages/Login'
import Tarefas from './pages/Tarefas'


const RoutesApp = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/tarefas" element={<Tarefas/>}/>   
      </Routes>
    </Router>
  );
};

export default RoutesApp;