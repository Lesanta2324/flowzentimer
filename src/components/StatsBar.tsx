import { motion } from 'framer-motion';
import { Brain, Clock, Coffee, Flame } from 'lucide-react';

interface StatsBarProps {
  focusSessions: number;
  totalFocusTime: number;
  breaksTaken: number;
  currentStreak: number;
}

export function StatsBar({ focusSessions, totalFocusTime, breaksTaken, currentStreak }: StatsBarProps) {
  const items = [
    { icon: Brain, label: 'Sessions', value: focusSessions },
    { icon: Clock, label: 'Focus Min', value: totalFocusTime },
    { icon: Coffee, label: 'Breaks', value: breaksTaken },
    { icon: Flame, label: 'Streak', value: `${currentStreak}d` },
  ];

  return (
    <motion.div
      className="grid grid-cols-4 gap-3 w-full max-w-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.5 }}
    >
      {items.map((item, i) => (
        <div key={item.label} className="glass-card p-3 text-center">
          <item.icon className="h-4 w-4 mx-auto text-muted-foreground mb-1" />
          <p className="text-lg font-heading font-bold text-foreground">{item.value}</p>
          <p className="text-[11px] text-muted-foreground">{item.label}</p>
        </div>
      ))}
    </motion.div>
  );
}
