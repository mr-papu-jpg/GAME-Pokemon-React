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
  
  // Cálculo de recompensas según tus nuevas reglas
  const rewardGold = isBossStage ? 150 : 30;

  const toggleSelectPokemon = (poke: Pokemon) => {
    if (selectedTeam.find(p => p.id === poke.id)) {
      setSelectedTeam(selectedTeam.filter(p => p.id !== poke.id));
    } else if (selectedTeam.length < 3) {
      setSelectedTeam([...selectedTeam, poke]);
    }
  };

  const handleStartBattle = () => {
    if (selectedTeam.length < 3) return alert("Selecciona 3 Pokémon");
    // Pasamos el equipo, el tipo de fase y la recompensa prometida
    navigate('/batalla-competencia', { 
      state: { 
        team: selectedTeam, 
        isBoss: isBossStage,
        reward: rewardGold 
      } 
    });
  };

  return (
    <div className="competencia-container">
      <header className="competencia-header">
        <div className="header-top">
          <Link to="/menu" className="back-btn">⬅ Volver</Link>
          <div className="user-gold-badge">{user?.gold || 0} Gs</div>
        </div>
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
        <div className="reward-tag">Recompensa: +{rewardGold} Gs</div>
        <button className="prep-btn" onClick={() => setShowModal(true)}>
          Seleccionar Equipo y Ver Enemigos
        </button>
      </div>

      {/* MODAL DE SELECCIÓN */}
      {showModal && (
        <div className="modal-overlay">
          <div className="selection-modal">
            <header className="modal-header">
              <h3>Tu Equipo</h3>
              <div className="selected-preview">
                {selectedTeam.map(p => (
                  <img key={p.id} src={p.sprites.front_default} alt="preview" />
                ))}
                {selectedTeam.length < 3 && <p className="missing-count">Faltan {3 - selectedTeam.length}</p>}
              </div>
            </header>

            <div className="pokemon-scroll-list">
              {user?.pokemonTeam.map((poke, index) => (
                <div
                  key={`${poke.id}-${index}`}
                  className={`poke-card-select ${selectedTeam.find(p => p.id === poke.id) ? 'selected' : ''}`}
                  onClick={() => toggleSelectPokemon(poke)}
                >
                  <img src={poke.sprites.front_default} alt={poke.name} />
                  <h4>{poke.name.toUpperCase()}</h4>
                  <p>HP: {poke.stats[0].base_stat * 2}</p>
                </div>
              ))}
            </div>

            <div className="modal-actions">
               <button className="cancel-btn" onClick={() => setShowModal(false)}>Cerrar</button>
               {selectedTeam.length === 3 && (
                <button className="start-btn bounce" onClick={handleStartBattle}>
                  ¡A BATALLAR POR {rewardGold} Gs!
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Competencia;

