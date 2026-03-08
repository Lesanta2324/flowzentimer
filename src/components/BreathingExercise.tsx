import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wind } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PHASES = [
  { label: 'Inhale', duration: 4000, scale: 1.4 },
  { label: 'Hold', duration: 4000, scale: 1.4 },
  { label: 'Exhale', duration: 4000, scale: 1 },
] as const;

export function BreathingExercise() {
  const [active, setActive] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [countdown, setCountdown] = useState(4);

  const phase = PHASES[phaseIndex];

  useEffect(() => {
    if (!active) return;

    const countInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          setPhaseIndex(p => (p + 1) % PHASES.length);
          return 4;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countInterval);
  }, [active]);

  const toggle = useCallback(() => {
    setActive(prev => {
      if (!prev) {
        setPhaseIndex(0);
        setCountdown(4);
      }
      return !prev;
    });
  }, []);

  return (
    <motion.div
      className="glass-card p-6 text-center group hover:border-primary/30 transition-colors duration-300 cursor-pointer h-full flex flex-col items-center justify-center gap-3"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 group-hover:bg-primary/15 transition-colors mb-1">
        <Wind className="h-5 w-5 text-primary" />
      </div>
      <h3 className="font-heading font-semibold text-foreground text-sm mb-1">Breathing Exercise</h3>

      <AnimatePresence mode="wait">
        {active ? (
          <motion.div
            key="active"
            className="flex flex-col items-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Breathing circle */}
            <div className="relative flex items-center justify-center w-20 h-20">
              <motion.div
                className="absolute inset-0 rounded-full bg-primary/15"
                animate={{ scale: phase.scale }}
                transition={{ duration: phase.duration / 1000, ease: 'easeInOut' }}
                key={phaseIndex}
              />
              <span className="relative text-lg font-heading font-bold text-primary z-10">
                {countdown}
              </span>
            </div>

            <p className="text-sm font-medium text-foreground">{phase.label}</p>
            <p className="text-xs text-muted-foreground">4-4-4 breathing</p>

            <Button size="sm" variant="ghost" onClick={toggle} className="text-xs">
              Stop
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-2"
          >
            <p className="text-xs text-muted-foreground leading-relaxed">
              Guided 4-4-4 breathing to calm your mind
            </p>
            <Button size="sm" variant="outline" onClick={toggle} className="text-xs rounded-xl">
              Try it now
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
