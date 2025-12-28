import React, { useState } from 'react';
import axios from 'axios';
import { useUser } from '../context/UserContext';
import type { Pokemon } from '../interfaces/pokemonTypes'; // Asegúrate que esta ruta sea la correcta
import './Busqueda.css';

const Busqueda: React.FC = () => {
  // 1. Estados
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [rarity, setRarity] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  // 2. Contexto
  const { user, addPokemon } = useUser();

  // 3. Función para buscar un Pokémon aleatorio
  const buscarPokemonAleatorio = async () => {
    setLoading(true);
    setPokemon(null);
    setMessage('');
    
    // Lógica de probabilidad de rareza
    const azar = Math.random() * 100;
    let minId = 1;
    let maxId = 1025;

    if (azar < 70) {
      maxId = 500;
      setRarity('COMÚN');
    } else if (azar < 95) {
      minId = 501;
      maxId = 800;
      setRarity('RARO ✨');
    } else {
      minId = 801;
      maxId = 1025;
      setRarity('LEGENDARIO 🔥');
    }

    const idFinal = Math.floor(Math.random() * (maxId - minId + 1)) + minId;

    try {
      const response = await axios.get<Pokemon>(`https://pokeapi.co/api/v2/pokemon/${idFinal}`);
      setPokemon(response.data);
    } catch (error) {
      console.error("Error buscando al Pokémon", error);
      setMessage('Hubo un error al buscar en la hierba...');
    } finally {
      setLoading(false);
    }
  };

  // 4. Función para intentar la captura
  const intentarCapturar = () => {
    if (!pokemon) return;

    const azarCaptura = Math.random() * 100;
    let exito = false;

    // Probabilidades por rareza
    if (rarity === 'COMÚN' && azarCaptura < 80) exito = true;
    else if (rarity === 'RARO ✨' && azarCaptura < 40) exito = true;
    else if (rarity === 'LEGENDARIO 🔥' && azarCaptura < 10) exito = true;

    if (exito) {
      addPokemon(pokemon);
      setMessage(`¡Genial! ${pokemon.name.toUpperCase()} fue capturado.`);
      setPokemon(null);
    } else {
      setMessage(`¡Oh no! ${pokemon.name.toUpperCase()} se escapó...`);
      setPokemon(null);
    }

    // Limpiar mensaje después de 3 segundos
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="busqueda-screen">
      <header>
        <h1>Zona de Hierba Alta</h1>
        <p>Entrenador: {user?.name} | Nivel: {user?.level}</p>
      </header>

      {message && <div className="status-message">{message}</div>}

      <div className="encounter-area">
        {loading && <div className="loader">Buscando entre la hierba...</div>}

        {pokemon && (
          <div className={`pokemon-card ${rarity.toLowerCase().replace(' ✨', '').replace(' 🔥', '')}`}>
            <span className="rarity-label">{rarity}</span>
            <img src={pokemon.sprites.front_default} alt={pokemon.name} />
            <h2 style={{ textTransform: 'capitalize' }}>{pokemon.name}</h2>
            
            <div className="types">
              {pokemon.types.map((t) => (
                <span key={t.type.name} className={`type ${t.type.name}`}>
                  {t.type.name}
                </span>
              ))}
            </div>

            <button className="catch-btn" onClick={intentarCapturar}>
              Lanzar Pokébola ⚾
            </button>
          </div>
        )}
      </div>

      {!loading && !pokemon && (
        <button className="search-btn" onClick={buscarPokemonAleatorio}>
          Explorar Hierba
        </button>
      )}
    </div>
  );
};

export default Busqueda;

