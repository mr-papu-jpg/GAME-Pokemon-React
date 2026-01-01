import React, { useState, createContext, useContext, type ReactNode } from 'react';
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
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
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
  // Si es un usuario nuevo (no tiene inventario), le damos el kit inicial
  const completeUser = {
    ...userData,
    gold: userData.gold ?? 0,
    inventory: userData.inventory || {
      pokeballs: { sencilla: 3, normal: 0, maestra: 0 }, // 3 Pokebolas iniciales
      potions: {
        healing: { sencilla: 0, normal: 0, avanzada: 0 },
        damage: { sencilla: 0, normal: 0, avanzada: 0 },
        defense: { sencilla: 0, normal: 0, avanzada: 0 }
      }
    }
  };
  setUser(completeUser);
  };

  // Función para ganar/gastar Gs
  const updateGold = (amount: number) => {
    setUser(prev => prev ? { ...prev, gold: prev.gold + amount  } : null);
  };

// Función para comprar objetos
  const buyItem = (category: keyof Inventory, type: string, subType: string, price: number) => {
    setUser(prev => {
        if (!prev || prev.gold < price) return prev;
        const newInventory = { ...prev.inventory };
        // @ts-ignore (Para simplificar el acceso dinámico al objeto)
        newInventory[category][type][subType] += 1;
        return { ...prev, gold: prev.gold - price, inventory: newInventory };
    });
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
    const maxHp = pokemon.stats[0].base_stat * 2;
    const newPokemon = { ...pokemon, currentHp: maxHp }; // Nace con vida completa
  
    setUser(prev => {
        if (!prev) return null;
        return {
            ...prev,
            pokemonTeam: [...prev.pokemonTeam, newPokemon]
        };
    });
  };


  const logout = () => {
    localStorage.removeItem('poke_app_user');
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, setUser, login, addPokemon, logout, addExperience }}>
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

