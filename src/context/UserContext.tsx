import React, { createContext, useContext, useState, ReactNode } from 'react';

// 1. Definimos qué datos tendrá nuestro Usuario
interface User {
  name: string;
  level: number;
  pokemonTeam: any[]; // Luego cambiaremos 'any' por nuestra interface Pokemon
}

// 2. Definimos qué funciones y datos expondrá el Contexto
interface UserContextType {
  user: User | null;
  login: (name: string) => void;
  logout: () => void;
}

// 3. Creamos el contexto con un valor inicial indefinido
const UserContext = createContext<UserContextType | undefined>(undefined);

// 4. Creamos el Proveedor (Provider)
export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (name: string) => {
    setUser({
      name,
      level: 1,
      pokemonTeam: [],
    });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
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

