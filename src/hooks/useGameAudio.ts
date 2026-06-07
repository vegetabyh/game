import { useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore';
import {
  playDinoGrowl,
  preloadGameSounds,
  resumeBackgroundMusic,
} from '../utils/gameSounds';

function createTickSound(ctx: AudioContext): () => void {
  return () => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 880;
    osc.type = 'sine';
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.08);
  };
}

function createGrowlAmbience(
  getTimeLeft: () => number,
  isPlaying: () => boolean,
): { start: () => void; stop: () => void } {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  const scheduleNext = () => {
    if (!isPlaying()) return;

    const timeLeft = getTimeLeft();
    const urgent = timeLeft <= 8;
    const minDelay = urgent ? 2500 : 4000;
    const maxDelay = urgent ? 4500 : 8000;
    const delay = minDelay + Math.random() * (maxDelay - minDelay);

    timeoutId = setTimeout(() => {
      if (!isPlaying()) return;
      playDinoGrowl();
      scheduleNext();
    }, delay);
  };

  return {
    start: () => {
      if (timeoutId) return;
      const firstDelay = 1200 + Math.random() * 1800;
      timeoutId = setTimeout(() => {
        if (!isPlaying()) return;
        playDinoGrowl();
        scheduleNext();
      }, firstDelay);
    },
    stop: () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = null;
    },
  };
}

function createCrawlAmbience(ctx: AudioContext): { start: () => void; stop: () => void } {
  let intervalId: ReturnType<typeof setInterval> | null = null;

  const playScrape = () => {
    const bufferSize = ctx.sampleRate * 0.15;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize) * 0.04;
    }
    const source = ctx.createBufferSource();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();
    source.buffer = buffer;
    filter.type = 'lowpass';
    filter.frequency.value = 400;
    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    gain.gain.value = 0.25;
    source.start();
  };

  return {
    start: () => {
      if (intervalId) return;
      intervalId = setInterval(
        () => {
          if (Math.random() > 0.65) playScrape();
        },
        4000 + Math.random() * 5000,
      );
    },
    stop: () => {
      if (intervalId) clearInterval(intervalId);
      intervalId = null;
    },
  };
}

export function useGameAudio() {
  const phase = useGameStore((s) => s.phase);
  const timeLeft = useGameStore((s) => s.timeLeft);

  useEffect(() => {
    preloadGameSounds();
  }, []);
  const ctxRef = useRef<AudioContext | null>(null);
  const tickRef = useRef<(() => void) | null>(null);
  const crawlRef = useRef<{ start: () => void; stop: () => void } | null>(null);
  const growlRef = useRef<{ start: () => void; stop: () => void } | null>(null);
  const prevTimeRef = useRef(timeLeft);

  useEffect(() => {
    if (phase !== 'playing') {
      crawlRef.current?.stop();
      growlRef.current?.stop();
      return;
    }

    if (!ctxRef.current) {
      ctxRef.current = new AudioContext();
      tickRef.current = createTickSound(ctxRef.current);
      crawlRef.current = createCrawlAmbience(ctxRef.current);
      growlRef.current = createGrowlAmbience(
        () => useGameStore.getState().timeLeft,
        () => useGameStore.getState().phase === 'playing',
      );
    }
    const ctx = ctxRef.current;
    if (ctx.state === 'suspended') void ctx.resume();
    crawlRef.current?.start();
    growlRef.current?.start();

    return () => {
      crawlRef.current?.stop();
      growlRef.current?.stop();
    };
  }, [phase]);

  useEffect(() => {
    if (phase !== 'playing') return;
    if (timeLeft < prevTimeRef.current && timeLeft > 0) {
      tickRef.current?.();
    }
    prevTimeRef.current = timeLeft;
  }, [timeLeft, phase]);

  useEffect(() => {
    if (phase === 'won' || phase === 'lost') {
      crawlRef.current?.stop();
      growlRef.current?.stop();
    }
  }, [phase]);

  useEffect(() => {
    resumeBackgroundMusic();
  }, [phase]);
}
