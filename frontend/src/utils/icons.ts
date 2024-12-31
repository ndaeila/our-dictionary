import { Monitor, FlaskConical, Palette } from 'lucide-react';

// Map category icons to their corresponding Lucide components
export const categoryIcons = {
  Monitor,
  FlaskConical,
  Palette,
} as const;

export type IconName = keyof typeof categoryIcons;