import { Settings } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';

interface SettingsPanelProps {
  focusDuration: number;
  breakDuration: number;
  onUpdate: (settings: { focusDuration?: number; breakDuration?: number }) => void;
}

function formatDuration(mins: number) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h > 0 && m > 0) return `${h}h ${m}m`;
  if (h > 0) return `${h}h`;
  return `${m}m`;
}

function DurationInput({ label, value, min, max, step, color, onChange }: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  color: 'primary' | 'accent';
  onChange: (v: number) => void;
}) {
  const hours = Math.floor(value / 60);
  const minutes = value % 60;

  const setHours = (h: number) => {
    const clamped = Math.max(0, Math.min(3, h));
    const newVal = clamped * 60 + minutes;
    onChange(Math.min(max, Math.max(min, newVal)));
  };

  const setMinutes = (m: number) => {
    const clamped = Math.max(0, Math.min(59, m));
    const newVal = hours * 60 + clamped;
    onChange(Math.min(max, Math.max(min, newVal)));
  };

  return (
    <div>
      <div className="flex justify-between mb-3">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className="text-sm font-heading font-bold text-foreground">{formatDuration(value)}</span>
      </div>
      <Slider
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={([v]) => onChange(v)}
        className={`mb-3 [&_[role=slider]]:bg-${color} [&_[role=slider]]:border-0`}
      />
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <label className="text-xs text-muted-foreground mb-1 block">Hours</label>
          <Input
            type="number"
            min={0}
            max={3}
            value={hours}
            onChange={(e) => setHours(parseInt(e.target.value) || 0)}
            className="h-8 text-sm rounded-lg"
          />
        </div>
        <span className="text-muted-foreground font-bold mt-4">:</span>
        <div className="flex-1">
          <label className="text-xs text-muted-foreground mb-1 block">Minutes</label>
          <Input
            type="number"
            min={0}
            max={59}
            value={minutes}
            onChange={(e) => setMinutes(parseInt(e.target.value) || 0)}
            className="h-8 text-sm rounded-lg"
          />
        </div>
      </div>
    </div>
  );
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
          <DurationInput
            label="Focus Duration"
            value={focusDuration}
            min={1}
            max={180}
            step={5}
            color="primary"
            onChange={(v) => onUpdate({ focusDuration: v })}
          />
          <DurationInput
            label="Break Duration"
            value={breakDuration}
            min={1}
            max={180}
            step={1}
            color="accent"
            onChange={(v) => onUpdate({ breakDuration: v })}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
