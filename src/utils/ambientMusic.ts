export interface MusicEngine {
  play: () => void;
  pause: () => void;
}

const TARGET_VOLUME = 0.32;

/** Licensed track from /public/audio — looped, fades in gently. */
function createTrackEngine(src: string): MusicEngine {
  const audio = new Audio(src);
  audio.loop = true;
  audio.preload = 'auto';
  audio.volume = 0;
  let fade: number | null = null;

  const rampTo = (target: number, after?: () => void) => {
    if (fade) window.clearInterval(fade);
    fade = window.setInterval(() => {
      const next = audio.volume + (target > audio.volume ? 0.02 : -0.04);
      if (target > audio.volume && next >= target || target <= audio.volume && next <= target) {
        audio.volume = Math.max(0, Math.min(1, target));
        if (fade) window.clearInterval(fade);
        fade = null;
        after?.();
      } else {
        audio.volume = Math.max(0, Math.min(1, next));
      }
    }, 60);
  };

  return {
    play: () => {
      audio.play().then(() => rampTo(TARGET_VOLUME)).catch(() => undefined);
    },
    pause: () => rampTo(0, () => audio.pause())
  };
}

// D major · Bm · G · A — soft music-box arpeggio over a warm pad (original composition)
const CHORDS: number[][] = [
[146.83, 220.0, 293.66, 369.99, 440.0],
[123.47, 185.0, 246.94, 293.66, 369.99],
[98.0, 146.83, 196.0, 246.94, 293.66],
[110.0, 164.81, 220.0, 277.18, 329.63]];

const PATTERN = [1, 2, 3, 4, 3, 2, 3, 4];
const STEP = 0.42;

/** Fallback when no licensed track is configured: an original generated melody. */
function createSynthEngine(): MusicEngine | null {
  const Ctor =
  window.AudioContext ??
  (window as Window & {webkitAudioContext?: typeof AudioContext;}).webkitAudioContext;
  if (!Ctor) return null;

  const ctx = new Ctor();
  const master = ctx.createGain();
  master.gain.value = 0;
  master.connect(ctx.destination);

  const tone = ctx.createBiquadFilter();
  tone.type = 'lowpass';
  tone.frequency.value = 2400;
  tone.connect(master);

  const delay = ctx.createDelay(1);
  delay.delayTime.value = 0.36;
  const feedback = ctx.createGain();
  feedback.gain.value = 0.3;
  const wet = ctx.createGain();
  wet.gain.value = 0.35;
  tone.connect(delay);
  delay.connect(feedback);
  feedback.connect(delay);
  delay.connect(wet);
  wet.connect(master);

  let step = 0;
  let nextTime = 0;
  let timer: number | null = null;
  let stopTimer: number | null = null;

  const note = (freq: number, at: number, dur: number, vol: number, type: OscillatorType) => {
    const osc = ctx.createOscillator();
    osc.type = type;
    osc.frequency.value = freq;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, at);
    gain.gain.exponentialRampToValueAtTime(vol, at + (type === 'sine' ? 0.6 : 0.025));
    gain.gain.exponentialRampToValueAtTime(0.0001, at + dur);
    osc.connect(gain);
    gain.connect(tone);
    osc.start(at);
    osc.stop(at + dur + 0.05);
  };

  const schedule = () => {
    while (nextTime < ctx.currentTime + 0.3) {
      const chord = CHORDS[Math.floor(step / PATTERN.length) % CHORDS.length];
      if (step % PATTERN.length === 0) {
        note(chord[0], nextTime, 3.6, 0.07, 'sine');
        note(chord[2], nextTime, 3.6, 0.035, 'sine');
      }
      note(chord[PATTERN[step % PATTERN.length]] * 2, nextTime, 1.7, 0.045, 'triangle');
      nextTime += STEP;
      step += 1;
    }
  };

  return {
    play: () => {
      if (stopTimer) {
        window.clearTimeout(stopTimer);
        stopTimer = null;
      }
      void ctx.resume();
      if (timer === null) {
        nextTime = ctx.currentTime + 0.1;
        timer = window.setInterval(schedule, 100);
      }
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.setValueAtTime(master.gain.value, ctx.currentTime);
      master.gain.linearRampToValueAtTime(0.85, ctx.currentTime + 2.5);
    },
    pause: () => {
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.setValueAtTime(master.gain.value, ctx.currentTime);
      master.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.4);
      stopTimer = window.setTimeout(() => {
        if (timer !== null) window.clearInterval(timer);
        timer = null;
        void ctx.suspend();
      }, 450);
    }
  };
}

/** Must be called from inside a user gesture handler. */
export function createMusicEngine(src: string | null): MusicEngine | null {
  try {
    return src ? createTrackEngine(src) : createSynthEngine();
  } catch {
    return null;
  }
}