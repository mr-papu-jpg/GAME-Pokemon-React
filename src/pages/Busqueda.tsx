import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import axios from 'axios';
import { useUser } from '../context/UserContext';
import type { Pokemon } from '../interfaces/pokemonTypes';
import './Busqueda.css';

const Busqueda: React.FC = () => {
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [rarity, setRarity] = useState<'COMÚN' | 'RARO' | 'LEGENDARIO'>('COMÚN');
  const [message, setMessage] = useState<string>('');

  // Extraemos setUser para descontar las pokebolas del inventario
  const { user, addPokemon, setUser } = useUser();

  const buscarPokemonAleatorio = async () => {
    // 1. Verificación de existencia de pokebolas ANTES de buscar
    const inv = user?.inventory.pokeballs;
    if (!inv || (inv.sencilla === 0 && inv.normal === 0 && inv.maestra === 0)) {
      alert("⚠️ No tienes Pokébolas. ¡Ve a la tienda antes de explorar!");
      return;
    }

    setLoading(true);
    setPokemon(null);
    setMessage('');

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
      setMessage('Hubo un error al buscar...');
    } finally {
      setLoading(false);
    }
  };

  const intentarCapturar = (tipoBola: 'sencilla' | 'normal' | 'maestra') => {
    if (!pokemon || !user) return;

    // Verificar si tiene la bola específica
    if (user.inventory.pokeballs[tipoBola] <= 0) {
      alert(`No tienes Pokébolas de tipo: ${tipoBola}`);
      return;
    }

    const azarCaptura = Math.random() * 100;
    let exito = false;

    // Lógica de Probabilidades según tus reglas:
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

    // Descontar la bola usada y procesar resultado
    setUser(prev => {
      if (!prev) return null;
      const newInv = { ...prev.inventory };
      newInv.pokeballs[tipoBola] -= 1;
      return { ...prev, inventory: newInv };
    });

    if (exito) {
      addPokemon(pokemon);
      setMessage(`¡ÉXITO! ${pokemon.name.toUpperCase()} capturado con una Bola ${tipoBola}.`);
      setPokemon(null);
    } else {
      setMessage(`¡Rayos! El Pokémon rompió la bola y huyó...`);
      setPokemon(null);
    }

    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="busqueda-screen">
      <header className="busqueda-header">
        <Link to="/menu" className="back-link">⬅ Menú</Link>
        <div className="inventory-status">
          <span>⚾ {user?.inventory.pokeballs.sencilla}</span>
          <span>🔵 {user?.inventory.pokeballs.normal}</span>
          <span>🟣 {user?.inventory.pokeballs.maestra}</span>
        </div>
      </header>

      {message && <div className="status-message fade-in">{message}</div>}

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
                  Sencilla ({user?.inventory.pokeballs.sencilla})
                </button>
                <button onClick={() => intentarCapturar('normal')} disabled={user?.inventory.pokeballs.normal === 0}>
                  Normal ({user?.inventory.pokeballs.normal})
                </button>
                <button onClick={() => intentarCapturar('maestra')} disabled={user?.inventory.pokeballs.maestra === 0}>
                  Maestra ({user?.inventory.pokeballs.maestra})
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
  );
};

export default Busqueda;

