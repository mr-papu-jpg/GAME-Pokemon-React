import React from 'react';
import { useNavigate } from 'react-router-dom';
import './NotFound.css';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="not-found-screen">
      <div className="not-found-card">
        <h1>404</h1>
        <img 
          src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/54.png" 
          alt="Psyduck confundido" 
          className="psyduck-confused"
        />
        <p>¡Estás tan confundido como Psyduck! Esta ruta no existe.</p>
        <button onClick={() => navigate('/menu')} className="back-home-btn">
          VOLVER AL MENÚ
        </button>
      </div>
    </div>
  );
};

export default NotFound;

