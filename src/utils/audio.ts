// Web Audio API Synthesizer for Mindful Serenity, Tibetan Singing Bowls, and Calming Soundscapes

class ZenSoundscapes {
  private ctx: AudioContext | null = null;
  private ambientNoiseNode: AudioNode | null = null;
  private ambientGain: GainNode | null = null;
  public isAmbientPlaying = false;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // Harmonic Tibetan Singing Bowl (Warm, resonant, grounding)
  playTibetanBowl() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // Fundamental and gentle harmonic frequencies
      const frequencies = [216, 432, 648, 864];
      const gains = [0.35, 0.22, 0.12, 0.05];

      frequencies.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        // Subtle organic vibrato
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.setValueAtTime(1.8 + idx * 0.4, now);
        lfoGain.gain.setValueAtTime(1.5, now);
        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);
        lfo.start(now);
        lfo.stop(now + 3.8);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(gains[idx], now + 0.12);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.8);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 3.8);
      });
    } catch (e) {
      console.warn('Audio not allowed or supported', e);
    }
  }

  // Peaceful bamboo chime chord
  playBambooChime() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // Pentatonic soothing notes: F4, A4, C5, E5, G5
      const notes = [349.23, 440.0, 523.25, 659.25, 783.99];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.1);

        gain.gain.setValueAtTime(0.001, now + idx * 0.1);
        gain.gain.linearRampToValueAtTime(0.18, now + idx * 0.1 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.1 + 1.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.1);
        osc.stop(now + idx * 0.1 + 1.2);
      });
    } catch (e) {
      console.warn('Audio not allowed or supported', e);
    }
  }

  // Generative Soft Ambient Rain / Gentle Forest Mist soundscape
  toggleAmbientNature(): boolean {
    try {
      const ctx = this.getContext();
      if (!ctx) return false;

      if (this.isAmbientPlaying) {
        this.stopAmbientNature();
        return false;
      }

      const bufferSize = 2 * ctx.sampleRate;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

      // Generate soft pink noise
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.035;
        b6 = white * 0.115926;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      // Low-pass filter to sound like soft soothing rain/creek
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 1.5);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      whiteNoise.start();

      this.ambientNoiseNode = whiteNoise;
      this.ambientGain = gain;
      this.isAmbientPlaying = true;
      return true;
    } catch (e) {
      console.warn('Could not start ambient sound', e);
      return false;
    }
  }

  stopAmbientNature() {
    try {
      if (this.ambientGain && this.ctx) {
        this.ambientGain.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + 1.0);
        setTimeout(() => {
          if (this.ambientNoiseNode) {
            (this.ambientNoiseNode as any).stop?.();
            this.ambientNoiseNode.disconnect();
            this.ambientNoiseNode = null;
          }
          this.ambientGain = null;
          this.isAmbientPlaying = false;
        }, 1000);
      } else {
        this.isAmbientPlaying = false;
      }
    } catch (e) {
      console.warn('Error stopping ambient', e);
      this.isAmbientPlaying = false;
    }
  }
}

export const zenSounds = new ZenSoundscapes();
export const sounds = {
  playThoughtStopperGong: () => zenSounds.playTibetanBowl(),
  playSuccessChime: () => zenSounds.playBambooChime(),
  playBambooChime: () => zenSounds.playBambooChime(),
  toggleAmbientNature: () => zenSounds.toggleAmbientNature(),
};
