import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Timer, Leaf, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MotivationalQuote } from '@/components/MotivationalQuote';
import { Wind } from 'lucide-react';

export default function Landing() {
  const features = [
    { icon: Timer, title: 'Focus Timer', desc: 'Customizable Pomodoro sessions to boost productivity', to: '/timer' },
    { icon: Leaf, title: 'Mindful Breaks', desc: 'Healthy activity suggestions during every break', to: '/timer' },
    { icon: null, title: 'Breathing', desc: '', to: '' },
    { icon: BarChart3, title: 'Track Progress', desc: 'Monitor sessions, streaks, and weekly focus time', to: '/progress' },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Colorful animated orbs */}
      <div className="absolute top-1/4 -left-20 w-72 h-72 rounded-full bg-primary/15 blur-3xl animate-pulse-soft" />
      <div className="absolute bottom-1/3 -right-20 w-72 h-72 rounded-full bg-secondary/15 blur-3xl animate-pulse-soft" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-accent/8 blur-3xl" />
      <div className="absolute top-10 right-1/4 w-40 h-40 rounded-full bg-primary/10 blur-2xl animate-breathe" />
      <div className="absolute bottom-20 left-1/4 w-40 h-40 rounded-full bg-secondary/10 blur-2xl animate-breathe" />

      <motion.div
        className="text-center max-w-lg relative z-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <motion.div
          className="inline-flex items-center justify-center mb-6"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        >
          <img src="/logo.png" alt="Mindful Break Logo" className="h-24 w-24 rounded-2xl shadow-2xl shadow-primary/20 bg-card/50 p-2" />
        </motion.div>

        <h1 className="text-4xl sm:text-5xl font-heading font-bold text-foreground mb-4 leading-tight">
          <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-[gradient_6s_ease_infinite]">
            Mindful Break
          </span>
          <br />
          Timer
        </h1>
        <p className="text-lg text-muted-foreground mb-4 leading-relaxed">
          Focus better, avoid burnout, and build consistent study habits with mindful breaks between sessions.
        </p>

        {/* Rotating motivational quotes */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <MotivationalQuote />
        </motion.div>

        <Link to="/timer">
          <Button
            size="lg"
            className="rounded-2xl px-8 h-13 text-base shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/35 transition-all bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary"
          >
            Start Focusing
          </Button>
        </Link>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-16 max-w-lg sm:max-w-3xl w-full relative z-10"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.7 }}
      >
        {features.map((f, i) => (
          f.icon === null ? (
            <BreathingExercise key={f.title} />
          ) : (
            <Link key={f.title} to={f.to}>
              <motion.div
                className="glass-card p-5 text-center group hover:border-primary/30 transition-colors duration-300 cursor-pointer h-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
              >
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 group-hover:bg-primary/15 transition-colors mb-3">
                  <f.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-heading font-semibold text-foreground text-sm mb-1">{f.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            </Link>
          )
        ))}
      </motion.div>
    </div>
  );
}
