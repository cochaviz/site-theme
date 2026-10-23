import type { ReactNode } from "react";

/** Full-height page with a single centered content column. Change the column width here. */
export function PageColumn({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex">
      <main className="flex-1 flex justify-center pt-16 md:pt-0">
        <div className="w-full max-w-2xl px-6 md:px-0">{children}</div>
      </main>
    </div>
  );
}
