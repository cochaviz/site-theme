import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? resolvedTheme === "dark" : true;

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="font-mono text-xs border border-border bg-background px-3 py-1.5 w-16 text-center text-muted-foreground hover:text-primary hover:border-primary transition-colors"
      aria-label="Toggle theme"
    >
      <span suppressHydrationWarning>{isDark ? "light" : "dark"}</span>
    </button>
  );
}
