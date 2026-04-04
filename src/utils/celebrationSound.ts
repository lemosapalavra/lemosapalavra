// Generate celebration sounds using Web Audio API
export function playCelebrationSound() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Applause-like white noise burst
    const duration = 2.5;
    const sampleRate = ctx.sampleRate;
    const buffer = ctx.createBuffer(2, sampleRate * duration, sampleRate);
    
    for (let ch = 0; ch < 2; ch++) {
      const data = buffer.getChannelData(ch);
      for (let i = 0; i < data.length; i++) {
        const t = i / sampleRate;
        // Envelope: quick rise, sustained, then fade
        const env = t < 0.1 ? t * 10 : t < 1.5 ? 1 : Math.max(0, 1 - (t - 1.5));
        // Filtered noise for applause effect
        data[i] = (Math.random() * 2 - 1) * env * 0.3;
      }
    }
    
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    
    // Bandpass filter for more realistic applause
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 3000;
    filter.Q.value = 0.5;
    
    const gain = ctx.createGain();
    gain.gain.value = 0.4;
    
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start();
    
    // Add a cheerful chime on top
    const playChime = (freq: number, delay: number) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      g.gain.setValueAtTime(0, ctx.currentTime + delay);
      g.gain.linearRampToValueAtTime(0.15, ctx.currentTime + delay + 0.05);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.5);
      osc.connect(g);
      g.connect(ctx.destination);
      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + 0.5);
    };
    
    // Happy ascending chime pattern
    [523, 659, 784, 1047].forEach((f, i) => playChime(f, i * 0.15));
    
    // Cleanup
    noise.onended = () => { ctx.close(); };
  } catch (e) {
    console.log("Audio not available:", e);
  }
}
