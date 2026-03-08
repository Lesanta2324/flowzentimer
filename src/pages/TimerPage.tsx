import { CircularTimer } from '@/components/CircularTimer';
import { TimerControls } from '@/components/TimerControls';
import { MindfulCard } from '@/components/MindfulCard';
import { StatsBar } from '@/components/StatsBar';
import { SettingsPanel } from '@/components/SettingsPanel';
import { useTimer } from '@/hooks/useTimer';
import { motion } from 'framer-motion';

export default function TimerPage() {
  const {
    mode, timeLeft, isRunning, progress, currentActivity,
    settings, stats, start, pause, reset, updateSettings,
  } = useTimer();

  const isBreak = mode === 'break';

  return (
    <div className="min-h-screen pt-20 pb-10 px-4 flex flex-col items-center">
      {/* Settings button */}
      <div className="w-full max-w-md flex justify-end mb-4">
        <SettingsPanel
          focusDuration={settings.focusDuration}
          breakDuration={settings.breakDuration}
          onUpdate={updateSettings}
        />
      </div>

      {/* Timer */}
      <motion.div
        className="flex flex-col items-center gap-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <CircularTimer
          timeLeft={timeLeft}
          progress={progress}
          isBreak={isBreak}
          isRunning={isRunning}
        />

        {/* Break suggestion */}
        {isBreak && <MindfulCard activity={currentActivity} />}

        {/* Controls */}
        <TimerControls
          isRunning={isRunning}
          isIdle={mode === 'idle'}
          onStart={start}
          onPause={pause}
          onReset={reset}
        />

        {/* Stats */}
        <StatsBar
          focusSessions={stats.focusSessionsToday}
          totalFocusTime={stats.totalFocusTimeToday}
          breaksTaken={stats.breaksTakenToday}
          currentStreak={stats.currentStreak}
        />
      </motion.div>
    </div>
  );
}
