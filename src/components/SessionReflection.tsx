import { useState } from 'react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

const MOODS = [
  { emoji: '😄', label: 'Great' },
  { emoji: '🙂', label: 'Good' },
  { emoji: '😐', label: 'Okay' },
  { emoji: '😴', label: 'Tired' },
] as const;

interface SessionReflectionProps {
  open: boolean;
  onClose: (data?: { note: string; mood: string }) => void;
}

export function SessionReflection({ open, onClose }: SessionReflectionProps) {
  const [note, setNote] = useState('');
  const [mood, setMood] = useState('');

  const handleSubmit = () => {
    onClose({ note, mood });
    setNote('');
    setMood('');
  };

  const handleSkip = () => {
    onClose();
    setNote('');
    setMood('');
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleSkip()}>
      <DialogContent className="sm:max-w-md glass-card border-border/50">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl text-center">Session Complete 🎉</DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            Take a moment to reflect on your focus session.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Work note */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">What did you work on?</label>
            <Textarea
              placeholder="e.g. Studied chapter 5, worked on project..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="resize-none rounded-xl bg-muted/50 border-border/50 focus:border-primary/50"
              rows={2}
            />
          </div>

          {/* Mood tracker */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">🧠 How are you feeling?</label>
            <div className="flex justify-center gap-3">
              {MOODS.map((m) => (
                <motion.button
                  key={m.label}
                  onClick={() => setMood(m.label)}
                  className={`flex flex-col items-center gap-1 p-3 rounded-xl border transition-all duration-200 ${
                    mood === m.label
                      ? 'border-primary bg-primary/10 shadow-sm shadow-primary/20'
                      : 'border-border/50 bg-muted/30 hover:bg-muted/50'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="text-2xl">{m.emoji}</span>
                  <span className="text-xs text-muted-foreground">{m.label}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button variant="ghost" onClick={handleSkip} className="flex-1 rounded-xl">
            Skip
          </Button>
          <Button onClick={handleSubmit} className="flex-1 rounded-xl bg-primary hover:bg-primary/90">
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
