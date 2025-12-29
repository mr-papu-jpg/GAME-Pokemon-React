import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import type { User, Pokemon } from '../interfaces/pokemonTypes';
import './Login.css';

const Login: React.FC = () => {
  const [view, setView] = useState<'menu' | 'crear' | 'ingresar'>('menu');
  const [newName, setNewName] = useState('');
  const [savedAccounts, setSavedAccounts] = useState<User[]>([]);
  const { login } = useUser();
  const navigate = useNavigate();

  // Cargar cuentas del LocalStorage al iniciar
  useEffect(() => {
    const accounts = JSON.parse(localStorage.getItem('pokemon_accounts') || '[]');
    setSavedAccounts(accounts);
  }, []);

  const handleCreateAccount = () => {
    if (!newName.trim()) return alert("Escribe un nombre");
    
    const newUser: User = {
      name: newName,
      pokemonTeam: [],
      experience: 0,
      level: 1,
      currentStage: 1
    };

    const updatedAccounts = [...savedAccounts, newUser];
    localStorage.setItem('pokemon_accounts', JSON.stringify(updatedAccounts));
    login(newUser);
    navigate('/menu');
  };

  const handleSelectAccount = (user: User) => {
    login(user);
    navigate('/menu');
  };

  return (
    <div className="login-container">
      <h1 className="game-title">Simple Game Pokémon</h1>

      {view === 'menu' && (
        <div className="button-group">
          <button onClick={() => setView('crear')} className="btn-main">Crear Cuenta</button>
          <button onClick={() => setView('ingresar')} className="btn-main">Ingresar Cuenta</button>
        </div>
      )}

      {view === 'crear' && (
        <div className="form-group">
          <h2>Nuevo Entrenador</h2>
          <input 
            type="text" 
            placeholder="Tu nombre..." 
            value={newName} 
            onChange={(e) => setNewName(e.target.value)}
          />
          <button onClick={handleCreateAccount} className="btn-confirm">Empezar Aventura</button>
          <button onClick={() => setView('menu')} className="btn-back">Volver</button>
        </div>
      )}

      {view === 'ingresar' && (
        <div className="accounts-list">
          <h2>Selecciona tu Perfil</h2>
          {savedAccounts.length > 0 ? (
            savedAccounts.map((acc, idx) => (
              <div key={idx} className="account-card" onClick={() => handleSelectAccount(acc)}>
                <span>{acc.name}</span>
                <small>Nivel {acc.level} - Fase {acc.currentStage}</small>
              </div>
            ))
          ) : (
            <p>No hay cuentas creadas.</p>
          )}
          <button onClick={() => setView('menu')} className="btn-back">Volver</button>
        </div>
      )}
    </div>
  );
};

export default Login;

