import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer, Wind, BarChart3, Sparkles, ArrowRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface Step {
  icon: typeof Timer;
  title: string;
  desc: string;
}

const STEPS: Step[] = [
  {
    icon: Sparkles,
    title: 'Welcome to FlowZen',
    desc: 'A calm space to focus deeply, breathe mindfully, and build consistent study habits — without burning out.',
  },
  {
    icon: Timer,
    title: 'Focus Timer',
    desc: 'Customize your Pomodoro sessions. Each break suggests a mindful activity to refresh your mind.',
  },
  {
    icon: Wind,
    title: 'Breathing & Zen Breaks',
    desc: 'Try guided breathing exercises any time you need to slow down and reset.',
  },
  {
    icon: BarChart3,
    title: 'Track Your Progress',
    desc: 'See daily sessions, streaks, and weekly focus time. Earn badges as you grow your practice.',
  },
];

export function OnboardingTour() {
  const [seen, setSeen] = useLocalStorage<boolean>('flowzen-onboarding-seen', false);
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!seen) {
      const t = setTimeout(() => setOpen(true), 600);
      return () => clearTimeout(t);
    }
  }, [seen]);

  const close = () => {
    setOpen(false);
    setSeen(true);
  };

  const next = () => {
    if (step < STEPS.length - 1) setStep(step + 1);
    else close();
  };

  if (!open) return null;

  const Current = STEPS[step];
  const Icon = Current.icon;
  const isLast = step === STEPS.length - 1;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-background/70 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={close}
      >
        <motion.div
          className="relative w-full max-w-md glass-card p-8"
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 240, damping: 24 }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={close}
            className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors p-1 rounded-lg"
            aria-label="Skip tour"
          >
            <X className="h-4 w-4" />
          </button>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.25 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-5">
                <Icon className="h-7 w-7 text-primary" />
              </div>
              <h2 className="text-xl font-heading font-bold text-foreground mb-2">
                {Current.title}
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                {Current.desc}
              </p>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-center gap-1.5 mb-6">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === step ? 'w-6 bg-primary' : 'w-1.5 bg-muted-foreground/30'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center justify-between gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={close}
              className="rounded-xl text-muted-foreground"
            >
              Skip
            </Button>
            <Button
              onClick={next}
              className="rounded-xl bg-gradient-to-r from-primary to-primary/80 gap-1.5"
            >
              {isLast ? 'Get Started' : 'Next'}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
