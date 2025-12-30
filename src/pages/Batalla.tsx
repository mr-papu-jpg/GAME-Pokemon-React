import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import './Batalla.css';

const Batalla: React.FC = () => {
    // Extraemos setUser para poder actualizar el oro y experiencia directamente
    const { user, setUser, addExperience } = useUser();
    const navigate = useNavigate();

    // Estados del Enemigo
    const [enemy, setEnemy] = useState<any>(null);
    const [enemyHP, setEnemyHP] = useState(0);
    const [enemyMaxHP, setEnemyMaxHP] = useState(0);

    // Estados de mi Pokémon
    const [myActivePkmn, setMyActivePkmn] = useState<any>(null);
    const [myHP, setMyHP] = useState(0);
    const [myMaxHP, setMyMaxHP] = useState(0);

    // Estados de Flujo
    const [isSelecting, setIsSelecting] = useState(true);
    const [battleLog, setBattleLog] = useState<string>("¡Un Pokémon salvaje ha aparecido!");
    const [isPlayerTurn, setIsPlayerTurn] = useState(true);
    const [isGameOver, setIsGameOver] = useState(false);

    // 1. Cargar enemigo al iniciar
    useEffect(() => {
        const fetchEnemy = async () => {
            try {
                const randomId = Math.floor(Math.random() * 151) + 1;
                const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
                setEnemy(res.data);
                const hp = res.data.stats[0].base_stat * 2;
                setEnemyHP(hp);
                setEnemyMaxHP(hp);
            } catch (error) {
                console.error("Error cargando enemigo", error);
            }
        };
        fetchEnemy();
    }, []);

    // 2. Función para seleccionar Pokémon del criadero
    const handleSelectPokemon = (poke: any) => {
        setMyActivePkmn(poke);
        const hp = poke.stats[0].base_stat * 2;
        setMyHP(hp);
        setMyMaxHP(hp);
        setIsSelecting(false);
        setBattleLog(`¡Adelante, ${poke.name.toUpperCase()}!`);
    };

    // 3. Lógica de Ataque del Jugador
    const handleAttack = () => {
        if (!isPlayerTurn || isGameOver || !myActivePkmn) return;

        const damage = Math.floor((myActivePkmn.stats[1].base_stat / 5) + Math.random() * 10);
        const newEnemyHP = Math.max(0, enemyHP - damage);
        setEnemyHP(newEnemyHP);
        setBattleLog(`¡${myActivePkmn.name.toUpperCase()} usó Ataque y causó ${damage} de daño!`);

        if (newEnemyHP === 0) {
            winBattle();
        } else {
            setIsPlayerTurn(false);
            setTimeout(enemyAttack, 1200);
        }
    };

    // 4. Lógica de Ataque del Enemigo
    const enemyAttack = () => {
        if (isGameOver || !enemy) return;

        const damage = Math.floor((enemy.stats[1].base_stat / 6) + Math.random() * 8);
        const newMyHP = Math.max(0, myHP - damage);
        setMyHP(newMyHP);
        setBattleLog(`¡El ${enemy.name.toUpperCase()} salvaje contraataca y causa ${damage} de daño!`);

        if (newMyHP === 0) {
            loseBattle();
        } else {
            setIsPlayerTurn(true);
        }
    };

    const winBattle = () => {
        setIsGameOver(true);
        setBattleLog(`¡Has derrotado a ${enemy.name.toUpperCase()}!`);

        // Lógica de rareza basada en Experiencia Base de la API
        // Común: < 100 XP, Raro: 100-199 XP, Legendario: > 200 XP
        let goldGained = 12; 
        const baseExp = enemy.base_experience || 50;

        if (baseExp >= 200) {
            goldGained = 120; // Legendario
        } else if (baseExp >= 100) {
            goldGained = 31;  // Raro
        }

        // Actualizamos el estado global del usuario (Oro y XP)
        setUser(prev => {
            if (!prev) return null;
            return {
                ...prev,
                gold: (prev.gold || 0) + goldGained,
                experience: prev.experience + baseExp
            };
        });

        setTimeout(() => {
            alert(`¡Victoria!\n+${baseExp} XP\n+${goldGained} Gs`);
            navigate('/menu');
        }, 2000);
    };

    const loseBattle = () => {
        setIsGameOver(true);
        setBattleLog(`¡Tu Pokémon ha caído!`);
        setTimeout(() => {
            alert("Has perdido la batalla...");
            navigate('/menu');
        }, 2000);
    };

    return (
        <div className="battle-screen">
            {/* Indicador de Oro superior */}
            <div className="battle-gold-status">{user?.gold || 0} Gs</div>

            {/* MODAL DE SELECCIÓN */}
            {isSelecting && (
                <div className="selection-overlay">
                    <div className="selection-content">
                        <h2>Selecciona tu Pokémon</h2>
                        <div className="pokemon-grid">
                            {user?.pokemonTeam && user.pokemonTeam.length > 0 ? (
                                user.pokemonTeam.map((poke, index) => (
                                    <div key={index} className="poke-option" onClick={() => handleSelectPokemon(poke)}>
                                        <img src={poke.sprites.front_default} alt={poke.name} />
                                        <p>{poke.name.toUpperCase()}</p>
                                        <span>HP: {poke.stats[0].base_stat * 2}</span>
                                    </div>
                                ))
                            ) : (
                                <p>No tienes Pokémon en tu equipo.</p>
                            )}
                        </div>
                        <button className="btn-cancel" onClick={() => navigate('/menu')}>Escapar</button>
                    </div>
                </div>
            )}

            {/* ÁREAS DE COMBATE */}
            <div className={`battle-layout ${isSelecting ? 'blur' : ''}`}>
                <div className="enemy-side">
                    {enemy && (
                        <div className="pokemon-display">
                            <div className="hp-container">
                                <p className="pkmn-name">{enemy.name.toUpperCase()}</p>
                                <div className="hp-bar-bg">
                                    <div className="hp-bar-fill" style={{ width: `${(enemyHP / enemyMaxHP) * 100}%` }}></div>
                                </div>
                                <small>{enemyHP} / {enemyMaxHP}</small>
                            </div>
                            <img src={enemy.sprites.front_default} alt="enemy" className="enemy-img" />
                        </div>
                    )}
                </div>

                <div className="player-side">
                    {myActivePkmn && (
                        <div className="pokemon-display">
                            <img src={myActivePkmn.sprites.back_default || myActivePkmn.sprites.front_default} alt="mine" className="player-img" />
                            <div className="hp-container">
                                <p className="pkmn-name">{myActivePkmn.name.toUpperCase()}</p>
                                <div className="hp-bar-bg">
                                    <div className="hp-bar-fill player-hp" style={{ width: `${(myHP / myMaxHP) * 100}%` }}></div>
                                </div>
                                <small>{myHP} / {myMaxHP}</small>
                            </div>
                        </div>
                    )}
                </div>

                {/* LOG Y CONTROLES */}
                <div className="battle-footer">
                    <div className="battle-log">
                        <p>{battleLog}</p>
                    </div>
                    {!isGameOver && !isSelecting && (
                        <div className="battle-actions">
                            <button className="atk-btn" onClick={handleAttack} disabled={!isPlayerTurn}>ATACAR</button>
                            <button className="run-btn" onClick={() => navigate('/menu')}>HUIR</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Batalla;

