import { Moon, Sun } from 'lucide-react';
import { Switch } from '@/components/ui/switch.tsx';
import { useTheme } from '@/hooks/useTheme.ts';

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';

  const handleChange = (checked: boolean) => {
    setTheme(checked ? 'dark' : 'light');
  };

  return (
    <Switch
      checked={isDark}
      onCheckedChange={handleChange}
      checkedIcon={<Sun size={12} />}
      className="bg-gray-300 dark:bg-gray-700"
      uncheckedIcon={<Moon className="stroke-black" size={12} />}
    />
  );
}
