import { Player, CATEGORIES, CategoryKey } from '@/types/game';

export function calculateTotal(player: Player): number {
  return CATEGORIES.reduce((sum, cat) => {
    const val = player.scores[cat.key];
    return sum + (val !== null && val !== undefined ? val : 0);
  }, 0);
}

export function isGameComplete(players: Player[]): boolean {
  return players.every((player) =>
    CATEGORIES.every(
      (cat) =>
        player.scores[cat.key] !== null &&
        player.scores[cat.key] !== undefined
    )
  );
}

export function getWinner(players: Player[]): Player | null {
  if (players.length === 0) return null;
  return players.reduce((best, current) =>
    calculateTotal(current) > calculateTotal(best) ? current : best
  );
}

export function createPlayer(id: string, name: string): Player {
  const scores: Record<string, null> = {};
  CATEGORIES.forEach((cat) => {
    scores[cat.key] = null;
  });
  return { id, name, scores };
}

export function generateId(): string {
  return Math.random().toString(36).slice(2, 9);
}

export function isCategoryAvailable(player: Player, key: CategoryKey): boolean {
  return (
    player.scores[key] === null || player.scores[key] === undefined
  );
}
