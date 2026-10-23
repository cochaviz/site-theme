import type { ReactNode } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

/**
 * Dark by default, follows the system when chosen. Transitions are suspended while the
 * theme switches: otherwise every element's colour transition (see base.css) runs at
 * once and nested text visibly lags behind the background.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
      {children}
    </NextThemesProvider>
  );
}
