import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { Pokemon, User } from '../interfaces/pokemonTypes';


// 1. Definimos qué datos tendrá nuestro Usuario
interface User {
  name: string;
  level: number;
  pokemonTeam: any[]; // Luego cambiaremos 'any' por nuestra interface Pokemon
}

// 2. Definimos qué funciones y datos expondrá el Contexto
interface UserContextType {
  user: User | null;
  login: (userData: User) => void;
  addPokemon: (pokemon: Pokemon) => void;
  logout: () => void;
  addExperience: (amount: number) => void;
}


// 3. Creamos el contexto con un valor inicial indefinido
const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // --- Lee del LocalStorage al iniciar ---
  const [user, setUser] = useState<User | null>(() => {
    const savedData = localStorage.getItem('poke_app_user');
    return savedData ? JSON.parse(savedData) : null;
  });

  // --- Guarda automáticamente cuando el estado 'user' cambie ---
  useEffect(() => {
    if (user) {
      localStorage.setItem('poke_app_user', JSON.stringify(user));
      
      // OPCIONAL: Actualizar también la lista global de cuentas para que el progreso se guarde ahí
      const allAccounts: User[] = JSON.parse(localStorage.getItem('pokemon_accounts') || '[]');
      const index = allAccounts.findIndex(acc => acc.name === user.name);
      if (index !== -1) {
        allAccounts[index] = user;
        localStorage.setItem('pokemon_accounts', JSON.stringify(allAccounts));
      }
    }
  }, [user]);

  // AHORA login recibe el objeto User completo para ser coherente con la selección de cuentas
  const login = (userData: User) => {
    setUser(userData);
  };

  const addExperience = (amount: number) => {
    setUser(prev => {
      if (!prev) return null;
      // Usamos 0 si experience es undefined para evitar errores NaN
      let currentExp = prev.experience || 0; 
      let newExp = currentExp + amount;
      let newLevel = prev.level;

      const nextLevelXP = 100 * Math.pow(15, newLevel - 1);

      if (newExp >= nextLevelXP) {
        newLevel++;
        alert(`¡Subiste al nivel ${newLevel}!`);
      }

      return { ...prev, experience: newExp, level: newLevel };
    });
  };

  const addPokemon = (pokemon: Pokemon) => {
    setUser((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        pokemonTeam: [...prev.pokemonTeam, pokemon]
      };
    });
  };

  const logout = () => {
    localStorage.removeItem('poke_app_user');
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, login, addPokemon, logout, addExperience }}>
      {children}
    </UserContext.Provider>
  );
};


// 5. Hook personalizado para usar el contexto fácilmente
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser debe usarse dentro de un UserProvider');
  }
  return context;
};

