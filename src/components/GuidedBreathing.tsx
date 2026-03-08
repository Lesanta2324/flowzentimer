import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Square, X, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { BreathingMode } from '@/pages/BreathingPage';

type Status = 'idle' | 'running' | 'paused' | 'complete';

export function GuidedBreathing({ mode, onExit }: { mode: BreathingMode; onExit: () => void }) {
  const [status, setStatus] = useState<Status>('idle');
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [phaseCountdown, setPhaseCountdown] = useState(mode.phases[0].duration);
  const [currentCycle, setCurrentCycle] = useState(1);
  const [totalElapsed, setTotalElapsed] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const phase = mode.phases[phaseIndex];
  const totalCycleTime = mode.phases.reduce((s, p) => s + p.duration, 0);
  const totalSessionTime = totalCycleTime * mode.defaultCycles;

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const tick = useCallback(() => {
    setTotalElapsed(prev => prev + 1);
    setPhaseCountdown(prev => {
      if (prev <= 1) {
        // Advance phase
        setPhaseIndex(pi => {
          const nextPhase = pi + 1;
          if (nextPhase >= mode.phases.length) {
            // End of cycle
            setCurrentCycle(c => {
              if (c >= mode.defaultCycles) {
                setStatus('complete');
                return c;
              }
              return c + 1;
            });
            setPhaseCountdown(mode.phases[0].duration);
            return 0;
          }
          setPhaseCountdown(mode.phases[nextPhase].duration);
          return nextPhase;
        });
        return prev; // will be overwritten above
      }
      return prev - 1;
    });
  }, [mode]);

  useEffect(() => {
    clearTimer();
    if (status === 'running') {
      intervalRef.current = setInterval(tick, 1000);
    }
    return clearTimer;
  }, [status, tick, clearTimer]);

  // Stop timer when complete
  useEffect(() => {
    if (status === 'complete') clearTimer();
  }, [status, clearTimer]);

  const handleStart = () => {
    if (status === 'idle') {
      setPhaseIndex(0);
      setPhaseCountdown(mode.phases[0].duration);
      setCurrentCycle(1);
      setTotalElapsed(0);
    }
    setStatus('running');
  };

  const handlePause = () => setStatus('paused');

  const handleStop = () => {
    clearTimer();
    setStatus('idle');
    setPhaseIndex(0);
    setPhaseCountdown(mode.phases[0].duration);
    setCurrentCycle(1);
    setTotalElapsed(0);
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  // Completion screen
  if (status === 'complete') {
    return (
      <div className="min-h-screen pt-20 pb-12 px-4 flex items-center justify-center">
        <motion.div
          className="max-w-md w-full text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-secondary/15 mb-6"
          >
            <CheckCircle2 className="h-10 w-10 text-secondary" />
          </motion.div>

          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-foreground mb-3">
            Nice work!
          </h2>
          <p className="text-muted-foreground text-base mb-2">
            Your breathing exercise is complete.
          </p>
          <p className="text-sm text-muted-foreground mb-8">
            {mode.defaultCycles} cycles of {mode.title} · {formatTime(totalElapsed)}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={onExit} size="lg" className="rounded-2xl gap-2">
              Return to Exercises
            </Button>
            <Button onClick={handleStart} variant="outline" size="lg" className="rounded-2xl gap-2">
              <Play className="h-4 w-4" /> Repeat
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Active / idle breathing screen
  const isActive = status === 'running' || status === 'paused';
  const progress = totalElapsed / totalSessionTime;

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background ambient orbs */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 rounded-full bg-secondary/8 blur-3xl" />
      <div className="absolute bottom-1/3 -right-20 w-80 h-80 rounded-full bg-primary/8 blur-3xl" />

      <motion.div
        className="max-w-md w-full flex flex-col items-center relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Mode title */}
        <h2 className="font-heading font-bold text-xl text-foreground mb-1">{mode.title}</h2>
        <p className="text-sm text-muted-foreground mb-8">
          {mode.phases.map(p => `${p.duration}s`).join(' · ')} · {mode.defaultCycles} cycles
        </p>

        {/* Breathing circle */}
        <div className="relative flex items-center justify-center w-56 h-56 mb-8">
          {/* Outer ring progress */}
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 224 224">
            <circle
              cx="112" cy="112" r="106"
              fill="none"
              stroke="hsl(var(--muted))"
              strokeWidth="4"
            />
            <motion.circle
              cx="112" cy="112" r="106"
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 106}
              strokeDashoffset={2 * Math.PI * 106 * (1 - progress)}
              transition={{ duration: 0.5 }}
            />
          </svg>

          {/* Animated breathing orb */}
          <motion.div
            className="rounded-full bg-gradient-to-br from-primary/25 to-secondary/25 backdrop-blur-sm border border-primary/10"
            animate={{
              width: isActive ? (phase.scale > 1 ? 160 : 80) : 100,
              height: isActive ? (phase.scale > 1 ? 160 : 80) : 100,
            }}
            transition={{
              duration: isActive ? phase.duration : 1,
              ease: 'easeInOut',
            }}
          />

          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <AnimatePresence mode="wait">
              {isActive ? (
                <motion.div
                  key={`${phaseIndex}-${currentCycle}`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col items-center"
                >
                  <span className="text-3xl font-heading font-bold text-foreground">
                    {phaseCountdown}
                  </span>
                  <span className="text-sm font-medium text-primary mt-1">
                    {phase.label}
                  </span>
                </motion.div>
              ) : (
                <motion.span
                  key="ready"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-sm font-medium text-muted-foreground"
                >
                  Ready
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Cycle & timer info */}
        <div className="flex items-center gap-6 mb-8 text-sm">
          <div className="text-center">
            <span className="block text-muted-foreground text-xs">Cycle</span>
            <span className="font-heading font-semibold text-foreground">
              {isActive ? currentCycle : 0} / {mode.defaultCycles}
            </span>
          </div>
          <div className="w-px h-6 bg-border" />
          <div className="text-center">
            <span className="block text-muted-foreground text-xs">Elapsed</span>
            <span className="font-heading font-semibold text-foreground">
              {formatTime(totalElapsed)}
            </span>
          </div>
          <div className="w-px h-6 bg-border" />
          <div className="text-center">
            <span className="block text-muted-foreground text-xs">Total</span>
            <span className="font-heading font-semibold text-foreground">
              {formatTime(totalSessionTime)}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          {status === 'idle' && (
            <Button onClick={handleStart} size="lg" className="rounded-2xl gap-2 px-8">
              <Play className="h-4 w-4" /> Start
            </Button>
          )}
          {status === 'running' && (
            <>
              <Button onClick={handlePause} variant="outline" size="lg" className="rounded-2xl gap-2">
                <Pause className="h-4 w-4" /> Pause
              </Button>
              <Button onClick={handleStop} variant="ghost" size="lg" className="rounded-2xl gap-2">
                <Square className="h-4 w-4" /> Stop
              </Button>
            </>
          )}
          {status === 'paused' && (
            <>
              <Button onClick={handleStart} size="lg" className="rounded-2xl gap-2 px-8">
                <Play className="h-4 w-4" /> Resume
              </Button>
              <Button onClick={handleStop} variant="ghost" size="lg" className="rounded-2xl gap-2">
                <Square className="h-4 w-4" /> Stop
              </Button>
            </>
          )}
        </div>

        {/* Exit */}
        <Button
          onClick={onExit}
          variant="ghost"
          className="mt-6 text-muted-foreground gap-2 text-sm"
        >
          <X className="h-4 w-4" /> Exit
        </Button>
      </motion.div>
    </div>
  );
}
