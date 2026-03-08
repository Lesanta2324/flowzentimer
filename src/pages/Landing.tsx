import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Timer, Leaf, BarChart3, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Landing() {
  const features = [
    { icon: Timer, title: 'Focus Timer', desc: 'Customizable Pomodoro sessions to boost productivity' },
    { icon: Leaf, title: 'Mindful Breaks', desc: 'Healthy activity suggestions during every break' },
    { icon: BarChart3, title: 'Track Progress', desc: 'Monitor sessions, streaks, and weekly focus time' },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Subtle background orbs */}
      <div className="absolute top-1/4 -left-32 w-64 h-64 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute bottom-1/4 -right-32 w-64 h-64 rounded-full bg-accent/5 blur-3xl" />

      <motion.div
        className="text-center max-w-lg relative z-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <motion.div
          className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-6"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        >
          <Sparkles className="h-8 w-8 text-primary" />
        </motion.div>

        <h1 className="text-4xl sm:text-5xl font-heading font-bold text-foreground mb-4 leading-tight">
          Mindful Break Timer
        </h1>
        <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
          Focus better, avoid burnout, and build consistent study habits with mindful breaks between sessions.
        </p>

        <Link to="/timer">
          <Button size="lg" className="rounded-2xl px-8 h-13 text-base shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all">
            Start Focusing
          </Button>
        </Link>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-16 max-w-lg sm:max-w-2xl w-full relative z-10"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.7 }}
      >
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            className="glass-card p-5 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + i * 0.1 }}
          >
            <f.icon className="h-6 w-6 mx-auto text-primary mb-3" />
            <h3 className="font-heading font-semibold text-foreground text-sm mb-1">{f.title}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
