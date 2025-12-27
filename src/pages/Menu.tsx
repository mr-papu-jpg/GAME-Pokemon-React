import React from 'react';
import { useUser } from '../context/UserContext';

const Menu: React.FC = () => {
  const { user } = useUser(); // Extraemos los datos del usuario

  return (
    <div>
      <h1>Bienvenido, Entrenador {user?.name}!</h1>
      <p>Nivel: {user?.level}</p>
      {/* Aquí irán tus botones de navegación */}
    </div>
  );
};

export default Menu;
