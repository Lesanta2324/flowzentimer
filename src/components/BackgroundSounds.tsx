import { useState, useRef, useEffect, useCallback } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { motion, AnimatePresence } from 'framer-motion';

interface SoundOption {
  id: string;
  label: string;
  emoji: string;
}

const SOUNDS: SoundOption[] = [
  { id: 'rain', label: 'Rain', emoji: '🌧️' },
  { id: 'forest', label: 'Forest', emoji: '🌲' },
  { id: 'ocean', label: 'Ocean Waves', emoji: '🌊' },
  { id: 'cafe', label: 'Cafe Ambience', emoji: '☕' },
  { id: 'whitenoise', label: 'White Noise', emoji: '📻' },
  { id: 'wind', label: 'Wind', emoji: '💨' },
  { id: 'fireplace', label: 'Fireplace', emoji: '🔥' },
  { id: 'piano', label: 'Soft Piano', emoji: '🎹' },
  { id: 'birds', label: 'Nature Birds', emoji: '🐦' },
  { id: 'crickets', label: 'Night Crickets', emoji: '🦗' },
  { id: 'river', label: 'River Stream', emoji: '🏞️' },
  { id: 'windchimes', label: 'Wind Chimes', emoji: '🎐' },
];

// Generate ambient sounds using Web Audio API
function createAmbientSound(ctx: AudioContext, type: string): { nodes: AudioNode[]; stop: () => void } {
  const nodes: AudioNode[] = [];
  const gainNode = ctx.createGain();
  gainNode.gain.value = 0.3;
  gainNode.connect(ctx.destination);
  nodes.push(gainNode);

  if (type === 'rain' || type === 'whitenoise') {
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.5;
    }
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    if (type === 'rain') {
      const lpf = ctx.createBiquadFilter();
      lpf.type = 'lowpass';
      lpf.frequency.value = 1200;
      lpf.Q.value = 0.7;
      source.connect(lpf);
      lpf.connect(gainNode);
      nodes.push(lpf);
    } else {
      const bpf = ctx.createBiquadFilter();
      bpf.type = 'bandpass';
      bpf.frequency.value = 2000;
      bpf.Q.value = 0.3;
      source.connect(bpf);
      bpf.connect(gainNode);
      nodes.push(bpf);
    }
    source.start();
    nodes.push(source);
    return { nodes, stop: () => { try { source.stop(); } catch {} } };
  }

  if (type === 'forest') {
    const freqs = [180, 260, 340, 420];
    const oscs: OscillatorNode[] = [];
    freqs.forEach((f) => {
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = f;
      oscGain.gain.value = 0.02;
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.value = 0.1 + Math.random() * 0.3;
      lfoGain.gain.value = 0.015;
      lfo.connect(lfoGain);
      lfoGain.connect(oscGain.gain);
      lfo.start();
      osc.connect(oscGain);
      oscGain.connect(gainNode);
      osc.start();
      oscs.push(osc);
      nodes.push(osc, oscGain, lfo, lfoGain);
    });
    return { nodes, stop: () => oscs.forEach((o) => { try { o.stop(); } catch {} }) };
  }

  if (type === 'ocean') {
    // Ocean waves: filtered noise with slow volume modulation
    const bufferSize = ctx.sampleRate * 4;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.4;
    }
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    const lpf = ctx.createBiquadFilter();
    lpf.type = 'lowpass';
    lpf.frequency.value = 600;
    lpf.Q.value = 0.5;
    const waveGain = ctx.createGain();
    waveGain.gain.value = 0.5;
    const lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.08;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.4;
    lfo.connect(lfoGain);
    lfoGain.connect(waveGain.gain);
    lfo.start();
    source.connect(lpf);
    lpf.connect(waveGain);
    waveGain.connect(gainNode);
    source.start();
    nodes.push(source, lpf, waveGain, lfo, lfoGain);
    return { nodes, stop: () => { try { source.stop(); lfo.stop(); } catch {} } };
  }

  if (type === 'wind') {
    // Wind: filtered noise with slow frequency sweep
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.3;
    }
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    const bpf = ctx.createBiquadFilter();
    bpf.type = 'bandpass';
    bpf.frequency.value = 400;
    bpf.Q.value = 0.8;
    const lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.05;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 300;
    lfo.connect(lfoGain);
    lfoGain.connect(bpf.frequency);
    lfo.start();
    source.connect(bpf);
    bpf.connect(gainNode);
    source.start();
    nodes.push(source, bpf, lfo, lfoGain);
    return { nodes, stop: () => { try { source.stop(); lfo.stop(); } catch {} } };
  }

  if (type === 'fireplace') {
    // Fireplace: crackling brownian noise with high-pass pops
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let last = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (last + 0.04 * white) / 1.04;
      last = data[i];
      data[i] *= 4;
      // Random crackle pops
      if (Math.random() < 0.001) data[i] += (Math.random() - 0.5) * 0.8;
    }
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    const hpf = ctx.createBiquadFilter();
    hpf.type = 'highpass';
    hpf.frequency.value = 200;
    hpf.Q.value = 0.3;
    const lpf = ctx.createBiquadFilter();
    lpf.type = 'lowpass';
    lpf.frequency.value = 3000;
    source.connect(hpf);
    hpf.connect(lpf);
    lpf.connect(gainNode);
    source.start();
    nodes.push(source, hpf, lpf);
    return { nodes, stop: () => { try { source.stop(); } catch {} } };
  }

  if (type === 'piano') {
    // Soft piano: gentle sine tones in a pentatonic scale with slow arpeggiation
    const notes = [261.6, 293.7, 329.6, 392.0, 440.0, 523.3, 587.3, 659.3];
    const oscs: OscillatorNode[] = [];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = freq;
      const oscGain = ctx.createGain();
      oscGain.gain.value = 0;
      // Slow fade in/out pattern unique to each note
      const lfo = ctx.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.value = 0.03 + i * 0.015;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 0.018;
      lfo.connect(lfoGain);
      lfoGain.connect(oscGain.gain);
      lfo.start();
      osc.connect(oscGain);
      oscGain.connect(gainNode);
      osc.start();
      oscs.push(osc);
      nodes.push(osc, oscGain, lfo, lfoGain);
    });
    return { nodes, stop: () => oscs.forEach((o) => { try { o.stop(); } catch {} }) };
  }

  if (type === 'birds') {
    // Nature birds: high-pitched chirps with random timing via oscillators
    const oscs: OscillatorNode[] = [];
    const chirpFreqs = [2200, 2800, 3200, 1800, 2500];
    chirpFreqs.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = freq;
      const oscGain = ctx.createGain();
      oscGain.gain.value = 0;
      const lfo = ctx.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.value = 0.2 + Math.random() * 0.5;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 0.012;
      lfo.connect(lfoGain);
      lfoGain.connect(oscGain.gain);
      lfo.start();
      // Frequency vibrato
      const vib = ctx.createOscillator();
      vib.type = 'sine';
      vib.frequency.value = 3 + Math.random() * 4;
      const vibGain = ctx.createGain();
      vibGain.gain.value = 80 + Math.random() * 120;
      vib.connect(vibGain);
      vibGain.connect(osc.frequency);
      vib.start();
      osc.connect(oscGain);
      oscGain.connect(gainNode);
      osc.start();
      oscs.push(osc, vib);
      nodes.push(osc, oscGain, lfo, lfoGain, vib, vibGain);
    });
    return { nodes, stop: () => oscs.forEach((o) => { try { o.stop(); } catch {} }) };
  }

  if (type === 'crickets') {
    // Night crickets: high-frequency pulsing tones
    const oscs: OscillatorNode[] = [];
    const freqs = [4200, 4800, 5100, 3900];
    freqs.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = freq;
      const oscGain = ctx.createGain();
      oscGain.gain.value = 0;
      const lfo = ctx.createOscillator();
      lfo.type = 'square';
      lfo.frequency.value = 6 + i * 2;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 0.008;
      lfo.connect(lfoGain);
      lfoGain.connect(oscGain.gain);
      lfo.start();
      osc.connect(oscGain);
      oscGain.connect(gainNode);
      osc.start();
      oscs.push(osc, lfo);
      nodes.push(osc, oscGain, lfo, lfoGain);
    });
    return { nodes, stop: () => oscs.forEach((o) => { try { o.stop(); } catch {} }) };
  }

  if (type === 'river') {
    // River stream: filtered noise with gentle modulation
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.35;
    }
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    const bpf = ctx.createBiquadFilter();
    bpf.type = 'bandpass';
    bpf.frequency.value = 900;
    bpf.Q.value = 0.6;
    const lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.12;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 200;
    lfo.connect(lfoGain);
    lfoGain.connect(bpf.frequency);
    lfo.start();
    source.connect(bpf);
    bpf.connect(gainNode);
    source.start();
    nodes.push(source, bpf, lfo, lfoGain);
    return { nodes, stop: () => { try { source.stop(); lfo.stop(); } catch {} } };
  }

  if (type === 'windchimes') {
    // Wind chimes: resonant high tones with random amplitude modulation
    const oscs: OscillatorNode[] = [];
    const chimeFreqs = [880, 1108.7, 1318.5, 1567.9, 1760, 2093];
    chimeFreqs.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = freq;
      const oscGain = ctx.createGain();
      oscGain.gain.value = 0;
      const lfo = ctx.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.value = 0.05 + Math.random() * 0.15;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 0.015;
      lfo.connect(lfoGain);
      lfoGain.connect(oscGain.gain);
      lfo.start();
      osc.connect(oscGain);
      oscGain.connect(gainNode);
      osc.start();
      oscs.push(osc);
      nodes.push(osc, oscGain, lfo, lfoGain);
    });
    return { nodes, stop: () => oscs.forEach((o) => { try { o.stop(); } catch {} }) };
  }

  // Cafe (default) - brownian noise with mid-range filter
  const bufferSize = ctx.sampleRate * 2;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  let last = 0;
  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1;
    data[i] = (last + 0.02 * white) / 1.02;
    last = data[i];
    data[i] *= 3.5;
  }
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.loop = true;
  const bpf = ctx.createBiquadFilter();
  bpf.type = 'bandpass';
  bpf.frequency.value = 800;
  bpf.Q.value = 0.5;
  source.connect(bpf);
  bpf.connect(gainNode);
  source.start();
  nodes.push(source, bpf);
  return { nodes, stop: () => { try { source.stop(); } catch {} } };
}

function loadPref<T>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(key);
    return v !== null ? JSON.parse(v) : fallback;
  } catch { return fallback; }
}

export function BackgroundSounds() {
  const [activeSound, setActiveSound] = useState<string | null>(() => loadPref('music-sound', 'rain'));
  const [enabled, setEnabled] = useState(() => loadPref('music-enabled', true));
  const [volume, setVolume] = useState(() => loadPref('music-volume', 30));
  const [isOpen, setIsOpen] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const soundRef = useRef<{ nodes: AudioNode[]; stop: () => void } | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const hasAutoPlayed = useRef(false);

  // Persist preferences
  useEffect(() => { localStorage.setItem('music-sound', JSON.stringify(activeSound)); }, [activeSound]);
  useEffect(() => { localStorage.setItem('music-enabled', JSON.stringify(enabled)); }, [enabled]);
  useEffect(() => { localStorage.setItem('music-volume', JSON.stringify(volume)); }, [volume]);

  const stopSound = useCallback(() => {
    if (soundRef.current) {
      soundRef.current.stop();
      soundRef.current = null;
    }
    gainRef.current = null;
  }, []);

  const playSound = useCallback((id: string) => {
    if (!ctxRef.current) {
      ctxRef.current = new AudioContext();
    }
    stopSound();
    const result = createAmbientSound(ctxRef.current, id);
    soundRef.current = result;
    const gn = result.nodes.find((n) => n instanceof GainNode) as GainNode | undefined;
    if (gn) {
      gainRef.current = gn;
      gn.gain.value = volume / 100;
    }
  }, [volume, stopSound]);

  // Auto-play on first user interaction (browsers block autoplay without gesture)
  useEffect(() => {
    if (hasAutoPlayed.current) return;
    const startAudio = () => {
      if (!hasAutoPlayed.current && enabled && activeSound) {
        playSound(activeSound);
        hasAutoPlayed.current = true;
      }
      document.removeEventListener('click', startAudio);
      document.removeEventListener('keydown', startAudio);
    };
    document.addEventListener('click', startAudio);
    document.addEventListener('keydown', startAudio);
    return () => {
      document.removeEventListener('click', startAudio);
      document.removeEventListener('keydown', startAudio);
    };
  }, [enabled, activeSound, playSound]);

  useEffect(() => {
    if (gainRef.current) {
      gainRef.current.gain.value = volume / 100;
    }
  }, [volume]);

  useEffect(() => {
    return () => stopSound();
  }, [stopSound]);

  const toggleEnabled = () => {
    if (enabled) {
      stopSound();
      setEnabled(false);
    } else {
      setEnabled(true);
      if (activeSound) {
        playSound(activeSound);
      }
    }
  };

  const selectSound = (id: string) => {
    setActiveSound(id);
    if (enabled) {
      playSound(id);
    }
  };

  return (
    <div className="fixed right-4 top-1/2 -translate-y-1/2 z-40 flex items-center gap-2">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.9 }}
            className="glass-card p-3 space-y-1 min-w-[160px] max-h-[70vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between px-1 mb-1">
              <p className="text-xs font-heading font-semibold text-muted-foreground">🎵 Music</p>
              <button
                onClick={toggleEnabled}
                className={`text-xs px-2 py-0.5 rounded-lg transition-colors ${
                  enabled ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground'
                }`}
              >
                {enabled ? 'On' : 'Off'}
              </button>
            </div>
            {SOUNDS.map((s) => (
              <button
                key={s.id}
                onClick={() => selectSound(s.id)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-colors ${
                  activeSound === s.id && enabled
                    ? 'bg-primary/15 text-primary font-medium'
                    : 'text-foreground hover:bg-muted/60'
                }`}
              >
                <span>{s.emoji}</span>
                <span>{s.label}</span>
              </button>
            ))}
            {activeSound && enabled && (
              <div className="px-1 pt-1">
                <Slider
                  value={[volume]}
                  min={5}
                  max={100}
                  step={5}
                  onValueChange={([v]) => setVolume(v)}
                  className="[&_[role=slider]]:bg-primary [&_[role=slider]]:border-0 [&_[role=slider]]:h-3 [&_[role=slider]]:w-3"
                />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className={`rounded-xl h-10 w-10 shadow-md ${
          enabled && activeSound
            ? 'bg-primary/15 text-primary border border-primary/20'
            : 'glass-card text-muted-foreground'
        }`}
      >
        {enabled && activeSound ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
      </Button>
    </div>
  );
}
