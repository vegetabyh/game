import { create } from 'zustand';
import {
  GAME_DURATION,
  PUZZLE_PIECES,
  getSnapDistance,
  SNAP_THRESHOLD,
} from '../data/pieces';
import { playCompleteSound, playSnapSound } from '../utils/gameSounds';

export type GamePhase = 'intro' | 'playing' | 'won' | 'lost';

export interface PieceState {
  x: number;
  y: number;
  snapped: boolean;
}

interface GameStore {
  phase: GamePhase;
  timeLeft: number;
  lightsOn: boolean;
  pieces: Record<string, PieceState>;
  completedCount: number;
  showKey: boolean;

  startGame: () => void;
  resetToIntro: () => void;
  tick: () => void;
  setTimeLeft: (t: number) => void;
  setLightsOn: (on: boolean) => void;
  movePiece: (id: string, x: number, y: number) => void;
  trySnapPiece: (id: string) => void;
  checkWin: () => void;
}

function buildInitialPieces(): Record<string, PieceState> {
  return Object.fromEntries(
    PUZZLE_PIECES.map((p) => [
      p.id,
      { x: p.startX, y: p.startY, snapped: false },
    ]),
  );
}

function countSnapped(pieces: Record<string, PieceState>): number {
  return Object.values(pieces).filter((p) => p.snapped).length;
}

export const useGameStore = create<GameStore>((set, get) => ({
  phase: 'intro',
  timeLeft: GAME_DURATION,
  lightsOn: true,
  pieces: buildInitialPieces(),
  completedCount: 0,
  showKey: false,

  startGame: () =>
    set({
      phase: 'playing',
      timeLeft: GAME_DURATION,
      lightsOn: true,
      pieces: buildInitialPieces(),
      completedCount: 0,
      showKey: false,
    }),

  resetToIntro: () =>
    set({
      phase: 'intro',
      timeLeft: GAME_DURATION,
      lightsOn: true,
      pieces: buildInitialPieces(),
      completedCount: 0,
      showKey: false,
    }),

  tick: () => {
    const { phase, timeLeft } = get();
    if (phase !== 'playing') return;
    const next = timeLeft - 1;
    if (next <= 0) {
      set({ timeLeft: 0, phase: 'lost' });
      return;
    }
    set({ timeLeft: next });
  },

  setTimeLeft: (t) => set({ timeLeft: t }),
  setLightsOn: (on) => set({ lightsOn: on }),

  movePiece: (id, x, y) => {
    const { phase, pieces } = get();
    if (phase !== 'playing' || pieces[id]?.snapped) return;
    set({
      pieces: {
        ...pieces,
        [id]: { ...pieces[id], x, y },
      },
    });
  },

  trySnapPiece: (id) => {
    const def = PUZZLE_PIECES.find((p) => p.id === id);
    if (!def) return;
    const { pieces, phase } = get();
    if (phase !== 'playing' || pieces[id]?.snapped) return;

    const { x, y } = pieces[id];
    const dist = getSnapDistance(x, y, def.targetX, def.targetY);
    if (dist > SNAP_THRESHOLD) return;

    const updated = {
      ...pieces,
      [id]: { x: def.targetX, y: def.targetY, snapped: true },
    };
    set({
      pieces: updated,
      completedCount: countSnapped(updated),
    });
    playSnapSound();
    get().checkWin();
  },

  checkWin: () => {
    const { pieces, phase } = get();
    if (phase !== 'playing') return;
    const allDone = PUZZLE_PIECES.every((p) => pieces[p.id]?.snapped);
    if (allDone) {
      playCompleteSound();
      set({ phase: 'won', showKey: true });
    }
  },
}));
