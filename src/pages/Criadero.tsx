import React from 'react';
import { useUser } from '../context/UserContext';

const Criadero: React.FC = () => {
  const { user } = useUser();

  return (
    <div className="page-container">
      <h1>Tu Criadero</h1>
      <p>Entrenador {user?.name}, aquí están tus Pokémon capturados.</p>
      {/* Aquí mapearemos el pokemonTeam del context luego */}
    </div>
  );
};

export default Criadero;

