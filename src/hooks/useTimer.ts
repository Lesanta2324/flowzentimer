import { useState, useEffect, useCallback, useRef } from 'react';
import { useLocalStorage } from './useLocalStorage';

export type TimerMode = 'focus' | 'break' | 'idle';

interface TimerSettings {
  focusDuration: number; // minutes
  breakDuration: number; // minutes
}

interface SessionStats {
  focusSessionsToday: number;
  totalFocusTimeToday: number; // minutes
  breaksTakenToday: number;
  lastSessionDate: string;
  currentStreak: number;
  longestStreak: number;
  weeklyData: Record<string, number>; // date -> minutes
}

const DEFAULT_SETTINGS: TimerSettings = {
  focusDuration: 25,
  breakDuration: 5,
};

const getToday = () => new Date().toISOString().split('T')[0];

const DEFAULT_STATS: SessionStats = {
  focusSessionsToday: 0,
  totalFocusTimeToday: 0,
  breaksTakenToday: 0,
  lastSessionDate: getToday(),
  currentStreak: 0,
  longestStreak: 0,
  weeklyData: {},
};

const MINDFUL_ACTIVITIES = [
  "Take 5 slow deep breaths. Inhale for 4 seconds, hold for 4, exhale for 4.",
  "Stretch your shoulders and neck gently. Roll your head in slow circles.",
  "Stand up and walk around for 30 seconds. Feel the ground beneath your feet.",
  "Drink some water. Hydration helps your brain stay sharp.",
  "Look away from the screen for 20 seconds. Focus on something far away.",
  "Close your eyes and listen to the sounds around you for 15 seconds.",
  "Do 5 gentle wrist and finger stretches to prevent tension.",
  "Take a moment to notice 3 things you're grateful for right now.",
  "Stand up and do 5 slow squats to get your blood flowing.",
  "Place your hands on your belly and take 3 deep belly breaths.",
];

export function useTimer() {
  const [settings, setSettings] = useLocalStorage<TimerSettings>('mindful-settings', DEFAULT_SETTINGS);
  const [stats, setStats] = useLocalStorage<SessionStats>('mindful-stats', DEFAULT_STATS);
  const [mode, setMode] = useState<TimerMode>('idle');
  const [timeLeft, setTimeLeft] = useState(settings.focusDuration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [currentActivity, setCurrentActivity] = useState('');
  const [showReflection, setShowReflection] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioRef = useRef<AudioContext | null>(null);
  const audioRef = useRef<AudioContext | null>(null);

  // Reset daily stats if new day
  useEffect(() => {
    const today = getToday();
    if (stats.lastSessionDate !== today) {
      // Check streak
      const lastDate = new Date(stats.lastSessionDate);
      const todayDate = new Date(today);
      const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

      setStats(prev => ({
        ...prev,
        focusSessionsToday: 0,
        totalFocusTimeToday: 0,
        breaksTakenToday: 0,
        lastSessionDate: today,
        currentStreak: diffDays === 1 ? prev.currentStreak : (diffDays > 1 ? 0 : prev.currentStreak),
      }));
    }
  }, []);

  const playSound = useCallback(() => {
    try {
      if (!audioRef.current) {
        audioRef.current = new AudioContext();
      }
      const ctx = audioRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 528;
      osc.type = 'sine';
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.5);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 1.5);

      // Second tone
      setTimeout(() => {
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.frequency.value = 660;
        osc2.type = 'sine';
        gain2.gain.setValueAtTime(0.25, ctx.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.2);
        osc2.start(ctx.currentTime);
        osc2.stop(ctx.currentTime + 1.2);
      }, 400);
    } catch (e) {
      // Audio not supported
    }
  }, []);

  const getRandomActivity = useCallback(() => {
    return MINDFUL_ACTIVITIES[Math.floor(Math.random() * MINDFUL_ACTIVITIES.length)];
  }, []);

  const startBreak = useCallback(() => {
    setMode('break');
    setTimeLeft(settings.breakDuration * 60);
    setIsRunning(true);
    setCurrentActivity(getRandomActivity());
    playSound();

    const today = getToday();
    setStats(prev => ({
      ...prev,
      focusSessionsToday: prev.focusSessionsToday + 1,
      totalFocusTimeToday: prev.totalFocusTimeToday + settings.focusDuration,
      lastSessionDate: today,
      weeklyData: {
        ...prev.weeklyData,
        [today]: (prev.weeklyData[today] || 0) + settings.focusDuration,
      },
    }));
  }, [settings, playSound, getRandomActivity, setStats]);

  const finishBreak = useCallback(() => {
    playSound();
    setMode('idle');
    setIsRunning(false);
    setTimeLeft(settings.focusDuration * 60);

    setStats(prev => {
      const today = getToday();
      const newStreak = prev.currentStreak + (prev.focusSessionsToday === 0 ? 1 : 0);
      return {
        ...prev,
        breaksTakenToday: prev.breaksTakenToday + 1,
        currentStreak: prev.lastSessionDate !== today ? newStreak : prev.currentStreak,
        longestStreak: Math.max(prev.longestStreak, newStreak),
      };
    });
  }, [settings, playSound, setStats]);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      if (mode === 'focus') {
        startBreak();
      } else if (mode === 'break') {
        finishBreak();
      }
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, timeLeft, mode, startBreak, finishBreak]);

  const start = useCallback(() => {
    if (mode === 'idle') {
      setMode('focus');
      setTimeLeft(settings.focusDuration * 60);
    }
    setIsRunning(true);

    // Update streak on first session of the day
    const today = getToday();
    if (stats.focusSessionsToday === 0 && stats.lastSessionDate !== today) {
      const lastDate = new Date(stats.lastSessionDate);
      const todayDate = new Date(today);
      const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
      setStats(prev => ({
        ...prev,
        lastSessionDate: today,
        currentStreak: diffDays <= 1 ? prev.currentStreak + 1 : 1,
        longestStreak: Math.max(prev.longestStreak, diffDays <= 1 ? prev.currentStreak + 1 : 1),
      }));
    }
  }, [mode, settings, stats, setStats]);

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const reset = useCallback(() => {
    setIsRunning(false);
    setMode('idle');
    setTimeLeft(settings.focusDuration * 60);
    setCurrentActivity('');
  }, [settings]);

  const updateSettings = useCallback((newSettings: Partial<TimerSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      if (!isRunning && mode === 'idle') {
        setTimeLeft(updated.focusDuration * 60);
      }
      return updated;
    });
  }, [isRunning, mode, setSettings]);

  const totalDuration = mode === 'break' ? settings.breakDuration * 60 : settings.focusDuration * 60;
  const progress = 1 - timeLeft / totalDuration;

  return {
    mode,
    timeLeft,
    isRunning,
    progress,
    currentActivity,
    settings,
    stats,
    start,
    pause,
    reset,
    updateSettings,
  };
}
