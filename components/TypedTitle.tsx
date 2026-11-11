import { useEffect, useRef, useState } from "react";

function useTypeTransition(
  a: string,
  b: string,
  delay = 1500,
  typeSpeed = 80,
  cyclePause = 10000,
) {
  // `showingA`: whether `text` is (a prefix of) `a` rather than `b`
  const [state, setState] = useState({ text: a, showingA: true });
  const forward = useRef(true); // true = a→b, false = b→a

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    const runCycle = () => {
      const from = forward.current ? a : b;
      const to = forward.current ? b : a;
      const showingA = forward.current;

      let i = from.length;
      const del = () => {
        i--;
        setState({ text: from.slice(0, i), showingA });
        if (i > 0) {
          timeout = setTimeout(del, typeSpeed * 0.6);
        } else {
          let j = 0;
          const type = () => {
            j++;
            setState({ text: to.slice(0, j), showingA: !showingA });
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

  return state;
}

interface TypedTitleProps {
  from: string;
  to: string;
}

const MONO = "font-mono font-medium tracking-normal";

/** Kept on the same line as the text before it by the word joiner. */
const Cursor = () => (
  <>
    {"\u2060"}
    <span className="inline-block w-[0.45em] h-[0.9em] bg-primary/50 ml-0.5 translate-y-[0.1em] animate-[pulse_1.5s_steps(1)_infinite]" />
  </>
);

/**
 * Hero heading that periodically retypes itself between `from` (the site name, set in
 * mono) and `to` (set in sans), with a blinking cursor.
 *
 * A "\n" in either string is a forced line break, typed like any other character, so a
 * word that would otherwise wrap halfway through typing can start on its own line.
 *
 * Either string may wrap over several lines: invisible copies of both, fully typed, share
 * one grid cell with the typed text, so the heading is always as tall as the taller of
 * the two and the content below it doesn't move while retyping. (A prefix never wraps
 * onto more lines than the whole string.)
 */
export function TypedTitle({ from, to }: TypedTitleProps) {
  const { text, showingA } = useTypeTransition(from, to);
  const cell = "col-start-1 row-start-1";

  return (
    <h1 className="grid whitespace-pre-line text-5xl md:text-7xl font-bold tracking-tight text-foreground mb-6">
      <span aria-hidden className={`${cell} invisible ${MONO}`}>
        {from}
        <Cursor />
      </span>
      <span aria-hidden className={`${cell} invisible`}>
        {to}
        <Cursor />
      </span>
      <span className={`${cell} ${showingA ? MONO : ""}`}>
        {text}
        <Cursor />
      </span>
    </h1>
  );
}
