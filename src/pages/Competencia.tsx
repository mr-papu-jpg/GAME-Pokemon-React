import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import type { Pokemon } from '../interfaces/pokemonTypes';
import { Link, useNavigate } from 'react-router-dom';
import './Competencia.css';

const Competencia: React.FC = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  
  const [showModal, setShowModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Pokemon[]>([]);
  
  // Determinamos si la fase actual es Jefe (cada 10 niveles)
  const isBossStage = user ? user.currentStage % 10 === 0 : false;

  const toggleSelectPokemon = (poke: Pokemon) => {
    if (selectedTeam.find(p => p.id === poke.id)) {
      setSelectedTeam(selectedTeam.filter(p => p.id !== poke.id));
    } else if (selectedTeam.length < 3) {
      setSelectedTeam([...selectedTeam, poke]);
    }
  };

  const handleStartBattle = () => {
    if (selectedTeam.length < 3) return alert("Selecciona 3 Pokémon");
    // Pasamos el equipo seleccionado a la página de batalla vía state de router
    navigate('/batalla-competencia', { state: { team: selectedTeam, isBoss: isBossStage } });
  };

  return (
    <div className="competencia-container">
      <header>
        <Link to="/menu" className="back-btn">⬅ Volver</Link>
        <h1>Mapa de Competencia</h1>
        <p>Fase Actual: {user?.currentStage}</p>
      </header>

      {/* RENDERIZADO DEL MAPA DE LÍNEA */}
      <div className="map-path">
        {[...Array(5)].map((_, i) => {
          const stageNum = (user?.currentStage || 1) + i - 2;
          if (stageNum <= 0) return null;
          
          const isCurrent = stageNum === user?.currentStage;
          const isPassed = stageNum < user?.currentStage!;
          const isBoss = stageNum % 10 === 0;

          return (
            <div key={stageNum} className={`stage-node ${isPassed ? 'passed' : ''} ${isCurrent ? 'active' : ''} ${isBoss ? 'boss' : ''}`}>
              <div className="node-circle">
                {stageNum}
                {isCurrent && <span className="arrow-indicator">⬇</span>}
              </div>
              {i < 4 && <div className="path-line"></div>}
            </div>
          );
        })}
      </div>

      <div className="stage-info">
        <h3>{isBossStage ? "🔥 FASE DE JEFE 🔥" : "🍃 Fase Común"}</h3>
        <p>Enemigos: 3 Pokémon {isBossStage ? "Raros/Legendarios" : "Comunes"}</p>
        <button className="prep-btn" onClick={() => setShowModal(true)}>
          Seleccionar Equipo y Ver Enemigos
        </button>
      </div>

      {/* MODAL DE SELECCIÓN */}
      {showModal && (
        <div className="modal-overlay">
          <div className="selection-modal">
            <header className="modal-header">
              <div className="selected-preview">
                {selectedTeam.map(p => (
                  <img key={p.id} src={p.sprites.front_default} alt="preview" />
                ))}
                {selectedTeam.length < 3 && <p>Faltan {3 - selectedTeam.length}</p>}
              </div>
              <button className="ready-btn" onClick={() => setShowModal(false)}>LISTO</button>
            </header>

            <div className="pokemon-scroll-list">
              {user?.pokemonTeam.map((poke) => (
                <div 
                  key={poke.id} 
                  className={`poke-card-select ${selectedTeam.find(p => p.id === poke.id) ? 'selected' : ''}`}
                  onClick={() => toggleSelectPokemon(poke)}
                >
                  <img src={poke.sprites.front_default} alt={poke.name} />
                  <h4>{poke.name}</h4>
                  <p>HP: {poke.stats[0].base_stat * 2}</p>
                </div>
              ))}
            </div>

            {selectedTeam.length === 3 && (
              <button className="start-btn" onClick={handleStartBattle}>EMPEZAR BATALLA</button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Competencia;


