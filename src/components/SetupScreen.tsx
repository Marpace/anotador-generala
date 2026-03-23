'use client';

import { useState, useRef, KeyboardEvent } from 'react';
import { Player } from '@/types/game';
import styles from './SetupScreen.module.scss';

const MAX_PLAYERS = 12;
const MIN_PLAYERS = 2;

interface Props {
  players: Player[];
  onAddPlayer: (name: string) => void;
  onRemovePlayer: (id: string) => void;
  onUpdateName: (id: string, name: string) => void;
  onStart: () => void;
}

export function SetupScreen({
  players,
  onAddPlayer,
  onRemovePlayer,
  onUpdateName,
  onStart,
}: Props) {
  const [newName, setNewName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleAdd = () => {
    const name = newName.trim();
    if (!name || players.length >= MAX_PLAYERS) return;
    onAddPlayer(name);
    setNewName('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleAdd();
  };

  const canStart = players.length >= MIN_PLAYERS;

  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.diceIcon}>
            <span>⚄</span>
          </div>
          <h1 className={styles.title}>GENERALA</h1>
          <p className={styles.subtitle}>Anotador de puntos</p>
        </div>

        {/* Add Players */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Jugadores</h2>
            <span className={styles.playerCount}>
              {players.length} / {MAX_PLAYERS}
            </span>
          </div>

          <div className={styles.addRow}>
            <input
              ref={inputRef}
              className={styles.nameInput}
              type="text"
              placeholder="Nombre del jugador..."
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={handleKeyDown}
              maxLength={20}
              disabled={players.length >= MAX_PLAYERS}
            />
            <button
              className={styles.addBtn}
              onClick={handleAdd}
              disabled={!newName.trim() || players.length >= MAX_PLAYERS}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M9 3.5V14.5M3.5 9H14.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Agregar
            </button>
          </div>

          {/* Player list */}
          {players.length > 0 && (
            <ul className={styles.playerList}>
              {players.map((player, idx) => (
                <li key={player.id} className={styles.playerItem}>
                  <span className={styles.playerIndex}>{idx + 1}</span>
                  <input
                    className={styles.playerNameInput}
                    value={player.name}
                    onChange={(e) => onUpdateName(player.id, e.target.value)}
                    maxLength={20}
                  />
                  <button
                    className={styles.removeBtn}
                    onClick={() => onRemovePlayer(player.id)}
                    title="Eliminar jugador"
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}

          {players.length === 0 && (
            <div className={styles.emptyState}>
              <p>Agregá al menos {MIN_PLAYERS} jugadores para comenzar</p>
            </div>
          )}
        </div>

        {/* Start button */}
        <button
          className={styles.startBtn}
          onClick={onStart}
          disabled={!canStart}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M7 4L16 10L7 16V4Z" fill="currentColor"/>
          </svg>
          Comenzar Partida
        </button>

        {!canStart && players.length > 0 && (
          <p className={styles.hint}>
            Necesitás al menos {MIN_PLAYERS} jugadores
          </p>
        )}
      </div>
    </div>
  );
}
