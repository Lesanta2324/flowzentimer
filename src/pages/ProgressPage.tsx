import { motion } from 'framer-motion';
import { Flame, Trophy, Clock, Brain } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useMemo } from 'react';
import { AchievementBadges } from '@/components/AchievementBadges';

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

export default function ProgressPage() {
  const [stats] = useLocalStorage<SessionStats>('mindful-stats', DEFAULT_STATS);

  const weekData = useMemo(() => {
    const days: { label: string; date: string; minutes: number }[] = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      days.push({
        label: d.toLocaleDateString('en', { weekday: 'short' }),
        date: dateStr,
        minutes: stats.weeklyData[dateStr] || 0,
      });
    }
    return days;
  }, [stats.weeklyData]);

  const maxMinutes = Math.max(...weekData.map(d => d.minutes), 30);
  const weeklyTotal = weekData.reduce((sum, d) => sum + d.minutes, 0);

  return (
    <div className="min-h-screen pt-20 pb-10 px-4">
      <div className="max-w-md mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-heading font-bold text-foreground mb-1">Progress</h1>
          <p className="text-sm text-muted-foreground">Track your focus journey</p>
        </motion.div>

        {/* Streak cards */}
        <motion.div
          className="grid grid-cols-2 gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="glass-card p-4">
            <Flame className="h-5 w-5 text-primary mb-2" />
            <p className="text-2xl font-heading font-bold text-foreground">{stats.currentStreak}</p>
            <p className="text-xs text-muted-foreground">Current Streak (days)</p>
          </div>
          <div className="glass-card p-4">
            <Trophy className="h-5 w-5 text-accent mb-2" />
            <p className="text-2xl font-heading font-bold text-foreground">{stats.longestStreak}</p>
            <p className="text-xs text-muted-foreground">Longest Streak (days)</p>
          </div>
        </motion.div>

        {/* Today stats */}
        <motion.div
          className="glass-card p-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="font-heading font-semibold text-foreground mb-4">Today</h2>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <Brain className="h-4 w-4 mx-auto text-primary mb-1" />
              <p className="text-xl font-heading font-bold text-foreground">{stats.focusSessionsToday}</p>
              <p className="text-[11px] text-muted-foreground">Sessions</p>
            </div>
            <div>
              <Clock className="h-4 w-4 mx-auto text-primary mb-1" />
              <p className="text-xl font-heading font-bold text-foreground">{stats.totalFocusTimeToday}</p>
              <p className="text-[11px] text-muted-foreground">Minutes</p>
            </div>
            <div>
              <Flame className="h-4 w-4 mx-auto text-accent mb-1" />
              <p className="text-xl font-heading font-bold text-foreground">{stats.breaksTakenToday}</p>
              <p className="text-[11px] text-muted-foreground">Breaks</p>
            </div>
          </div>
        </motion.div>

        {/* Weekly chart */}
        <motion.div
          className="glass-card p-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading font-semibold text-foreground">This Week</h2>
            <span className="text-sm text-muted-foreground">{weeklyTotal} min total</span>
          </div>
          <div className="flex items-end gap-2 h-32">
            {weekData.map((day, i) => (
              <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[10px] text-muted-foreground font-medium">{day.minutes > 0 ? day.minutes : ''}</span>
                <motion.div
                  className="w-full rounded-lg bg-primary/20 relative overflow-hidden"
                  style={{ height: '100%' }}
                  initial={{ height: 0 }}
                  animate={{ height: '100%' }}
                >
                  <motion.div
                    className="absolute bottom-0 w-full rounded-lg bg-primary"
                    initial={{ height: 0 }}
                    animate={{ height: `${(day.minutes / maxMinutes) * 100}%` }}
                    transition={{ delay: 0.4 + i * 0.05, duration: 0.5, ease: 'easeOut' }}
                  />
                </motion.div>
                <span className="text-[10px] text-muted-foreground">{day.label}</span>
              </div>
            ))}
          </div>
        </motion.div>
        {/* Achievement Badges */}
        <AchievementBadges />
      </div>
    </div>
  );
}
