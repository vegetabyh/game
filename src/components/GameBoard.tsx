import { useEffect } from 'react';
import {
  DINO_DISPLAY_SIZE,
  DINO_OUTLINE_IMAGE,
  PUZZLE_PIECES,
} from '../data/pieces';
import { useGameStore } from '../store/gameStore';
import { PuzzlePiece } from './PuzzlePiece';

export function GameBoard() {
  const phase = useGameStore((s) => s.phase);
  const timeLeft = useGameStore((s) => s.timeLeft);
  const completedCount = useGameStore((s) => s.completedCount);
  const lightsOn = useGameStore((s) => s.lightsOn);
  const showKey = useGameStore((s) => s.showKey);
  const allComplete = phase === 'won';
  const progressPct = (completedCount / PUZZLE_PIECES.length) * 100;

  useEffect(() => {
    if (phase !== 'playing') return;

    const id = window.setInterval(() => {
      useGameStore.getState().tick();
    }, 1000);

    return () => window.clearInterval(id);
  }, [phase]);

  const sortedPieces = [...PUZZLE_PIECES].sort((a, b) => a.zIndex - b.zIndex);

  return (
    <div className="game-scene">
      <div className="scene-frame">
        <header className="hud">
          <div className="hud-brand">
            <span className="hud-badge">夜班</span>
            <div className="hud-title">恐龍展廳 · 緊急修復</div>
          </div>
          <div className="hud-stats">
            <span className={`hud-chip timer ${timeLeft <= 8 ? 'urgent' : ''}`}>
              <span className="chip-label">剩餘</span>
              <span className="chip-value">{timeLeft}s</span>
            </span>
            <span className="hud-chip progress-chip">
              <span className="chip-label">骨骼</span>
              <span className="chip-value">
                {completedCount}/{PUZZLE_PIECES.length}
              </span>
            </span>
            <span className={`hud-chip power ${lightsOn ? 'on' : 'flicker'}`}>
              <span className="chip-label">電力</span>
              <span className="chip-value">
                {lightsOn ? '穩定' : '閃爍'}
              </span>
            </span>
          </div>
        </header>

        <div className="repair-progress" aria-hidden>
          <div
            className="repair-progress-fill"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        <div
          id="game-board"
          className={`game-board ${lightsOn ? '' : 'is-flickering'}`}
        >
          <div className="museum-ambient" aria-hidden />
          <div className="spotlight spotlight-left" aria-hidden />
          <div className="spotlight spotlight-right" aria-hidden />
          <div className="pillar pillar-left" aria-hidden />
          <div className="pillar pillar-right" aria-hidden />

          <div className="display-case">
            <div className="case-plaque">
              <span className="plaque-id">展區 B-07</span>
              <span className="plaque-name">暴龍骨架修復台</span>
            </div>
            <div className="case-glass" aria-hidden />
            <div className="case-rail case-rail-top" aria-hidden />
            <div className="case-rail case-rail-bottom" aria-hidden />

            <div
              className="puzzle-layer"
              style={
                { '--dino-size': `${DINO_DISPLAY_SIZE}px` } as React.CSSProperties
              }
            >
              <div className="footprints" aria-hidden />
              <div className="center-mark" aria-hidden />
              <img
                src={DINO_OUTLINE_IMAGE}
                alt="恐龍骨架輪廓"
                className={`dino-outline ${allComplete ? 'complete' : ''}`}
                draggable={false}
              />

              {sortedPieces.map((p) => (
                <PuzzlePiece
                  key={p.id}
                  pieceId={p.id}
                  allComplete={allComplete}
                />
              ))}

              {showKey && (
                <div className="golden-key">
                  <span className="key-icon">🗝️</span>
                  <span className="key-text">鑰匙碎片</span>
                </div>
              )}
            </div>
          </div>

          <div className="floor-plate" aria-hidden />
          <div className="red-eyes" aria-hidden>
            <span className="eye left" />
            <span className="eye right" />
          </div>
        </div>
      </div>

      <div
        className={`flicker-overlay ${lightsOn ? 'hidden' : 'active'}`}
        aria-hidden={lightsOn}
      >
        <p className="flicker-hint">⚡ 電力不穩，閃爍中… 把握亮燈瞬間拖曳骨骼</p>
      </div>
    </div>
  );
}
