import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import axios from 'axios';
import './Batalla.css';

const Batalla: React.FC = () => {
  const { user, addExperience } = useUser();
  const [enemy, setEnemy] = useState<any>(null);
  const [myActivePkmn, setMyActivePkmn] = useState<any>(null);
  const [enemyHP, setEnemyHP] = useState(0);
  const [myHP, setMyHP] = useState(0);
  const [log, setLog] = useState("¡Un enemigo ha aparecido!");

  // 1. Aparece enemigo aleatorio (Lógica similar a Búsqueda)
  useEffect(() => {
    const fetchEnemy = async () => {
      const id = Math.floor(Math.random() * 151) + 1;
      const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
      setEnemy(res.data);
      setEnemyHP(res.data.stats[0].base_stat * 2); // HP escalado
    };
    fetchEnemy();
  }, []);

  // 2. Seleccionar mi primer pokemon
  useEffect(() => {
    if (user?.pokemonTeam.length! > 0) {
      const first = user?.pokemonTeam[0];
      setMyActivePkmn(first);
      setMyHP(first.stats[0].base_stat * 2);
    }
  }, [user]);

  const ataqueJugador = (daño: number) => {
    if (!enemy) return;
    const nuevaHPEnemigo = Math.max(0, enemyHP - daño);
    setEnemyHP(nuevaHPEnemigo);
    setLog(`Usaste un ataque de ${daño} de daño!`);

    if (nuevaHPEnemigo <= 0) {
      setLog("¡Ganaste! +10 XP");
      addExperience(10); // Aquí deberías ajustar según rareza
      return;
    }

    // Turno enemigo tras 1 segundo
    setTimeout(ataqueEnemigo, 1000);
  };

  const ataqueEnemigo = () => {
    const dañoEnemigo = Math.floor(Math.random() * 20) + 5;
    setMyHP(prev => Math.max(0, prev - dañoEnemigo));
    setLog(`${enemy.name} contraataca con ${dañoEnemigo} de daño!`);
  };

  if (!enemy || !myActivePkmn) return <div>Buscando oponente...</div>;

  return (
    <div className="battle-container">
      <div className="battle-stage">
        {/* Lado Enemigo */}
        <div className="enemy-side">
          <div className="hp-bar">HP: {enemyHP}</div>
          <img src={enemy.sprites.front_default} alt="enemy" />
          <p className="name">{enemy.name}</p>
        </div>

        {/* Lado Jugador */}
        <div className="player-side">
          <img src={myActivePkmn.sprites.back_default || myActivePkmn.sprites.front_default} alt="me" />
          <div className="hp-bar">HP: {myHP}</div>
          <p className="name">{myActivePkmn.name}</p>
        </div>
      </div>

      <div className="battle-console">
        <p>{log}</p>
        <div className="actions">
          <button onClick={() => ataqueJugador(15)}>Placaje (15)</button>
          <button onClick={() => ataqueJugador(25)}>Ataque Especial (25)</button>
          <button onClick={() => alert("Cambiando Pokémon...")}>Cambiar</button>
        </div>
      </div>
    </div>
  );
};

export default Batalla;


