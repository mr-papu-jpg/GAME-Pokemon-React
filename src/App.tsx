import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Menu from './pages/Menu';
import Busqueda from './pages/Busqueda';
import Criadero from './pages/Criadero';
import Batalla from './pages/Batalla';
import Competencia from './pages/Competencia';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/busqueda" element={<Busqueda />} />
        <Route path="/criadero" element={<Criadero />} />
        <Route path="/batalla" element={<Batalla />} />
        <Route path="/competencia" element={<Competencia />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

