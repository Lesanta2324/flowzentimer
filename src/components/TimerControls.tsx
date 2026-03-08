import { Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface TimerControlsProps {
  isRunning: boolean;
  isIdle: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
}

export function TimerControls({ isRunning, isIdle, onStart, onPause, onReset }: TimerControlsProps) {
  return (
    <motion.div
      className="flex items-center gap-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
    >
      <Button
        variant="outline"
        size="icon"
        className="h-12 w-12 rounded-xl border-border/60 hover:bg-muted"
        onClick={onReset}
      >
        <RotateCcw className="h-5 w-5" />
      </Button>

      <Button
        size="lg"
        className="h-14 w-14 rounded-2xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
        onClick={isRunning ? onPause : onStart}
      >
        {isRunning ? (
          <Pause className="h-6 w-6" />
        ) : (
          <Play className="h-6 w-6 ml-0.5" />
        )}
      </Button>

      <div className="h-12 w-12" /> {/* Spacer for symmetry */}
    </motion.div>
  );
}
