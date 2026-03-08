import { Settings } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface SettingsPanelProps {
  focusDuration: number;
  breakDuration: number;
  onUpdate: (settings: { focusDuration?: number; breakDuration?: number }) => void;
}

export function SettingsPanel({ focusDuration, breakDuration, onUpdate }: SettingsPanelProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-xl text-muted-foreground hover:text-foreground">
          <Settings className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="glass-card border-border/50 sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-heading">Timer Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div>
            <div className="flex justify-between mb-3">
              <span className="text-sm text-muted-foreground">Focus Duration</span>
              <span className="text-sm font-heading font-bold text-foreground">{focusDuration} min</span>
            </div>
            <Slider
              value={[focusDuration]}
              min={20}
              max={60}
              step={5}
              onValueChange={([v]) => onUpdate({ focusDuration: v })}
              className="[&_[role=slider]]:bg-primary [&_[role=slider]]:border-0"
            />
          </div>
          <div>
            <div className="flex justify-between mb-3">
              <span className="text-sm text-muted-foreground">Break Duration</span>
              <span className="text-sm font-heading font-bold text-foreground">{breakDuration} min</span>
            </div>
            <Slider
              value={[breakDuration]}
              min={3}
              max={15}
              step={1}
              onValueChange={([v]) => onUpdate({ breakDuration: v })}
              className="[&_[role=slider]]:bg-accent [&_[role=slider]]:border-0"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
