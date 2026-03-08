import { motion } from 'framer-motion';
import { Leaf } from 'lucide-react';

interface MindfulCardProps {
  activity: string;
}

export function MindfulCard({ activity }: MindfulCardProps) {
  if (!activity) return null;

  return (
    <motion.div
      className="glass-card p-6 max-w-sm mx-auto text-center"
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-accent/10 mb-4">
        <Leaf className="h-5 w-5 text-accent" />
      </div>
      <p className="text-foreground font-medium leading-relaxed">{activity}</p>
      <p className="text-muted-foreground text-sm mt-3">Mindful Break</p>
    </motion.div>
  );
}
