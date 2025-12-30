import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import Login from './pages/Login';
import Menu from './pages/Menu';
import Busqueda from './pages/Busqueda';
import Criadero from './pages/Criadero';
import Batalla from './pages/Batalla';
import Competencia from './pages/Competencia';
import BatallaCompetencia from './pages/BatallaCompetencia';
import Tienda from './pages/Tienda';

const App: React.FC = () => {
  return (
      <UserProvider>
        <BrowserRouter>
        <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/menu" element={<Menu />} />
                <Route path="/busqueda" element={<Busqueda />} />
                <Route path="/criadero" element={<Criadero />} />
                <Route path="/batalla" element={<Batalla />} />
                <Route path="/competencia" element={<Competencia />} />
                <Route path="*" element={<Navigate to="/" />} />
                <Route path="/batalla-competencia" element={<BatallaCompetencia />} />
                <Route path='/tienda' element={<Tienda />} />
            </Routes>
        </BrowserRouter>
    </UserProvider>
  );
};

export default App;

