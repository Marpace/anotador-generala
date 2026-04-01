'use client';

import { useState, useEffect, useCallback } from 'react';
import { GameState, Player, CategoryKey } from '@/types/game';
import { createPlayer, generateId } from '@/utils/game';

const STORAGE_KEY = 'generala_game_state';

const defaultState: GameState = {
  players: [],
  started: false,
  finished: false,
};

export function useGameState() {
  const [state, setState] = useState<GameState>(defaultState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setState(JSON.parse(saved));
      }
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {}
  }, [state, hydrated]);

  const addPlayer = useCallback((name: string) => {
    setState((prev) => ({
      ...prev,
      players: [...prev.players, createPlayer(generateId(), name)],
    }));
  }, []);

  const removePlayer = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      players: prev.players.filter((p) => p.id !== id),
    }));
  }, []);

  const updatePlayerName = useCallback((id: string, name: string) => {
    setState((prev) => ({
      ...prev,
      players: prev.players.map((p) =>
        p.id === id ? { ...p, name } : p
      ),
    }));
  }, []);

  const startGame = useCallback(() => {
    setState((prev) => ({ ...prev, started: true }));
  }, []);

  const setScore = useCallback(
    (playerId: string, category: CategoryKey, score: number | string | null) => {
      setState((prev) => ({
        ...prev,
        players: prev.players.map((p) =>
          p.id === playerId
            ? { ...p, scores: { ...p.scores, [category]: score } }
            : p
        ),
      }));
    },
    []
  );

  const resetGame = useCallback(() => {
    setState(defaultState);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }, []);

  const newGame = useCallback(() => {
    setState((prev) => ({
      ...prev,
      started: false,
      finished: false,
      players: prev.players.map((p) => {
        const scores: Record<string, null> = {};
        Object.keys(p.scores).forEach((k) => {
          scores[k] = null;
        });
        return { ...p, scores };
      }),
    }));
  }, []);

  return {
    state,
    hydrated,
    addPlayer,
    removePlayer,
    updatePlayerName,
    startGame,
    setScore,
    resetGame,
    newGame,
  };
}
