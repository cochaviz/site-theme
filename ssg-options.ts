import { readFileSync } from "node:fs";
import type { ViteReactSSGOptions } from "vite-react-ssg";

const fallbackFontFaces = readFileSync(new URL("./styles/fallback-fonts.css", import.meta.url), "utf8");

// vite-react-ssg options shared by both sites (`ssgOptions` in vite.config.ts).
export const ssgOptions: Partial<ViteReactSSGOptions> = {
  script: "defer",
  // Critical CSS is inlined by beasties. (`allowRules` is a beasties option missing from
  // vite-react-ssg's types.)
  beastiesOptions: {
    // The theme class is only added to <html> at runtime, so beasties can't see that
    // the `.dark` rules are needed.
    allowRules: [/\.dark\b/],
    preloadFonts: false,
    // Leave the fallback @font-face <style> injected below alone (beasties drops
    // @font-face rules that have no url() source).
    reduceInlineStyles: false,
  } as ViteReactSSGOptions["beastiesOptions"],
  // vite-react-ssg inserts the rendered app with `String.replace` when it finds an empty
  // `<div id="root"></div>`, which mangles `$$`, `$&`, ... in the content (and then
  // breaks hydration). With any other root tag it splices the HTML in safely.
  onBeforePageRender: (_path, indexHTML) =>
    indexHTML.replace('<div id="root"></div>', '<div id="root"> </div>'),
  // Metric-matched fallback fonts must apply from the first paint, or text shifts when
  // the full stylesheet loads.
  onPageRendered: (_path, html) => html.replace("</head>", `<style>${fallbackFontFaces}</style></head>`),
};
