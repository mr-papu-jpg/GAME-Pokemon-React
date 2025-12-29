import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useUser } from '../context/UserContext';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './Batalla.css';

const Batalla: React.FC = () => {
  const { user, addExperience } = useUser();
  const navigate = useNavigate();
  
  // Estados de Batalla
  const [enemy, setEnemy] = useState<any>(null);
  const [myActivePkmn, setMyActivePkmn] = useState<any>(null);
  const [enemyHP, setEnemyHP] = useState(0);
  const [myHP, setMyHP] = useState(0);
  const [log, setLog] = useState("¡Prepárate para la batalla!");
  const [battleStatus, setBattleStatus] = useState<'fighting' | 'won' | 'lost'>('fighting');
  const [totalXpGained, setTotalXpGained] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [lastDamageDealt, setLastDamageDealt] = useState<number | null>(null);
  const [lastDamageReceived, setLastDamageReceived] = useState<number | null>(null);


  // Cargar batalla inicial
  const initBattle = async () => {
    const id = Math.floor(Math.random() * 151) + 1;
    const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
    setEnemy(res.data);
    setEnemyHP(res.data.stats[0].base_stat * 2);
    setBattleStatus('fighting');
    setLog(`¡Un ${res.data.name.toUpperCase()} salvaje apareció!`);

    if (user?.pokemonTeam && user.pokemonTeam.length > 0) {
      const myPkmn = user.pokemonTeam[0];
      setMyActivePkmn(myPkmn);
      setMyHP(myPkmn.stats[0].base_stat * 2);
    }
  };

  useEffect(() => { initBattle(); }, []);

  const handleExit = () => {
    const confirm = window.confirm("¿En verdad quieres cancelar la pelea? Perderás posibles XP.");
    if (confirm) navigate('/menu');
  };

  const winBattle = (xp: number) => {
    addExperience(xp);
    setTotalXpGained(prev => prev + xp);
    setBattleStatus('won');
    setLog(`¡Has derrotado a ${enemy.name}! Ganaste ${xp} XP.`);
  };

  const ataqueJugador = (daño: number) => {
    if (battleStatus !== 'fighting') return;
  
    setLastDamageDealt(daño); // Guardamos el daño para mostrarlo
    setLastDamageReceived(null); // Limpiamos el daño previo del enemigo

    const nuevaHPEnemigo = Math.max(0, enemyHP - daño);
    setEnemyHP(nuevaHPEnemigo);
  
    if (nuevaHPEnemigo <= 0) {
        winBattle(10);
    } else {
        setTimeout(ataqueEnemigo, 1000);
    }
  };

  const ataqueEnemigo = () => {
    const daño = Math.floor(Math.random() * 15) + 5;
  
    setLastDamageReceived(daño); // Guardamos el daño recibido
    setLastDamageDealt(null); // Limpiamos el daño previo del jugador

    setMyHP(prev => Math.max(0, prev - daño));
    if (myHP - daño <= 0) setBattleStatus('lost');
  };


  // --- COMPONENTE MODAL (PORTAL) ---
  const XPModal = () => {
    return ReactDOM.createPortal(
      <div className="modal-overlay">
        <div className="modal-content">
          <h2>Resumen de Entrenamiento</h2>
          <p>Experiencia total obtenida: <strong>{totalXpGained} XP</strong></p>
          <button onClick={() => navigate('/menu')}>Siguiente (Ir al Menú)</button>
        </div>
      </div>,
      document.getElementById('modal-root')!
    );
  };

  return (
    <div className="battle-container">
      <button className="btn-exit" onClick={handleExit}>❌ Salir</button>

      <div className="battle-stage">
        <div className="enemy-area">
          <div className="hp-bar">HP: {enemyHP}</div>
          {enemy && <img src={enemy.sprites.front_default} className="enemy-sprite" />}
        </div>

        <div className="player-area">
          {myActivePkmn && <img src={myActivePkmn.sprites.back_default || myActivePkmn.sprites.front_default} className="player-sprite" />}
          <div className="hp-bar">HP: {myHP}</div>
        </div>
      </div>

      <div className="battle-controls">
        <p className="battle-log">{log}</p>
        <div className="damage-display">
            {lastDamageDealt && (
                <p className="damage-indicator player-dmg">¡Tu Pokémon causó {lastDamageDealt} de daño!</p>
            )}
            {lastDamageReceived && (
                <p className="damage-indicator enemy-dmg">¡El enemigo causó {lastDamageReceived} de daño!</p>
            )}
        </div>

  <p className="battle-log">{log}</p>
        
        {battleStatus === 'fighting' && (
          <div className="action-grid">
            <button onClick={() => ataqueJugador(20)}>Ataque A</button>
            <button onClick={() => ataqueJugador(30)}>Ataque B</button>
          </div>
        )}

        {battleStatus === 'won' && (
          <div className="victory-actions">
            <button className="btn-continue" onClick={initBattle}>Continuar Peleando ⚔️</button>
            <button className="btn-finish" onClick={() => setShowModal(true)}>Terminar y ver progreso</button>
          </div>
        )}
      </div>

      {showModal && <XPModal />}
    </div>
  );
};

export default Batalla;



