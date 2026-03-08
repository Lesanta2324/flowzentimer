import { useState } from 'react';
import { motion } from 'framer-motion';
import { Wind, Box, Leaf, Target, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { GuidedBreathing } from '@/components/GuidedBreathing';

export interface BreathingMode {
  id: string;
  title: string;
  description: string;
  icon: typeof Wind;
  phases: { label: string; duration: number; scale: number }[];
  defaultCycles: number;
  color: string;
}

const BREATHING_MODES: BreathingMode[] = [
  {
    id: 'box',
    title: 'Box Breathing',
    description: 'A balanced 4-4-4-4 pattern used by athletes and professionals to calm the nervous system and sharpen focus.',
    icon: Box,
    phases: [
      { label: 'Inhale', duration: 4, scale: 1.5 },
      { label: 'Hold', duration: 4, scale: 1.5 },
      { label: 'Exhale', duration: 4, scale: 1 },
      { label: 'Hold', duration: 4, scale: 1 },
    ],
    defaultCycles: 6,
    color: 'from-[hsl(210,70%,52%)] to-[hsl(210,60%,40%)]',
  },
  {
    id: 'relaxation',
    title: 'Relaxation Breathing',
    description: 'A gentle 4-6 inhale-exhale rhythm that activates your parasympathetic nervous system for deep relaxation.',
    icon: Leaf,
    phases: [
      { label: 'Inhale', duration: 4, scale: 1.5 },
      { label: 'Exhale', duration: 6, scale: 1 },
    ],
    defaultCycles: 8,
    color: 'from-[hsl(152,45%,48%)] to-[hsl(152,40%,36%)]',
  },
  {
    id: 'focus',
    title: 'Focus Breathing',
    description: 'A quick 3-2-3 pattern designed to reset your attention during study sessions and boost concentration.',
    icon: Target,
    phases: [
      { label: 'Inhale', duration: 3, scale: 1.4 },
      { label: 'Hold', duration: 2, scale: 1.4 },
      { label: 'Exhale', duration: 3, scale: 1 },
    ],
    defaultCycles: 10,
    color: 'from-[hsl(250,60%,58%)] to-[hsl(250,50%,45%)]',
  },
];

export default function BreathingPage() {
  const [selectedMode, setSelectedMode] = useState<BreathingMode | null>(null);

  if (selectedMode) {
    return <GuidedBreathing mode={selectedMode} onExit={() => setSelectedMode(null)} />;
  }

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-4">
            <Wind className="h-7 w-7 text-primary" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-heading font-bold text-foreground mb-3">
            Breathing Exercises
          </h1>
          <p className="text-muted-foreground text-base max-w-md mx-auto">
            Choose a breathing pattern to calm your mind, reduce stress, or sharpen your focus.
          </p>
        </motion.div>

        <div className="grid gap-4">
          {BREATHING_MODES.map((mode, i) => (
            <motion.div
              key={mode.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.1, duration: 0.5 }}
            >
              <button
                onClick={() => setSelectedMode(mode)}
                className="w-full text-left glass-card p-6 group hover:border-primary/30 transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${mode.color} flex items-center justify-center shadow-lg`}>
                    <mode.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-heading font-semibold text-foreground text-lg mb-1 group-hover:text-primary transition-colors">
                      {mode.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                      {mode.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {mode.phases.map((phase, j) => (
                        <span
                          key={j}
                          className="inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-lg bg-muted text-muted-foreground"
                        >
                          {phase.label} · {phase.duration}s
                        </span>
                      ))}
                      <span className="inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-lg bg-primary/10 text-primary">
                        {mode.defaultCycles} cycles
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-8"
        >
          <Link to="/">
            <Button variant="ghost" className="gap-2 text-muted-foreground">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
