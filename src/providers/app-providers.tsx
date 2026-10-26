'use client';

import { MotionConfig } from 'framer-motion';

import { ThemeProvider } from './theme-provider';

export const AppProviders: FC = ({ children }) => (
  <ThemeProvider>
    <MotionConfig reducedMotion="user">{children}</MotionConfig>
  </ThemeProvider>
);
