// Synthetic Audio System using browser's built-in Web Audio API
// No assets to load, 100% reliable, offline, and customized for a cyber-detective aesthetic.

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioCtx;
}

// Check if sound is enabled from local state before playing
export function playSound(type: 'click' | 'success' | 'wrong' | 'complete', enabled: boolean) {
  if (!enabled) return;

  const ctx = getAudioContext();
  if (!ctx) return;

  // Resume context if suspended (browser security policies)
  if (ctx.state === 'suspended') {
    ctx.resume();
  }

  const now = ctx.currentTime;

  switch (type) {
    case 'click': {
      // Short high-frequency sine tick
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1000, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.08);

      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.08);
      break;
    }

    case 'success': {
      // Ascending sweet major chord/notes: C5 -> E5 -> G5
      const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
      notes.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const delay = index * 0.08;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + delay);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.1, now + delay + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.3);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + delay);
        osc.stop(now + delay + 0.3);
      });
      break;
    }

    case 'wrong': {
      // Low dual frequency buzz
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(130, now);
      osc1.frequency.linearRampToValueAtTime(90, now + 0.25);

      osc2.type = 'square';
      osc2.frequency.setValueAtTime(133, now);
      osc2.frequency.linearRampToValueAtTime(93, now + 0.25);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.25);
      osc2.stop(now + 0.25);
      break;
    }

    case 'complete': {
      // Beautiful spacey sci-fi success sweep & arpeggio
      const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 1046.50]; // C4, E4, G4, C5, E5, C6
      notes.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const delay = index * 0.12;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + delay);
        // Add subtle pitch vibrato
        osc.frequency.setValueAtTime(freq, now + delay);
        osc.frequency.linearRampToValueAtTime(freq * 1.01, now + delay + 0.4);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.08, now + delay + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.6);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + delay);
        osc.stop(now + delay + 0.6);
      });
      break;
    }
  }
}
