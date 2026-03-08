import { Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { COLOR_THEMES, type ColorTheme } from '@/hooks/useColorTheme';
import { cn } from '@/lib/utils';

interface ColorThemePickerProps {
  current: ColorTheme;
  onChange: (theme: ColorTheme) => void;
}

export function ColorThemePicker({ current, onChange }: ColorThemePickerProps) {
  const themes = Object.entries(COLOR_THEMES) as [ColorTheme, typeof COLOR_THEMES[ColorTheme]][];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-xl">
          <Palette className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-3" align="end">
        <p className="text-xs font-medium text-muted-foreground mb-2">Color Theme</p>
        <div className="grid grid-cols-3 gap-2">
          {themes.map(([key, theme]) => (
            <button
              key={key}
              onClick={() => onChange(key)}
              className={cn(
                'flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all duration-200',
                current === key
                  ? 'bg-muted ring-2 ring-primary/40'
                  : 'hover:bg-muted/60'
              )}
            >
              <div
                className="w-6 h-6 rounded-full ring-2 ring-border shadow-sm"
                style={{ backgroundColor: theme.preview }}
              />
              <span className="text-[10px] font-medium text-foreground">{theme.label}</span>
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
