import React from 'react';
import { useUser } from '../context/UserContext';
import { Link } from 'react-router-dom';
import './Criadero.css';

const Criadero: React.FC = () => {
  const { user } = useUser();

  return (
    <div className="criadero-screen">
      <header className="criadero-header">
        <Link to="/menu" className="back-btn">⬅ Volver</Link>
        <h1>Mi Criadero</h1>
        <p>Tienes {user?.pokemonTeam.length} Pokémon en tu colección</p>
      </header>
      <div className="pokemon-grid">
        {user?.pokemonTeam.length === 0 ? (
            <div className="empty-msg">
                <p>Aún no has capturado ningún Pokémon...</p>
                <Link to="/busqueda" className="go-search-btn">Ir a buscar</Link>
            </div>
        ) : (
        /* Fíjate en el uso de (poke, index) => ( ... ) con paréntesis */
        user?.pokemonTeam.map((poke, index) => (
        <div key={`${poke.id}-${index}`} className="mini-pokemon-card">
            <img src={poke.sprites.front_default} alt={poke.name} />
            <h3 style={{ color: '#333' }}>{poke.name}</h3>
            <div className="mini-types">
            {poke.types.map((t: any) => (
                <span key={t.type.name} className={`mini-type ${t.type.name}`}>
                {t.type.name}
                </span>
            ))}
            </div>
        </div>
        ))
        )}
    </div>

    </div>
  );
};

export default Criadero;

