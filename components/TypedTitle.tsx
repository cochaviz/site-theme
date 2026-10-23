import { useEffect, useRef, useState } from "react";

function useTypeTransition(
  a: string,
  b: string,
  delay = 1500,
  typeSpeed = 80,
  cyclePause = 10000,
) {
  const [text, setText] = useState(a);
  const forward = useRef(true); // true = a→b, false = b→a

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    const runCycle = () => {
      const from = forward.current ? a : b;
      const to = forward.current ? b : a;

      let i = from.length;
      const del = () => {
        i--;
        setText(from.slice(0, i));
        if (i > 0) {
          timeout = setTimeout(del, typeSpeed * 0.6);
        } else {
          let j = 0;
          const type = () => {
            j++;
            setText(to.slice(0, j));
            if (j < to.length) {
              timeout = setTimeout(type, typeSpeed);
            } else {
              forward.current = !forward.current;
              timeout = setTimeout(runCycle, cyclePause);
            }
          };
          timeout = setTimeout(type, typeSpeed * 2);
        }
      };
      timeout = setTimeout(del, typeSpeed);
    };

    timeout = setTimeout(runCycle, delay);
    return () => clearTimeout(timeout);
  }, [a, b, delay, typeSpeed, cyclePause]);

  return text;
}

interface TypedTitleProps {
  from: string;
  to: string;
}

/** Hero heading that periodically retypes itself between `from` and `to`, with a blinking cursor. */
export function TypedTitle({ from, to }: TypedTitleProps) {
  const text = useTypeTransition(from, to);

  return (
    <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground mb-6">
      {text}
      <span className="inline-block w-[0.45em] h-[0.9em] bg-primary/50 ml-0.5 translate-y-[0.1em] animate-[pulse_1.5s_steps(1)_infinite]" />
    </h1>
  );
}
