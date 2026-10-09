// Web Audio API Synthesizer for Thought Stopper ("¡BASTA!") and completion chimes

class SoundEffects {
  private ctx: AudioContext | null = null;

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

  // Dramatic chime / gong to cut through rumination
  playThoughtStopperGong() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // Base low frequency impact
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.8);

      gain.gain.setValueAtTime(0.7, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 1.2);

      // Higher harmonic bell
      const bell = ctx.createOscillator();
      const bellGain = ctx.createGain();
      bell.type = 'sine';
      bell.frequency.setValueAtTime(880, now);
      bell.frequency.exponentialRampToValueAtTime(440, now + 0.5);

      bellGain.gain.setValueAtTime(0.4, now);
      bellGain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

      bell.connect(bellGain);
      bellGain.connect(ctx.destination);

      bell.start(now);
      bell.stop(now + 0.8);
    } catch (e) {
      console.warn('Audio not allowed or supported', e);
    }
  }

  // Harmonious chord for completing an ABCDE workout or step
  playSuccessChime() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // Play C-major uplifting triad: C5 (523.25), E5 (659.25), G5 (783.99), C6 (1046.5)
      const freqs = [523.25, 659.25, 783.99, 1046.5];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0.2, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 0.6);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.6);
      });
    } catch (e) {
      console.warn('Audio not allowed or supported', e);
    }
  }
}

export const sounds = new SoundEffects();
