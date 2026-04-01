'use client';

import { useState, useMemo } from 'react';
import { Player, CATEGORIES, Category, CategoryKey } from '@/types/game';
import { calculateTotal, getWinner, isGameComplete } from '@/utils/game';
import { ScoreModal } from './ScoreModal';
import styles from './ScoreBoard.module.scss';

interface ActiveCell {
  player: Player;
  category: Category;
}

interface Props {
  players: Player[];
  onSetScore: (playerId: string, category: CategoryKey, score: number | string | null) => void;
  onNewGame: () => void;
  onResetScores: () => void;
}

export function ScoreBoard({ players, onSetScore, onNewGame, onResetScores }: Props) {
  const [activeCell, setActiveCell] = useState<ActiveCell | null>(null);
  const [showConfirm, setShowConfirm] = useState<'new' | 'reset' | null>(null);
  const [showWinnerModal, setShowWinnerModal] = useState(true);
  const [currentPlayerIdx, setCurrentPlayerIdx] = useState(0);
  // Holds a pending cell click that was for a non-current player
  const [wrongPlayerPending, setWrongPlayerPending] = useState<ActiveCell | null>(null);

  const totals = useMemo(() => players.map(calculateTotal), [players]);
  const winner = useMemo(() => getWinner(players), [players]);
  const servidaWinner = useMemo(() =>
    players.find((p) => Object.values(p.scores).includes('SERVIDA')) ?? null,
  [players]);
  const gameComplete = useMemo(() => {
    const complete = !!servidaWinner || isGameComplete(players);
    if (complete) setShowWinnerModal(true);
    return complete;
  }, [players, servidaWinner]);

  const currentPlayer = players[currentPlayerIdx] ?? players[0];

  const advanceTurn = () => {
    setCurrentPlayerIdx((idx) => (idx + 1) % players.length);
  };

  const handleCellClick = (player: Player, category: Category) => {
    if (player.id !== currentPlayer?.id) {
      // Not the current player — ask for confirmation first
      setWrongPlayerPending({ player, category });
      return;
    }
    setActiveCell({ player, category });
  };

  const handleSaveScore = (score: number | string | null) => {
    if (!activeCell) return;
    onSetScore(activeCell.player.id, activeCell.category.key, score);
    if (score !== null && activeCell.player.id === currentPlayer?.id) advanceTurn();
    setActiveCell(null);
  };

  return (
    <div className={styles.wrapper}>
      {/* Header */}
      <header className={styles.header}>
        <h1 className={styles.logo}>GENERALA</h1>
        <div className={styles.actions}>
          {/* Current turn indicator + advance button */}
          {!gameComplete && currentPlayer && (
            <div className={styles.turnIndicator}>
              <span className={styles.turnLabel}>Turno:</span>
              <span className={styles.turnName}>{currentPlayer.name}</span>
              <button className={styles.nextTurnBtn} onClick={advanceTurn} title="Pasar turno">
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <path d="M2 6.5H11M7 2.5L11 6.5L7 10.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          )}
          <button className={styles.actionBtn} onClick={() => setShowConfirm('reset')}>
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
              <path d="M1.5 7.5C1.5 4.19 4.19 1.5 7.5 1.5c1.8 0 3.41.76 4.55 1.97L13.5 5H10V1.5l1.2 1.2A6 6 0 1 0 13.5 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className={styles.btnLabel}>Nueva ronda</span>
          </button>
          <button className={`${styles.actionBtn} ${styles.danger}`} onClick={() => setShowConfirm('new')}>
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
              <path d="M2 2L13 13M13 2L2 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span className={styles.btnLabel}>Nuevo juego</span>
          </button>
        </div>
      </header>

      {/* Winner modal */}
      {gameComplete && winner && showWinnerModal && (
        <div className={styles.confirmOverlay} onClick={() => {}}>
          <div className={styles.confirmDialog} onClick={(e) => e.stopPropagation()}>
            <div className={styles.wrongPlayerIcon}>🏆</div>
            <h3 className={styles.confirmTitle}>
              ¡{winner.name} ganó!
            </h3>
            <p className={styles.confirmText}>
              {servidaWinner
                ? <>Generala Servida 🎲</>
                : <>{calculateTotal(winner)} puntos</>
              }
            </p>
            <div className={styles.confirmActions}>
              <button className={styles.cancelBtn} onClick={() => setShowWinnerModal(false)}>
                Volver
              </button>
              <button className={styles.cancelBtn} onClick={() => setShowConfirm('reset')}>
                Nueva ronda
              </button>
              <button className={styles.confirmBtn} onClick={() => setShowConfirm('new')}>
                Nuevo juego
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table container */}
      <div className={styles.tableContainer}>
        <div
          className={styles.tableInner}
          style={{ '--player-count': players.length } as React.CSSProperties}
        >
          {/* Player headers */}
          <div className={styles.tableHead}>
            <div className={styles.labelCell} />
            {players.map((p, i) => {
              const isCurrent = p.id === currentPlayer?.id && !gameComplete;
              const isWinner = winner?.id === p.id && gameComplete;
              return (
                <div
                  key={p.id}
                  className={[
                    styles.playerHeader,
                    isCurrent ? styles.currentHeader : '',
                    isWinner ? styles.winnerHeader : '',
                  ].join(' ')}
                >
                  {isCurrent && <span className={styles.currentDot} />}
                  <span className={styles.playerNum}>{i + 1}</span>
                  <span className={styles.playerName}>{p.name}</span>
                </div>
              );
            })}
          </div>

          {/* Category rows */}
          <div className={styles.tableBody}>
            {CATEGORIES.map((cat, catIdx) => (
              <div
                key={cat.key}
                className={`${styles.tableRow} ${cat.key === 'doubleGenerala' ? styles.specialRow : ''}`}
                style={{ '--row-index': catIdx } as React.CSSProperties}
              >
                <div className={styles.labelCell}>
                  <span className={styles.categoryLabel}>{cat.label}</span>
                  <span className={styles.maxScore}>{cat.maxScore}</span>
                </div>

                {players.map((player) => {
                  const score = player.scores[cat.key];
                  const hasScore = score !== null && score !== undefined;
                  const isZero = hasScore && score === 'TACHA';
                  const isCurrent = player.id === currentPlayer?.id && !gameComplete;

                  return (
                    <button
                      key={player.id}
                      className={[
                        styles.scoreCell,
                        hasScore ? styles.filled : styles.empty,
                        isZero ? styles.zeroed : '',
                        isCurrent ? styles.currentCol : styles.otherCol,
                      ].join(' ')}
                      onClick={() => handleCellClick(player, cat)}
                    >
                      {hasScore ? (
                        <span className={styles.scoreNum}>{score}</span>
                      ) : (
                        <span className={styles.emptyDot} />
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Totals row */}
          <div className={styles.totalsRow}>
            <div className={styles.labelCell}>
              <span className={styles.totalLabel}>TOTAL</span>
            </div>
            {players.map((p, i) => {
              const isCurrent = p.id === currentPlayer?.id && !gameComplete;
              const isWinner = winner?.id === p.id && gameComplete;
              return (
                <div
                  key={p.id}
                  className={[
                    styles.totalCell,
                    isCurrent ? styles.currentTotal : '',
                    isWinner ? styles.winnerTotal : '',
                  ].join(' ')}
                >
                  <span className={styles.totalValue}>{totals[i]}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Score Modal */}
      {activeCell && (
        <ScoreModal
          player={activeCell.player}
          category={activeCell.category}
          currentScore={activeCell.player.scores[activeCell.category.key] ?? null}
          onSave={handleSaveScore}
          onClose={() => setActiveCell(null)}
        />
      )}

      {/* Wrong player confirmation */}
      {wrongPlayerPending && (
        <div className={styles.confirmOverlay} onClick={() => setWrongPlayerPending(null)}>
          <div className={styles.confirmDialog} onClick={(e) => e.stopPropagation()}>
            <div className={styles.wrongPlayerIcon}>⚠️</div>
            <h3 className={styles.confirmTitle}>¿Jugador equivocado?</h3>
            <p className={styles.confirmText}>
              Es el turno de <strong>{currentPlayer?.name}</strong>, pero tocaste la columna de{' '}
              <strong>{wrongPlayerPending.player.name}</strong>.
              ¿Querés anotarle a <strong>{wrongPlayerPending.player.name}</strong> de todas formas?
            </p>
            <div className={styles.confirmActions}>
              <button className={styles.cancelBtn} onClick={() => setWrongPlayerPending(null)}>
                Cancelar
              </button>
              <button
                className={styles.confirmBtn}
                onClick={() => {
                  setActiveCell(wrongPlayerPending);
                  setWrongPlayerPending(null);
                }}
              >
                Sí, continuar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New game / reset confirm */}
      {showConfirm && (
        <div className={styles.confirmOverlay} onClick={() => setShowConfirm(null)}>
          <div className={styles.confirmDialog} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.confirmTitle}>
              {showConfirm === 'new' ? '¿Nuevo juego?' : '¿Nueva ronda?'}
            </h3>
            <p className={styles.confirmText}>
              {showConfirm === 'new'
                ? 'Se perderán todos los jugadores y puntajes.'
                : 'Se reiniciarán todos los puntajes, pero se mantienen los jugadores.'}
            </p>
            <div className={styles.confirmActions}>
              <button className={styles.cancelBtn} onClick={() => setShowConfirm(null)}>
                Cancelar
              </button>
              <button
                className={styles.confirmBtn}
                onClick={() => {
                  if (showConfirm === 'new') {
                    onNewGame();
                  } else {
                    onResetScores();
                    setCurrentPlayerIdx(0);
                  }
                  setShowConfirm(null);
                }}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
