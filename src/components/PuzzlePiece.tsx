import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { PUZZLE_PIECES } from '../data/pieces';
import { useGameStore } from '../store/gameStore';

interface PuzzlePieceProps {
  pieceId: string;
  allComplete: boolean;
}

export function PuzzlePiece({ pieceId, allComplete }: PuzzlePieceProps) {
  const def = PUZZLE_PIECES.find((p) => p.id === pieceId)!;
  const piece = useGameStore((s) => s.pieces[pieceId]);
  const movePiece = useGameStore((s) => s.movePiece);
  const trySnapPiece = useGameStore((s) => s.trySnapPiece);
  const [isDragging, setIsDragging] = useState(false);
  const [snapPulse, setSnapPulse] = useState(false);
  const draggingRef = useRef(false);
  const wasSnappedRef = useRef(piece.snapped);
  const origin = useRef({ x: 0, y: 0, px: 0, py: 0 });

  useEffect(() => {
    if (piece.snapped && !wasSnappedRef.current) {
      setSnapPulse(true);
      const timer = window.setTimeout(() => setSnapPulse(false), 420);
      wasSnappedRef.current = true;
      return () => window.clearTimeout(timer);
    }
    wasSnappedRef.current = piece.snapped;
  }, [piece.snapped]);

  const rotation = piece.snapped ? def.targetRotation : def.rotation;
  const left = `calc(50% + ${piece.x - def.width / 2}px)`;
  const top = `calc(50% + ${piece.y - def.height / 2}px)`;
  const zIndex = isDragging ? 50 : piece.snapped ? def.zIndex : def.zIndex + 10;

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (piece.snapped) return;
    e.preventDefault();
    e.stopPropagation();
    draggingRef.current = true;
    setIsDragging(true);
    origin.current = {
      x: e.clientX,
      y: e.clientY,
      px: piece.x,
      py: piece.y,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current || piece.snapped) return;
    const dx = e.clientX - origin.current.x;
    const dy = e.clientY - origin.current.y;
    movePiece(pieceId, origin.current.px + dx, origin.current.py + dy);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    setIsDragging(false);
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    trySnapPiece(pieceId);
  };

  return (
    <motion.div
      className={`puzzle-piece ${piece.snapped ? 'snapped' : ''} ${snapPulse ? 'snap-pulse' : ''} ${allComplete ? 'glow-complete' : ''} ${isDragging ? 'is-dragging' : ''}`}
      style={{
        width: def.width,
        height: def.height,
        left,
        top,
        rotate: rotation,
        zIndex,
      }}
      animate={
        snapPulse
          ? { scale: [1, 1.07, 0.98, 1] }
          : { scale: 1 }
      }
      transition={
        snapPulse
          ? { duration: 0.38, ease: [0.34, 1.45, 0.64, 1] }
          : { duration: 0.2 }
      }
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      whileTap={piece.snapped ? undefined : { scale: 1.02 }}
    >
      <img
        src={def.image}
        alt=""
        className="piece-img"
        draggable={false}
      />
    </motion.div>
  );
}
