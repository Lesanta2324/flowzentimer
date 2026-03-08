import { motion } from 'framer-motion';

interface CircularTimerProps {
  timeLeft: number;
  progress: number;
  isBreak: boolean;
  isRunning: boolean;
}

export function CircularTimer({ timeLeft, progress, isBreak, isRunning }: CircularTimerProps) {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const size = 280;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progress);

  return (
    <div className="relative flex items-center justify-center">
      <motion.div
        className={isRunning ? 'animate-breathe' : ''}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <svg width={size} height={size} className="timer-circle -rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="hsl(var(--timer-bg))"
            strokeWidth={strokeWidth + 4}
          />
          {/* Progress circle */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={isBreak ? 'hsl(var(--timer-ring-break))' : 'hsl(var(--timer-ring))'}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          />
          {/* Glow effect */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={isBreak ? 'hsl(var(--timer-ring-break))' : 'hsl(var(--timer-ring))'}
            strokeWidth={2}
            strokeLinecap="round"
            strokeDasharray={circumference}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            opacity={0.3}
            filter="blur(6px)"
          />
        </svg>
      </motion.div>

      {/* Time display */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-5xl font-heading font-bold text-timer-text tracking-tight"
          key={formatted}
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.15 }}
        >
          {formatted}
        </motion.span>
        <span className="text-sm font-medium text-muted-foreground mt-2 uppercase tracking-widest">
          {isBreak ? 'Break Time' : 'Focus Time'}
        </span>
      </div>
    </div>
  );
}
