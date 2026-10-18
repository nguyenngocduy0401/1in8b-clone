// Authentic Procedural Ambient Synthesizer from 1in8b.life
// Pure Web Audio API procedural generation with zero audio file dependencies

const CHORDS = [
  [57, 60, 64, 69], // Am7
  [53, 57, 60, 65], // Fmaj7
  [48, 52, 55, 60], // C
  [55, 59, 62, 67], // G
  [57, 60, 64, 67], // Am7
  [50, 53, 57, 62], // Dm7
  [52, 55, 59, 64], // Em7
  [53, 57, 60, 64]  // Fmaj7
];

const PENTA = [60, 62, 64, 67, 69, 72, 74, 76, 79, 81];

const mhz = n => 440 * Math.pow(2, (n - 69) / 12);

class SoundSynth {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.bus = null;
    this.isPlaying = false;
    this.timer = null;
    this.step = 0;
    this.currentAge = 0;
    this.volume = 0.5;
  }

  init() {
    if (this.ctx) return true;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return false;

    try {
      const ctx = new AudioCtx();
      const master = ctx.createGain();
      master.gain.value = 0;

      const lp = ctx.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.value = 1600;

      const dry = ctx.createGain();
      dry.gain.value = 0.7;

      const comp = ctx.createDynamicsCompressor();
      comp.threshold.value = -20;
      comp.knee.value = 10;
      comp.ratio.value = 3;
      comp.attack.value = 0.02;
      comp.release.value = 0.5;

      lp.connect(dry);
      dry.connect(master);
      master.connect(comp);
      comp.connect(ctx.destination);

      this.ctx = ctx;
      this.master = master;
      this.bus = lp;
      return true;
    } catch {
      return false;
    }
  }

  playNote(n, t, dur, vol, type = 'sine', attack = 1.8, h = 0) {
    if (!this.ctx || !this.bus) return;
    const ctx = this.ctx;
    const o = ctx.createOscillator();
    const g = ctx.createGain();

    o.type = type;
    o.frequency.value = mhz(n);
    o.detune.value = (Math.random() - 0.5) * 6;

    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol, t + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);

    o.connect(g);
    g.connect(this.bus);
    o.start(t);
    o.stop(t + dur + 0.1);

    if (h) {
      const o2 = ctx.createOscillator();
      const g2 = ctx.createGain();
      o2.type = 'sine';
      o2.frequency.value = mhz(n + 12);
      g2.gain.value = h;
      o2.connect(g2);
      g2.connect(g);
      o2.start(t);
      o2.stop(t + dur + 0.1);
    }
  }

  musicStep() {
    if (!this.isPlaying || !this.ctx) return;
    const t = this.ctx.currentTime + 0.05;
    const st = this.step++;
    const a = this.currentAge;
    const sg = a < 13 ? 'c' : a < 30 ? 'y' : a < 60 ? 'a' : 'o';
    const r = Math.random;

    // Chord progression
    if (st % 2 === 0) {
      const ch = CHORDS[(st / 2) % CHORDS.length];
      ch.forEach((n, i) => {
        this.playNote(
          n - 12 + (i === 0 ? 0 : 12),
          t + i * (sg === 'o' ? 0.15 : 0.09),
          sg === 'o' ? 8.5 : 7.0,
          i === 0 ? 0.05 : 0.03,
          'sine',
          1.8,
          i === 0 ? 0.5 : 0.3
        );
      });
    }

    // Melodic accents
    const k = sg === 'c' ? (r() < 0.2 ? 1 : 2) : sg === 'o' ? (r() < 0.6 ? 0 : 1) : (r() < 0.4 ? 1 : 2);
    for (let i = 0; i < k; i++) {
      const pool = sg === 'c' ? PENTA.slice(0, 7) : sg === 'o' ? PENTA.slice(0, 5) : PENTA;
      const note = pool[Math.floor(r() * pool.length)];
      this.playNote(
        note,
        t + 0.5 + r() * 2.8,
        sg === 'c' ? 2.0 : sg === 'o' ? 4.0 : 3.0,
        sg === 'c' ? 0.035 : 0.04,
        sg === 'o' ? 'sine' : 'triangle',
        0.02
      );
    }
  }

  toggle(age = 0) {
    this.currentAge = age;
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start(age);
      return true;
    }
  }

  start(age = 0) {
    if (!this.init()) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    this.isPlaying = true;
    this.currentAge = age;
    this.master.gain.setTargetAtTime(this.volume * 2.0, this.ctx.currentTime, 0.2);

    this.musicStep();
    if (this.timer) clearInterval(this.timer);
    this.timer = setInterval(() => this.musicStep(), 4000);
  }

  stop() {
    this.isPlaying = false;
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    if (this.master && this.ctx) {
      this.master.gain.setTargetAtTime(0, this.ctx.currentTime, 0.15);
    }
  }

  setAge(age) {
    this.currentAge = age;
  }

  playTone(freq, duration = 0.15, type = 'sine', gainVal = 0.25) {
    if (!this.init()) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    try {
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      g.gain.setValueAtTime(gainVal * this.volume, this.ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
      osc.connect(g);
      g.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {}
  }

  playYearTick() {
    this.playTone(587.33, 0.06, 'triangle', 0.12);
  }

  playDecision() {
    [523.25, 659.25].forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.35, 'sine', 0.2), i * 120);
    });
  }

  playCoin() {
    [987.77, 1318.51].forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.25, 'triangle', 0.22), i * 90);
    });
  }

  playAchievement() {
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.45, 'triangle', 0.25), i * 110);
    });
  }

  playDeath() {
    this.playTone(130.81, 1.8, 'sine', 0.4);
    this.playTone(196.0, 1.4, 'triangle', 0.2);
  }
}

export const sound = new SoundSynth();
