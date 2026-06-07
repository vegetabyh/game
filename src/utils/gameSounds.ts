const ROAR_SRC = '/sound/roar.mp3';
const BGM_SRC = '/sound/bgmusic.mp3';

let ctx: AudioContext | null = null;
let roarAudio: HTMLAudioElement | null = null;
let bgmAudio: HTMLAudioElement | null = null;
let bgmStarted = false;
let bgmPreloaded = false;
let bgmPlayPromise: Promise<void> | null = null;

function getBgmAudio(): HTMLAudioElement {
  if (!bgmAudio) {
    bgmAudio = new Audio(BGM_SRC);
    bgmAudio.loop = true;
    bgmAudio.preload = 'auto';
    bgmAudio.volume = 0.32;
  }
  return bgmAudio;
}

function getCtx(): AudioContext {
  if (!ctx) ctx = new AudioContext();
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
}

function createNoiseBuffer(
  audioCtx: AudioContext,
  duration: number,
  decay = true,
): AudioBuffer {
  const bufferSize = Math.floor(audioCtx.sampleRate * duration);
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    const amp = decay ? 1 - i / bufferSize : 1;
    data[i] = (Math.random() * 2 - 1) * amp;
  }
  return buffer;
}

function getRoarAudio(): HTMLAudioElement {
  if (!roarAudio) {
    roarAudio = new Audio(ROAR_SRC);
    roarAudio.preload = 'auto';
    roarAudio.volume = 0.72;
  }
  return roarAudio;
}

/** 拼圖吸附：輕放落定 + 塑膠卡榫扣入感 */
export function playSnapSound(): void {
  const audioCtx = getCtx();
  const t = audioCtx.currentTime;

  const settle = audioCtx.createOscillator();
  const lock = audioCtx.createOscillator();
  const scrape = audioCtx.createBufferSource();
  const settleGain = audioCtx.createGain();
  const lockGain = audioCtx.createGain();
  const scrapeGain = audioCtx.createGain();
  const master = audioCtx.createGain();
  const lowpass = audioCtx.createBiquadFilter();
  const bandpass = audioCtx.createBiquadFilter();

  scrape.buffer = createNoiseBuffer(audioCtx, 0.045);

  settle.type = 'sine';
  settle.frequency.setValueAtTime(480, t);
  settle.frequency.exponentialRampToValueAtTime(220, t + 0.09);

  lock.type = 'triangle';
  lock.frequency.setValueAtTime(880, t + 0.045);
  lock.frequency.exponentialRampToValueAtTime(520, t + 0.09);

  lowpass.type = 'lowpass';
  lowpass.frequency.value = 950;

  bandpass.type = 'bandpass';
  bandpass.frequency.value = 680;
  bandpass.Q.value = 1.2;

  settleGain.gain.setValueAtTime(0.28, t);
  settleGain.gain.exponentialRampToValueAtTime(0.001, t + 0.11);

  lockGain.gain.setValueAtTime(0.001, t + 0.045);
  lockGain.gain.linearRampToValueAtTime(0.2, t + 0.05);
  lockGain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);

  scrapeGain.gain.setValueAtTime(0.14, t + 0.02);
  scrapeGain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);

  master.gain.value = 0.9;

  settle.connect(settleGain);
  lock.connect(lockGain);
  scrape.connect(bandpass);
  settleGain.connect(lowpass);
  lockGain.connect(lowpass);
  bandpass.connect(scrapeGain);
  lowpass.connect(master);
  scrapeGain.connect(master);
  master.connect(audioCtx.destination);

  settle.start(t);
  lock.start(t + 0.045);
  scrape.start(t + 0.02);
  settle.stop(t + 0.12);
  lock.stop(t + 0.11);
  scrape.stop(t + 0.07);
}

/** 恐龍低吼：使用 roar.mp3 */
export function playDinoGrowl(): void {
  const audio = getRoarAudio();
  audio.currentTime = 0;
  void audio.play().catch(() => {});
}

/** 全部拼完：上升確認音 */
export function playCompleteSound(): void {
  const audioCtx = getCtx();
  const t = audioCtx.currentTime;

  [523.25, 659.25, 783.99].forEach((freq, i) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    const start = t + i * 0.1;
    gain.gain.setValueAtTime(0.001, start);
    gain.gain.linearRampToValueAtTime(0.2, start + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, start + 0.35);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(start);
    osc.stop(start + 0.4);
  });
}

/** 開始播放背景音樂（需使用者互動後呼叫） */
export function startBackgroundMusic(): void {
  const audio = getBgmAudio();
  if (bgmStarted && !audio.paused) return;
  if (bgmPlayPromise) return;

  bgmPlayPromise = audio
    .play()
    .then(() => {
      bgmStarted = true;
    })
    .catch(() => {})
    .finally(() => {
      bgmPlayPromise = null;
    });
}

/** 切換畫面時恢復背景音樂（僅在意外暫停時） */
export function resumeBackgroundMusic(): void {
  if (!bgmStarted || !bgmAudio || !bgmAudio.paused) return;
  void bgmAudio.play().catch(() => {});
}

/** 預載音效，減少首次播放延遲 */
export function preloadGameSounds(): void {
  getRoarAudio().load();
  if (!bgmPreloaded) {
    getBgmAudio().load();
    bgmPreloaded = true;
  }
}
