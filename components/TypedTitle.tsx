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

/**
 * Out of the text flow, so it doesn't change the layout or allow a line break where it
 * sits (an inline-block does, mid-word too); with no offsets it is drawn at its place in
 * the text, from the top of the line.
 */
const Cursor = () => (
  <span className="absolute ml-0.5 w-[0.45em] h-[0.9em] translate-y-[0.1em] bg-primary/50 animate-[pulse_1.5s_steps(1)_infinite]" />
);

/**
 * Hero heading that periodically retypes itself between `from` (the site name, set in
 * mono) and `to` (set in sans), with a blinking cursor.
 *
 * Nothing moves while it retypes, at any width: the untyped rest of the current string is
 * laid out too, invisibly, so each line breaks where it will once fully typed (a word
 * starts on the line it ends up on), and invisible copies of both strings share its grid
 * cell, so the heading is always as tall as the taller one. A "\n" in either string is a
 * forced line break.
 */
export function TypedTitle({ from, to }: TypedTitleProps) {
  const { text, showingA } = useTypeTransition(from, to);
  const full = showingA ? from : to;
  const cell = "col-start-1 row-start-1";

  return (
    <h1 className="grid whitespace-pre-line text-5xl md:text-7xl font-bold tracking-tight text-foreground mb-6">
      <span aria-hidden className={`${cell} invisible ${MONO}`}>
        {from}
      </span>
      <span aria-hidden className={`${cell} invisible`}>
        {to}
      </span>
      <span className={`${cell} ${showingA ? MONO : ""}`}>
        {text}
        <Cursor />
        <span aria-hidden className="invisible">
          {full.slice(text.length)}
        </span>
      </span>
    </h1>
  );
}
