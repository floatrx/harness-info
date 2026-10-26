'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';

// Dark-first site: the theme is fixed until a light palette is designed.
export const ThemeProvider: FC = ({ children }) => (
  <NextThemesProvider attribute="class" defaultTheme="dark" forcedTheme="dark" enableSystem={false}>
    {children}
  </NextThemesProvider>
);
