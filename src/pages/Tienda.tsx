import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import GameAlert from '../components/GameAlert';
import './Tienda.css';

const Tienda: React.FC = () => {
  const { user, setUser } = useUser();

  // Estados para el GameAlert
  const [alertMsg, setAlertMsg] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<'info' | 'success' | 'error' | 'victory'>('info');

  const handlePurchase = (category: string, itemType: string, subType: string, price: number) => {
    if (!user) return;

    if (user.gold < price) {
      setAlertType('error');
      setAlertMsg("¡No tienes suficientes Gs para este artículo!");
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

    // Feedback de éxito
    setAlertType('success');
    setAlertMsg(`¡Has comprado ${subType.toUpperCase()} con éxito!`);
  };

  return (
    <div className={`store-container ${alertMsg ? 'blur' : ''}`}>
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
          <div className="item-card">
            <span>Sencilla (20 Gs)</span>
            <button onClick={() => handlePurchase('potions', 'healing', 'sencilla', 20)}>Comprar</button>
          </div>
          <div className="item-card">
            <span>Normal (35 Gs)</span>
            <button onClick={() => handlePurchase('potions', 'healing', 'normal', 35)}>Comprar</button>
          </div>
          <div className="item-card">
            <span>Avanzada (50 Gs)</span>
            <button onClick={() => handlePurchase('potions', 'healing', 'avanzada', 50)}>Comprar</button>
          </div>
        </div>
      </section>

      <button className="btn-exit" onClick={() => window.history.back()}>Salir de la Tienda</button>

      {/* Sistema de Alertas Globales */}
      {alertMsg && (
        <GameAlert 
          message={alertMsg} 
          type={alertType} 
          onClose={() => setAlertMsg(null)} 
        />
      )}
    </div>
  );
};

export default Tienda;

