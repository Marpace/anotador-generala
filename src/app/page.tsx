'use client';

import { useGameState } from '@/hooks/useGameState';
import { SetupScreen } from '@/components/SetupScreen';
import { ScoreBoard } from '@/components/ScoreBoard';
import styles from './page.module.scss';

export default function Home() {
  const game = useGameState();

  if (!game.hydrated) {
    return (
      <div className={styles.loading}>
        <div className={styles.loadingDot} />
      </div>
    );
  }

  return (
    <main className={styles.main}>
      {!game.state.started ? (
        <SetupScreen
          players={game.state.players}
          onAddPlayer={game.addPlayer}
          onRemovePlayer={game.removePlayer}
          onUpdateName={game.updatePlayerName}
          onStart={game.startGame}
        />
      ) : (
        <ScoreBoard
          players={game.state.players}
          onSetScore={game.setScore}
          onNewGame={game.resetGame}
          onResetScores={game.newGame}
        />
      )}
    </main>
  );
}
