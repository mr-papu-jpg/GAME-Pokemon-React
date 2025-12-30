import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { Link } from 'react-router-dom';
import type { Pokemon } from '../interfaces/pokemonTypes';
import './Criadero.css';

const Criadero: React.FC = () => {
  const { user, setUser } = useUser();
  const [selectedPoke, setSelectedPoke] = useState<Pokemon | null>(null);

  if (!user) return <p>Cargando datos del entrenador...</p>;

  // Función para aplicar la curación
  const handleHeal = (type: 'sencilla' | 'normal' | 'avanzada') => {
    if (!selectedPoke || !user) return;

    const inventory = user.inventory.potions.healing;
    if (inventory[type] <= 0) return alert("No tienes esta poción");

    const maxHp = selectedPoke.stats[0].base_stat * 2;
    const currentHp = selectedPoke.currentHp ?? maxHp;

    if (currentHp >= maxHp) return alert("El Pokémon ya está sano");

    let healAmount = 0;
    if (type === 'sencilla') healAmount = 20;
    if (type === 'normal') healAmount = 50;
    if (type === 'avanzada') healAmount = 999;

    // Realizamos la actualización
    setUser(prev => {
        if (!prev) return null;

        const newInventory = { ...prev.inventory };
        newInventory.potions.healing[type] -= 1;

        const newTeam = prev.pokemonTeam.map(p => {
            if (p.id === selectedPoke.id) {
                const updatedHp = Math.min(maxHp, (p.currentHp ?? maxHp) + healAmount);
                // IMPORTANTE: No actualices estados locales (como setSelectedPoke) aquí dentro
                return { ...p, currentHp: updatedHp };
            }
            return p;
        });

        return { ...prev, inventory: newInventory, pokemonTeam: newTeam };
    });

    // Cerramos el modal o reseteamos la selección DESPUÉS del setUser para evitar el conflicto
    setSelectedPoke(null); 
    alert("¡Pokémon curado!");
  };


  return (
    <div className="criadero-screen">
      <header className="criadero-header">
        <Link to="/menu" className="back-btn">⬅ Volver</Link>
        <Link to="/busqueda" className="nav-btn btn-hunt">🌿 Ir a Buscar</Link>
        <h1>Mi Criadero</h1>
        <p>Tienes {user.pokemonTeam.length} Pokémon en tu colección</p>
      </header>

      <div className="pokemon-grid">
        {user.pokemonTeam.length === 0 ? (
          <div className="empty-msg">
            <p>Aún no has capturado ningún Pokémon...</p>
            <Link to="/busqueda" className="go-search-btn">Ir a buscar</Link>
          </div>
        ) : (
          user.pokemonTeam.map((poke, index) => {
            const maxHp = poke.stats[0].base_stat * 2;
            const currentHp = poke.currentHp ?? maxHp;
            const hpPercentage = (currentHp / maxHp) * 100;

            return (
              <div 
                key={`${poke.id}-${index}`} 
                className={`mini-pokemon-card ${currentHp === 0 ? 'fainted' : ''}`}
                onClick={() => setSelectedPoke(poke)}
              >
                <img src={poke.sprites.front_default} alt={poke.name} />
                <h3>{poke.name}</h3>
                
                {/* Barra de Vida Visual */}
                <div className="hp-bar-container">
                  <div 
                    className="hp-bar-fill" 
                    style={{ 
                      width: `${hpPercentage}%`,
                      backgroundColor: hpPercentage < 30 ? '#ff5252' : '#4caf50' 
                    }}
                  ></div>
                </div>
                <span className="hp-text">{currentHp} / {maxHp} HP</span>

                <div className="mini-types">
                  {poke.types.map((t: any) => (
                    <span key={t.type.name} className={`mini-type ${t.type.name}`}>
                      {t.type.name}
                    </span>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* MODAL DE CURACIÓN */}
      {selectedPoke && (
        <div className="modal-overlay" onClick={() => setSelectedPoke(null)}>
          <div className="heal-modal" onClick={e => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setSelectedPoke(null)}>X</button>
            <img src={selectedPoke.sprites.front_default} alt="heal" />
            <h2>Curar a {selectedPoke.name.toUpperCase()}</h2>
            
            <div className="potion-list">
              <button 
                onClick={() => handleHeal('sencilla')}
                disabled={user.inventory.potions.healing.sencilla === 0 || (selectedPoke.currentHp || 0) >= (selectedPoke.stats[0].base_stat * 2)}
              >
                Poción (20 HP) - Tienes: {user.inventory.potions.healing.sencilla}
              </button>
              
              <button 
                onClick={() => handleHeal('normal')}
                disabled={user.inventory.potions.healing.normal === 0 || (selectedPoke.currentHp || 0) >= (selectedPoke.stats[0].base_stat * 2)}
              >
                Súper Poción (50 HP) - Tienes: {user.inventory.potions.healing.normal}
              </button>
              
              <button 
                onClick={() => handleHeal('avanzada')}
                disabled={user.inventory.potions.healing.avanzada === 0 || (selectedPoke.currentHp || 0) >= (selectedPoke.stats[0].base_stat * 2)}
              >
                Poción Máxima (Full) - Tienes: {user.inventory.potions.healing.avanzada}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Criadero;

