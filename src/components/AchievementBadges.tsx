import { motion } from 'framer-motion';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useMemo } from 'react';

interface SessionStats {
  focusSessionsToday: number;
  totalFocusTimeToday: number;
  breaksTakenToday: number;
  lastSessionDate: string;
  currentStreak: number;
  longestStreak: number;
  weeklyData: Record<string, number>;
}

const DEFAULT_STATS: SessionStats = {
  focusSessionsToday: 0,
  totalFocusTimeToday: 0,
  breaksTakenToday: 0,
  lastSessionDate: new Date().toISOString().split('T')[0],
  currentStreak: 0,
  longestStreak: 0,
  weeklyData: {},
};

interface Badge {
  id: string;
  emoji: string;
  title: string;
  description: string;
  check: (stats: SessionStats, totalSessions: number, totalMinutes: number) => boolean;
}

const BADGES: Badge[] = [
  {
    id: 'first-session',
    emoji: '🎯',
    title: 'First Focus',
    description: 'Complete your first focus session',
    check: (_, totalSessions) => totalSessions >= 1,
  },
  {
    id: 'streak-5',
    emoji: '🔥',
    title: '5 Day Streak',
    description: 'Maintain a 5-day focus streak',
    check: (s) => s.longestStreak >= 5,
  },
  {
    id: 'sessions-10',
    emoji: '⚡',
    title: '10 Sessions',
    description: 'Complete 10 focus sessions',
    check: (_, totalSessions) => totalSessions >= 10,
  },
  {
    id: 'minutes-100',
    emoji: '💎',
    title: '100 Minutes',
    description: 'Accumulate 100 minutes of focus',
    check: (_, __, totalMinutes) => totalMinutes >= 100,
  },
  {
    id: 'streak-10',
    emoji: '🏆',
    title: 'Streak Master',
    description: 'Maintain a 10-day focus streak',
    check: (s) => s.longestStreak >= 10,
  },
  {
    id: 'minutes-500',
    emoji: '👑',
    title: 'Productivity King',
    description: 'Accumulate 500 minutes of focus',
    check: (_, __, totalMinutes) => totalMinutes >= 500,
  },
];

export function AchievementBadges() {
  const [stats] = useLocalStorage<SessionStats>('mindful-stats', DEFAULT_STATS);

  const { totalSessions, totalMinutes } = useMemo(() => {
    const totalMinutes = Object.values(stats.weeklyData).reduce((a, b) => a + b, 0);
    // Rough estimate of total sessions from total minutes (assuming ~25 min avg)
    const totalSessions = stats.focusSessionsToday + Math.floor(totalMinutes / 25);
    return { totalSessions, totalMinutes };
  }, [stats]);

  const earned = BADGES.filter((b) => b.check(stats, totalSessions, totalMinutes));
  const locked = BADGES.filter((b) => !b.check(stats, totalSessions, totalMinutes));

  return (
    <motion.div
      className="glass-card p-5"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <h2 className="font-heading font-semibold text-foreground mb-4">Achievements</h2>
      <div className="grid grid-cols-3 gap-3">
        {earned.map((badge, i) => (
          <motion.div
            key={badge.id}
            className="flex flex-col items-center text-center p-3 rounded-xl bg-primary/10 border border-primary/20"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5 + i * 0.08, type: 'spring', stiffness: 200 }}
          >
            <span className="text-2xl mb-1">{badge.emoji}</span>
            <p className="text-[11px] font-heading font-semibold text-foreground leading-tight">{badge.title}</p>
            <p className="text-[9px] text-muted-foreground mt-0.5">{badge.description}</p>
          </motion.div>
        ))}
        {locked.map((badge) => (
          <div
            key={badge.id}
            className="flex flex-col items-center text-center p-3 rounded-xl bg-muted/40 border border-border/30 opacity-50"
          >
            <span className="text-2xl mb-1 grayscale">🔒</span>
            <p className="text-[11px] font-heading font-semibold text-muted-foreground leading-tight">{badge.title}</p>
            <p className="text-[9px] text-muted-foreground mt-0.5">{badge.description}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
