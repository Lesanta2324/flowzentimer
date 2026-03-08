import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote } from 'lucide-react';

const QUOTES = [
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "Focus on being productive instead of busy.", author: "Tim Ferriss" },
  { text: "Small steps every day lead to big results.", author: "Unknown" },
  { text: "Your mind is a garden, your thoughts are the seeds.", author: "Unknown" },
  { text: "Breathe. You're doing better than you think.", author: "Unknown" },
  { text: "Rest is not idleness. It's the key to a better life.", author: "John Lubbock" },
  { text: "The present moment is the only moment available to us.", author: "Thich Nhat Hanh" },
  { text: "Almost everything will work again if you unplug it for a few minutes.", author: "Anne Lamott" },
  { text: "Take care of your body. It's the only place you have to live.", author: "Jim Rohn" },
  { text: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
  { text: "Happiness is not something ready made. It comes from your own actions.", author: "Dalai Lama" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
];

export function MotivationalQuote() {
  const [index, setIndex] = useState(() => Math.floor(Math.random() * QUOTES.length));

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex(prev => (prev + 1) % QUOTES.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const quote = QUOTES[index];

  return (
    <div className="relative h-20 flex items-center justify-center overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          className="absolute text-center px-4 max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-start gap-2 justify-center">
            <Quote className="h-3.5 w-3.5 text-primary/50 mt-0.5 shrink-0" />
            <p className="text-sm text-muted-foreground italic leading-relaxed">
              {quote.text}
            </p>
          </div>
          <p className="text-xs text-muted-foreground/60 mt-1.5">— {quote.author}</p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
