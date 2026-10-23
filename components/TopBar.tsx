import { useEffect, useRef, useState, type ReactNode } from "react";

/** Fixed top-right button bar; slides away while scrolling down on mobile. */
export function TopBar({ children }: { children: ReactNode }) {
  const [hiddenOnMobile, setHiddenOnMobile] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;

      if (window.innerWidth >= 768) {
        setHiddenOnMobile(false);
        lastScrollY.current = currentY;
        return;
      }

      if (currentY <= 8) {
        setHiddenOnMobile(false);
      } else if (currentY > lastScrollY.current + 4) {
        setHiddenOnMobile(true);
      } else if (currentY < lastScrollY.current - 4) {
        setHiddenOnMobile(false);
      }

      lastScrollY.current = currentY;
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`fixed top-6 right-6 z-50 transition-all duration-300 md:translate-y-0 md:opacity-100 ${
        hiddenOnMobile
          ? "-translate-y-4 opacity-0 pointer-events-none"
          : "translate-y-0 opacity-100"
      }`}
    >
      <div className="flex items-center gap-2">{children}</div>
    </div>
  );
}
