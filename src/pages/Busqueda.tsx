import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import axios from 'axios';
import { useUser } from '../context/UserContext';
import GameAlert from '../components/GameAlert';
import type { Pokemon } from '../interfaces/pokemonTypes';
import './Busqueda.css';

const Busqueda: React.FC = () => {
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [rarity, setRarity] = useState<'COMÚN' | 'RARO' | 'LEGENDARIO'>('COMÚN');

  const [alertMsg, setAlertMsg] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<'info' | 'success' | 'error' | 'victory'>('info');

  const { user, addPokemon, setUser } = useUser();

  const buscarPokemonAleatorio = async () => {
    const inv = user?.inventory.pokeballs;
    if (!inv || (inv.sencilla === 0 && inv.normal === 0 && inv.maestra === 0)) {
      setAlertType('error');
      setAlertMsg("⚠️ No tienes Pokébolas. ¡Ve a la tienda antes de explorar!");
      return;
    }

    setLoading(true);
    setPokemon(null);

    const azar = Math.random() * 100;
    let minId = 1;
    let maxId = 1025;

    if (azar < 70) {
      maxId = 500;
      setRarity('COMÚN');
    } else if (azar < 95) {
      minId = 501;
      maxId = 800;
      setRarity('RARO');
    } else {
      minId = 801;
      maxId = 1025;
      setRarity('LEGENDARIO');
    }

    const idFinal = Math.floor(Math.random() * (maxId - minId + 1)) + minId;

    try {
      const response = await axios.get<Pokemon>(`https://pokeapi.co/api/v2/pokemon/${idFinal}`);
      setPokemon(response.data);
    } catch (error) {
      console.error("Error", error);
      setAlertType('error');
      setAlertMsg('Hubo un error al buscar en la hierba alta...');
    } finally {
      setLoading(false);
    }
  };

  const intentarCapturar = (tipoBola: 'sencilla' | 'normal' | 'maestra') => {
    if (!pokemon || !user) return;

    if (user.inventory.pokeballs[tipoBola] <= 0) {
      setAlertType('error');
      setAlertMsg(`No tienes Pokébolas de tipo: ${tipoBola}`);
      return;
    }

    const azarCaptura = Math.random() * 100;
    let exito = false;

    if (tipoBola === 'sencilla') {
      if (rarity === 'COMÚN' && azarCaptura < 50) exito = true;
      else if (rarity === 'RARO' && azarCaptura < 20) exito = true;
      else if (rarity === 'LEGENDARIO' && azarCaptura < 5) exito = true;
    }
    else if (tipoBola === 'normal') {
      if (rarity === 'COMÚN' && azarCaptura < 99) exito = true;
      else if (rarity === 'RARO' && azarCaptura < 50) exito = true;
      else if (rarity === 'LEGENDARIO' && azarCaptura < 20) exito = true;
    }
    else if (tipoBola === 'maestra') {
      if (rarity === 'COMÚN' && azarCaptura < 99) exito = true;
      else if (rarity === 'RARO' && azarCaptura < 95) exito = true;
      else if (rarity === 'LEGENDARIO' && azarCaptura < 50) exito = true;
    }

    setUser(prev => {
      if (!prev) return null;
      const newInv = { ...prev.inventory };
      newInv.pokeballs[tipoBola] -= 1;
      return { ...prev, inventory: newInv };
    });

    if (exito) {
      addPokemon(pokemon);
      setAlertType('success');
      setAlertMsg(`¡ÉXITO! ${pokemon.name.toUpperCase()} ha sido capturado.`);
      setPokemon(null);
    } else {
      setAlertType('info');
      setAlertMsg(`¡Rayos! El ${pokemon.name.toUpperCase()} salvaje rompió la bola y huyó...`);
      setPokemon(null);
    }
  };

  return (
    <>
      <div className={`busqueda-screen ${alertMsg ? 'blur' : ''}`}>
        <header className="busqueda-header">
          <Link to="/menu" className="back-link">⬅ Menú</Link>
          <div className="inventory-status">
            <span>⚾ {user?.inventory.pokeballs.sencilla}</span>
            <span>🔵 {user?.inventory.pokeballs.normal}</span>
            <span>🟣 {user?.inventory.pokeballs.maestra}</span>
          </div>
        </header>

        <div className="encounter-area">
          {loading && <div className="loader">Moviendo la hierba...</div>}

          {pokemon && (
            <div className={`pokemon-card ${rarity.toLowerCase()}`}>
              <span className="rarity-label">{rarity}</span>
              <img src={pokemon.sprites.front_default} alt={pokemon.name} className="pkmn-bounce" />
              <h2 className="pkmn-name">{pokemon.name}</h2>

              <div className="catch-options">
                <p>¿Qué Pokébola quieres lanzar?</p>
                <div className="ball-buttons">
                  <button onClick={() => intentarCapturar('sencilla')} disabled={user?.inventory.pokeballs.sencilla === 0}>
                    Sencilla
                  </button>
                  <button onClick={() => intentarCapturar('normal')} disabled={user?.inventory.pokeballs.normal === 0}>
                    Normal
                  </button>
                  <button onClick={() => intentarCapturar('maestra')} disabled={user?.inventory.pokeballs.maestra === 0}>
                    Maestra
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {!loading && !pokemon && (
          <div className="idle-area">
            <button className="search-btn" onClick={buscarPokemonAleatorio}>
              Explorar Hierba Alta
            </button>
          </div>
        )}
      </div>

      {/* ALERT FUERA DEL DIV BLUR */}
      {alertMsg && (
        <GameAlert
          message={alertMsg}
          type={alertType}
          onClose={() => setAlertMsg(null)}
        />
      )}
    </>
  );
};

export default Busqueda;

