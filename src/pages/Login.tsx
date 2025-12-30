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
  const [selectedStarter, setSelectedStarter] = useState<string | null>(null);
const starters = [
  { id: 1, name: 'Bulbasaur', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png' },
  { id: 4, name: 'Charmander', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png' },
  { id: 7, name: 'Squirtle', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png' }
];


  // Cargar cuentas del LocalStorage al iniciar
  useEffect(() => {
    const accounts = JSON.parse(localStorage.getItem('pokemon_accounts') || '[]');
    setSavedAccounts(accounts);
  }, []);

  const handleCreateAccount = async (starterId: number) => {
    if (!newName.trim()) return alert("Escribe un nombre");

    try {
        // Obtenemos los datos completos del inicial elegido
        const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${starterId}`);
        const starterPokemon = res.data;

        const newUser: User = {
            name: newName,
            pokemonTeam: [starterPokemon], // El equipo empieza con el elegido
            experience: 0,
            level: 1,
            currentStage: 1
        };

        const updatedAccounts = [...savedAccounts, newUser];
        localStorage.setItem('pokemon_accounts', JSON.stringify(updatedAccounts));
        login(newUser);
        navigate('/menu');
    } catch (error) {
        alert("Error al obtener el Pokémon inicial");
    }
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
                className="login-input"
            />
    
            <p>Elige tu compañero inicial:</p>
            <div className="starter-selector">
                {starters.map(s => (
                    <div key={s.id} className="starter-card" onClick={() => handleCreateAccount(s.id)}>
                        <img src={s.img} alt={s.name} />
                        <span>{s.name}</span>
                    </div>
                ))}
            </div>
    
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

