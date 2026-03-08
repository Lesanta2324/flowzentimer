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
    // White/pink noise via buffer
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
      // Low-pass filter for rain-like sound
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
    // Layered gentle tones to simulate forest ambiance
    const freqs = [180, 260, 340, 420];
    const oscs: OscillatorNode[] = [];
    freqs.forEach((f) => {
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = f;
      oscGain.gain.value = 0.02;
      // Gentle LFO
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

  // Cafe - brownian noise with mid-range filter
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
            className="glass-card p-3 space-y-2 min-w-[140px]"
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
