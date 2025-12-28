import React, { useState } from 'react';
import axios from 'axios';
import { Pokemon } from '../type'; // Importamos la interfaz que creamos antes
import { useUser } from '../context/UserContext';
import './Busqueda.css';

const Busqueda: React.FC = () => {
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [rarity, setRarity] = useState<string>('');
  const { user } = useUser();

  const buscarPokemonAleatorio = async () => {
    setLoading(true);
    setPokemon(null);
    
    // --- LÓGICA DE PROBABILIDAD ---
    const azar = Math.random() * 100;
    let minId = 1;
    let maxId = 1025;

    if (azar < 70) {
      // 70% de probabilidad: Comunes
      maxId = 500;
      setRarity('COMÚN');
    } else if (azar < 95) {
      // 25% de probabilidad: Raros (70 + 25 = 95)
      minId = 501;
      maxId = 800;
      setRarity('RARO ✨');
    } else {
      // 5% de probabilidad: Legendarios
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="busqueda-screen">
      <h1>Zona de Hierba Alta</h1>
      <p>Entrenador {user?.name}, ¿qué encontrarás hoy?</p>

      <div className="encounter-area">
        {loading && <div className="loader">Buscando entre la hierba...</div>}

        {pokemon && (
          <div className={`pokemon-card ${rarity.toLowerCase()}`}>
            <span className="rarity-label">{rarity}</span>
            <img src={pokemon.sprites.front_default} alt={pokemon.name} />
            <h2>{pokemon.name.toUpperCase()}</h2>
            <div className="types">
              {pokemon.types.map(t => (
                <span key={t.type.name} className={`type ${t.type.name}`}>
                  {t.type.name}
                </span>
              ))}
            </div>
            <button className="catch-btn">Intentar Capturar</button>
          </div>
        )}
      </div>

      <button 
        className="search-btn" 
        onClick={buscarPokemonAleatorio} 
        disabled={loading}
      >
        {loading ? 'Buscando...' : 'Explorar Hierba'}
      </button>
    </div>
  );
};

export default Busqueda;

