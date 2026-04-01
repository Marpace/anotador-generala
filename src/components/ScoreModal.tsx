'use client';

import { useEffect, useRef } from 'react';
import { Category, Player, SCORE_OPTIONS } from '@/types/game';
import styles from './ScoreModal.module.scss';

interface Props {
  player: Player;
  category: Category;
  currentScore: number | string | null;
  onSave: (score: number | string | null) => void;
  onClose: () => void;
}

export function ScoreModal({ player, category, currentScore, onSave, onClose }: Props) {
  const options = SCORE_OPTIONS[category.key];
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  return (
    <div className={styles.overlay} ref={overlayRef} onClick={handleOverlayClick}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <div className={styles.info}>
            <span className={styles.playerName}>{player.name}</span>
            <h3 className={styles.categoryName}>{category.label}</h3>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M1 1L15 15M15 1L1 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <div className={styles.options}>
          {options.map((score) => (
            <button
              key={String(score)}
              className={`${styles.scoreOption} ${currentScore === score ? styles.selected : ''} ${score === 'TACHA' ? styles.zero : ''} ${score === 'SERVIDA' ? styles.winner : ''}`}
              onClick={() => {
                onSave(score);
                onClose();
              }}
            >
              <span className={styles.scoreValue}>{score}</span>
              {typeof score === 'number' && <span className={styles.scoreLabel}>pts</span>}
            </button>
          ))}
        </div>

        <button
          className={styles.clearBtn}
          onClick={() => {
            onSave(null);
            onClose();
          }}
        >
          Borrar anotación
        </button>
      </div>
    </div>
  );
}
