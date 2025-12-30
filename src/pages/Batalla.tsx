import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import './Batalla.css';

const Batalla: React.FC = () => {
    const { user, setUser } = useUser();
    const navigate = useNavigate();

    const [enemy, setEnemy] = useState<any>(null);
    const [enemyHP, setEnemyHP] = useState(0);
    const [enemyMaxHP, setEnemyMaxHP] = useState(0);

    const [myActivePkmn, setMyActivePkmn] = useState<any>(null);
    const [myHP, setMyHP] = useState(0);
    const [myMaxHP, setMyMaxHP] = useState(0);

    const [isSelecting, setIsSelecting] = useState(true);
    const [battleLog, setBattleLog] = useState<string>("¡Un Pokémon salvaje ha aparecido!");
    const [isPlayerTurn, setIsPlayerTurn] = useState(true);
    const [isGameOver, setIsGameOver] = useState(false);

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

    const handleSelectPokemon = (poke: any) => {
        // Validar si el Pokémon tiene vida antes de dejarlo entrar
        const currentHp = poke.currentHp !== undefined ? poke.currentHp : poke.stats[0].base_stat * 2;
        
        if (currentHp <= 0) {
            alert("¡Este Pokémon está debilitado y no puede luchar!");
            return;
        }

        setMyActivePkmn(poke);
        setMyHP(currentHp);
        setMyMaxHP(poke.stats[0].base_stat * 2);
        setIsSelecting(false);
        setBattleLog(`¡Adelante, ${poke.name.toUpperCase()}!`);
    };

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

    // Función unificada para guardar TODO el progreso
    const finalizeBattle = (finalMyHp: number, xpGained: number, goldGained: number) => {
        setUser(prev => {
            if (!prev) return null;
            
            const updatedTeam = prev.pokemonTeam.map(p => {
                // Importante comparar por el ID del pokemon activo
                if (p.id === myActivePkmn.id) {
                    return { ...p, currentHp: finalMyHp };
                }
                return p;
            });

            return {
                ...prev,
                gold: (prev.gold || 0) + goldGained,
                experience: prev.experience + xpGained,
                pokemonTeam: updatedTeam
            };
        });
    };

    const winBattle = () => {
        setIsGameOver(true);
        setBattleLog(`¡Has derrotado a ${enemy.name.toUpperCase()}!`);

        let goldGained = 12;
        const baseExp = enemy.base_experience || 50;

        if (baseExp >= 200) goldGained = 120;
        else if (baseExp >= 100) goldGained = 31;

        // Guardamos el HP actual (myHP) junto con los premios
        finalizeBattle(myHP, baseExp, goldGained);

        setTimeout(() => {
            alert(`¡Victoria!\n+${baseExp} XP\n+${goldGained} Gs`);
            navigate('/menu');
        }, 2000);
    };

    const loseBattle = () => {
        setIsGameOver(true);
        setBattleLog(`¡Tu Pokémon ha caído!`);

        // Al perder, el HP es 0. No ganamos XP ni Oro.
        finalizeBattle(0, 0, 0);

        setTimeout(() => {
            alert("Has perdido la batalla...");
            navigate('/menu');
        }, 2000);
    };

    return (
        <div className="battle-screen">
            <div className="battle-gold-status">{user?.gold || 0} Gs</div>

            {isSelecting && (
                <div className="selection-overlay">
                    <div className="selection-content">
                        <h2>Selecciona tu Pokémon</h2>
                        <div className="pokemon-grid">
                            {user?.pokemonTeam && user.pokemonTeam.length > 0 ? (
                                user.pokemonTeam.map((poke, index) => {
                                    const currentHp = poke.currentHp !== undefined ? poke.currentHp : poke.stats[0].base_stat * 2;
                                    const maxHp = poke.stats[0].base_stat * 2;
                                    return (
                                        <div 
                                            key={index} 
                                            className={`poke-option ${currentHp <= 0 ? 'disabled' : ''}`} 
                                            onClick={() => handleSelectPokemon(poke)}
                                        >
                                            <img src={poke.sprites.front_default} alt={poke.name} />
                                            <p>{poke.name.toUpperCase()}</p>
                                            <span>HP: {currentHp} / {maxHp}</span>
                                        </div>
                                    );
                                })
                            ) : (
                                <p>No tienes Pokémon en tu equipo.</p>
                            )}
                        </div>
                        <button className="btn-cancel" onClick={() => navigate('/menu')}>Escapar</button>
                    </div>
                </div>
            )}

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

