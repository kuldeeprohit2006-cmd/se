// Web Audio API Synthesizer for Zero-Asset Emergency Calling & Sound FX

class SoundFX {
  constructor() {
    this.ctx = null;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Dial tone / DTMF beep
  playDialTone() {
    this.init();
    if (!this.ctx) return;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.frequency.value = 350;
    osc2.frequency.value = 440;
    gain.gain.value = 0.08;

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.ctx.destination);

    osc1.start();
    osc2.start();

    setTimeout(() => {
      osc1.stop();
      osc2.stop();
    }, 200);
  }

  // Ringback tone (ring... ring...)
  playRingTone() {
    this.init();
    if (!this.ctx) return;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.frequency.value = 440;
    osc2.frequency.value = 480;
    gain.gain.value = 0.1;

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.ctx.destination);

    osc1.start();
    osc2.start();

    setTimeout(() => {
      osc1.stop();
      osc2.stop();
    }, 1200);
  }

  // Operator connected chime
  playConnectChime() {
    this.init();
    if (!this.ctx) return;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.frequency.value = freq;
      gain.gain.value = 0.05;

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      const startTime = this.ctx.currentTime + idx * 0.1;
      osc.start(startTime);
      osc.stop(startTime + 0.15);
    });
  }

  // Emergency countdown beep
  playCountdownBeep(high = false) {
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.frequency.value = high ? 880 : 440;
    gain.gain.value = 0.1;

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    setTimeout(() => osc.stop(), 150);
  }
}

export default new SoundFX();
