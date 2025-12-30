import React from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import './Menu.css';

const Menu: React.FC = () => {
  const { user } = useUser();

  return (
    <div className="menu-screen">
      <header className="menu-header">
        <div className="header-main">
          <h1>POKÉMON ODYSSEY</h1>
          <div className="gold-status">
            💰 {user?.gold || 0} <span className="gs-text">Gs</span>
          </div>
        </div>
        
        <div className="user-badge">
          <span>Entrenador: <strong>{user?.name}</strong></span>
          <span className="level">Lv. {user?.level}</span>
        </div>
      </header>

      <nav className="menu-grid">
        <Link title="buscar" to="/busqueda" className="menu-card search">
          <div className="icon">🔍</div>
          <span>Búsqueda</span>
        </Link>

        <Link title="criadero" to="/criadero" className="menu-card farm">
          <div className="icon">🥚</div>
          <span>Criadero</span>
        </Link>

        {/* NUEVO BOTÓN DE TIENDA */}
        <Link title="tienda" to="/tienda" className="menu-card shop">
          <div className="icon">🏪</div>
          <span>Tienda</span>
        </Link>

        <Link title="batalla" to="/batalla" className="menu-card battle">
          <div className="icon">⚔️</div>
          <span>Batalla</span>
        </Link>

        <Link title="competencia" to="/competencia" className="menu-card trophy">
          <div className="icon">🏆</div>
          <span>Competencia</span>
        </Link>
      </nav>
    </div>
  );
};

export default Menu;

