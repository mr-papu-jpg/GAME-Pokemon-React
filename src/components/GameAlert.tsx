import React from 'react';
import './GameAlert.css';

interface GameAlertProps {
  message: string;
  onClose: () => void;
  type?: 'info' | 'success' | 'error' | 'victory';
}

const GameAlert: React.FC<GameAlertProps> = ({ message, onClose, type = 'info' }) => {
  return (
    <div className="game-alert-overlay" onClick={onClose}>
      <div className={`game-alert-box ${type}`} onClick={e => e.stopPropagation()}>
        <div className="game-alert-content">
          <p>{message}</p>
          <button className="game-alert-btn" onClick={onClose}>CONTINUAR</button>
        </div>
      </div>
    </div>
  );
};

export default GameAlert;

