import { useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore';

function randomBetween(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

/**
 * 電力不規則閃爍：穩定 2.5–5 秒、閃爍 4–7 秒（暗的時間較長）
 */
export function useFlicker() {
  const phase = useGameStore((s) => s.phase);
  const setLightsOn = useGameStore((s) => s.setLightsOn);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (phase !== 'playing') {
      setLightsOn(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      return;
    }

    let cancelled = false;

    const schedule = (stable: boolean) => {
      if (cancelled) return;
      setLightsOn(stable);
      const duration = stable
        ? randomBetween(2500, 5000)
        : randomBetween(4000, 7000);
      timeoutRef.current = setTimeout(() => schedule(!stable), duration);
    };

    schedule(true);

    return () => {
      cancelled = true;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [phase, setLightsOn]);
}
