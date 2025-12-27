import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const Login: React.FC = () => {
  const [name, setName] = useState<string>('');
  const navigate = useNavigate();
  const { login } = useUser();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      // Aquí guardaremos en Context después
      login(name); 
      navigate('/menu');
    }
  };

  return (
    <div className="login-container">
      <h1>Pokémon Odyssey</h1>
      <form onSubmit={handleLogin}>
        <input 
          type="text" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          placeholder="Nombre de Entrenador"
        />
        <button type="submit">Comenzar Aventura</button>
      </form>
    </div>
  );
};

export default Login;

