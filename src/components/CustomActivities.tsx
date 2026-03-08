import { useState } from 'react';
import { Plus, X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocalStorage } from '@/hooks/useLocalStorage';

const DEFAULT_ACTIVITIES = [
  'Meditation',
  'Push-ups',
  'Drink water',
  'Stretch',
];

export function useCustomActivities() {
  const [activities, setActivities] = useLocalStorage<string[]>(
    'mindful-custom-activities',
    DEFAULT_ACTIVITIES
  );

  const addActivity = (activity: string) => {
    const trimmed = activity.trim();
    if (trimmed && !activities.includes(trimmed)) {
      setActivities([...activities, trimmed]);
    }
  };

  const removeActivity = (activity: string) => {
    setActivities(activities.filter((a) => a !== activity));
  };

  return { activities, addActivity, removeActivity };
}

interface CustomActivitiesProps {
  activities: string[];
  onAdd: (activity: string) => void;
  onRemove: (activity: string) => void;
}

export function CustomActivities({ activities, onAdd, onRemove }: CustomActivitiesProps) {
  const [newActivity, setNewActivity] = useState('');

  const handleAdd = () => {
    if (newActivity.trim()) {
      onAdd(newActivity);
      setNewActivity('');
    }
  };

  return (
    <div className="glass-card p-5 space-y-4">
      <div className="flex items-center gap-2 mb-1">
        <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-secondary/10">
          <Sparkles className="h-4 w-4 text-secondary" />
        </div>
        <h3 className="font-heading font-semibold text-foreground text-sm">Break Activities</h3>
      </div>

      <div className="flex gap-2">
        <Input
          value={newActivity}
          onChange={(e) => setNewActivity(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="Add activity..."
          className="h-9 text-sm rounded-xl bg-muted/50 border-border/50"
        />
        <Button
          size="sm"
          onClick={handleAdd}
          disabled={!newActivity.trim()}
          className="rounded-xl h-9 px-3"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        <AnimatePresence mode="popLayout">
          {activities.map((activity) => (
            <motion.div
              key={activity}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/60 text-foreground text-xs font-medium group"
            >
              {activity}
              <button
                onClick={() => onRemove(activity)}
                className="text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
              >
                <X className="h-3 w-3" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
