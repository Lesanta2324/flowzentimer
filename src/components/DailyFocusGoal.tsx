import { motion } from 'framer-motion';
import { Target } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface DailyGoalProps {
  currentSessions: number;
}

export function DailyFocusGoal({ currentSessions }: DailyGoalProps) {
  const [goal, setGoal] = useLocalStorage<number>('mindful-daily-goal', 6);
  const progress = Math.min(currentSessions / goal, 1);
  const isComplete = currentSessions >= goal;

  return (
    <motion.div
      className="glass-card p-5 w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
          <Target className="h-4 w-4 text-primary" />
        </div>
        <h3 className="font-heading font-semibold text-foreground text-sm">Daily Goal</h3>
      </div>

      <div className="flex items-baseline justify-between mb-2">
        <span className="text-2xl font-heading font-bold text-foreground">
          {currentSessions} <span className="text-sm font-normal text-muted-foreground">/ {goal}</span>
        </span>
        {isComplete && <span className="text-xs font-medium text-secondary">🎉 Complete!</span>}
      </div>

      {/* Progress bar */}
      <div className="h-2.5 rounded-full bg-muted/60 overflow-hidden mb-4">
        <motion.div
          className={`h-full rounded-full ${isComplete ? 'bg-secondary' : 'bg-primary'}`}
          initial={{ width: 0 }}
          animate={{ width: `${progress * 100}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>

      {/* Goal setter */}
      <div className="flex items-center gap-3">
        <span className="text-xs text-muted-foreground whitespace-nowrap">Goal:</span>
        <Slider
          value={[goal]}
          min={1}
          max={12}
          step={1}
          onValueChange={([v]) => setGoal(v)}
          className="flex-1 [&_[role=slider]]:bg-primary [&_[role=slider]]:border-0 [&_[role=slider]]:h-3 [&_[role=slider]]:w-3"
        />
        <span className="text-xs font-heading font-bold text-foreground w-8 text-right">{goal}</span>
      </div>
    </motion.div>
  );
}
