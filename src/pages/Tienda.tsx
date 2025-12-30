import React from 'react';
import { useUser } from '../context/UserContext';
import './Tienda.css';

const Tienda: React.FC = () => {
  const { user, setUser } = useUser();

  const handlePurchase = (category: string, itemType: string, subType: string, price: number) => {
    if (!user || user.gold < price) {
      alert("¡No tienes suficientes Gs!");
      return;
    }

    setUser(prev => {
      if (!prev) return null;
      const inv = { ...prev.inventory };
      if (category === 'pokeballs') {
        // @ts-ignore
        inv.pokeballs[subType] += 1;
      } else {
        // @ts-ignore
        inv.potions[itemType][subType] += 1;
      }
      return { ...prev, gold: prev.gold - price, inventory: inv };
    });
  };

  return (
    <div className="store-container">
      <header className="store-header">
        <h1>Tienda Pokémon</h1>
        <div className="gold-display">Saldo: {user?.gold} Gs</div>
      </header>

      <section className="store-section">
        <h2>Pokébolas</h2>
        <div className="item-grid">
          <div className="item-card">
            <span>Bola Sencilla (10 Gs)</span>
            <button onClick={() => handlePurchase('pokeballs', '', 'sencilla', 10)}>Comprar</button>
          </div>
          <div className="item-card">
            <span>Bola Normal (50 Gs)</span>
            <button onClick={() => handlePurchase('pokeballs', '', 'normal', 50)}>Comprar</button>
          </div>
          <div className="item-card">
            <span>Bola Maestra (120 Gs)</span>
            <button onClick={() => handlePurchase('pokeballs', '', 'maestra', 120)}>Comprar</button>
          </div>
        </div>
      </section>

      <section className="store-section">
        <h2>Pociones de Curación</h2>
        <div className="item-grid">
          <button onClick={() => handlePurchase('potions', 'healing', 'sencilla', 20)}>Sencilla (20 Gs)</button>
          <button onClick={() => handlePurchase('potions', 'healing', 'normal', 35)}>Normal (35 Gs)</button>
          <button onClick={() => handlePurchase('potions', 'healing', 'avanzada', 50)}>Avanzada (50 Gs)</button>
        </div>
      </section>
      
      {/* Repetir estructura para pociones de daño y resistencia... */}
      
      <button className="btn-exit" onClick={() => window.history.back()}>Salir de la Tienda</button>
    </div>
  );
};

export default Tienda;

