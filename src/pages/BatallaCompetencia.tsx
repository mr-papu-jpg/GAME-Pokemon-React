import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import axios from 'axios';
import './Batalla.css'; // Reutilizamos estilos base y añadimos específicos

const BatallaCompetencia: React.FC = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user, addExperience, setUser } = useUser();

  // Equipo del jugador (3 seleccionados) y Enemigos (3 aleatorios)
  const [playerTeam, setPlayerTeam] = useState<any[]>(state?.team || []);
  const [enemies, setEnemies] = useState<any[]>([]);
  
  // Índices para saber quién está peleando
  const [currentPlayerIdx, setCurrentPlayerIdx] = useState(0);
  const [currentEnemyIdx, setCurrentEnemyIdx] = useState(0);

  // HPs actuales
  const [playerHPs, setPlayerHPs] = useState<number[]>([]);
  const [enemyHP, setEnemyHP] = useState(0);

  const [log, setLog] = useState("¡Inicia la competencia!");
  const [isCharging, setIsCharging] = useState(true);

  // 1. Inicializar Enemigos y HPs del jugador
  useEffect(() => {
    const fetchEnemies = async () => {
      try {
        const enemyPromises = [1, 2, 3].map(() => {
          const id = Math.floor(Math.random() * 151) + 1;
          return axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
        });
        const results = await Promise.all(enemyPromises);
        const fetchedEnemies = results.map(r => r.data);
        
        setEnemies(fetchedEnemies);
        setEnemyHP(fetchedEnemies[0].stats[0].base_stat * 2);
        
        // Inicializar HPs del jugador basados en sus stats
        setPlayerHPs(playerTeam.map(p => p.stats[0].base_stat * 2));
        setIsCharging(false);
      } catch (err) {
        console.error(err);
        navigate('/competencia');
      }
    };
    fetchEnemies();
  }, []);

  const handleAttack = (dmg: number) => {
    if (enemyHP <= 0 || playerHPs[currentPlayerIdx] <= 0) return;

    // Daño al enemigo
    const newEnemyHP = Math.max(0, enemyHP - dmg);
    setEnemyHP(newEnemyHP);
    setLog(`¡${playerTeam[currentPlayerIdx].name} causó ${dmg} de daño!`);

    if (newEnemyHP <= 0) {
      if (currentEnemyIdx < 2) {
        setLog(`¡Enemigo derrotado! Entra ${enemies[currentEnemyIdx + 1].name}`);
        setTimeout(() => {
          const nextIdx = currentEnemyIdx + 1;
          setCurrentEnemyIdx(nextIdx);
          setEnemyHP(enemies[nextIdx].stats[0].base_stat * 2);
        }, 1500);
      } else {
        finishBattle(true);
      }
    } else {
      setTimeout(enemyTurn, 1000);
    }
  };

  const enemyTurn = () => {
    const enemyDmg = Math.floor(Math.random() * 15) + 5;
    const newHPs = [...playerHPs];
    newHPs[currentPlayerIdx] = Math.max(0, newHPs[currentPlayerIdx] - enemyDmg);
    setPlayerHPs(newHPs);
    setLog(`¡El enemigo responde con ${enemyDmg} de daño!`);

    if (newHPs[currentPlayerIdx] <= 0) {
      setLog(`¡${playerTeam[currentPlayerIdx].name} ha caído!`);
    }
  };

  const finishBattle = (won: boolean) => {
    if (won) {
      const xpGained = state.isBoss ? 52 : 25;
      addExperience(xpGained);
      // Avanzar etapa en el contexto
      setUser((prev: any) => ({ ...prev, currentStage: prev.currentStage + 1 }));
      alert(`¡Victoria! Avanzas a la fase ${user!.currentStage + 1}`);
    } else {
      alert("Tu equipo ha sido derrotado.");
    }
    navigate('/competencia');
  };

  if (isCharging) return <div className="loading">Generando rivales...</div>;

  const activePlayer = playerTeam[currentPlayerIdx];
  const activeEnemy = enemies[currentEnemyIdx];

  return (
    <div className="battle-container competencia-mode">
      <div className="battle-header">
        <span>Fase {user?.currentStage}</span>
        <div className="enemy-team-dots">
          {enemies.map((_, i) => (
            <div key={i} className={`dot ${i < currentEnemyIdx ? 'dead' : i === currentEnemyIdx ? 'active' : ''}`} />
          ))}
        </div>
      </div>

      <div className="battle-stage">
        {/* Lado Enemigo */}
        <div className="enemy-area">
          <div className="hp-bar">HP: {enemyHP}</div>
          <img src={activeEnemy.sprites.front_default} alt="enemy" />
          <p>{activeEnemy.name.toUpperCase()}</p>
        </div>

        {/* Lado Jugador */}
        <div className="player-area">
          <img src={activePlayer.sprites.back_default || activePlayer.sprites.front_default} alt="player" />
          <div className="hp-bar">HP: {playerHPs[currentPlayerIdx]}</div>
          <p>{activePlayer.name.toUpperCase()}</p>
        </div>
      </div>

      <div className="battle-controls">
        <p className="log-text">{log}</p>
        
        {playerHPs[currentPlayerIdx] > 0 ? (
          <div className="action-grid">
            <button onClick={() => handleAttack(15)}>Placaje</button>
            <button onClick={() => handleAttack(25)}>Ataque Elemental</button>
          </div>
        ) : (
          <div className="switch-menu">
            <p>Tu Pokémon no puede luchar. ¡Cambia!</p>
            {playerTeam.map((p, i) => (
              <button 
                key={i} 
                disabled={playerHPs[i] <= 0}
                onClick={() => { setCurrentPlayerIdx(i); setLog(`¡Adelante ${p.name}!`); }}
              >
                {p.name} ({playerHPs[i]} HP)
              </button>
            ))}
            {playerHPs.every(hp => hp <= 0) && (
              <button onClick={() => finishBattle(false)}>Salir (Derrota)</button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BatallaCompetencia;

