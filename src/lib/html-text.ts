const NAMED_ENTITIES: Readonly<Record<string, string>> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: "\u00a0",
};

const MAX_CODE_POINT = 0x10ffff;

/** String.fromCodePoint throws above U+10FFFF — keep such entities as written. */
function fromCodePoint(code: number, fallback: string): string {
  return Number.isInteger(code) && code >= 0 && code <= MAX_CODE_POINT ? String.fromCodePoint(code) : fallback;
}

function decodeEntity(match: string, body: string): string {
  if (body.startsWith("#x") || body.startsWith("#X")) {
    return fromCodePoint(Number.parseInt(body.slice(2), 16), match);
  }
  if (body.startsWith("#")) {
    return fromCodePoint(Number.parseInt(body.slice(1), 10), match);
  }
  return NAMED_ENTITIES[body] ?? match;
}

/**
 * Plain text from a small HTML fragment, e.g. a Docusaurus TOC entry
 * ("Auth &amp; <code>JWT</code>" → "Auth & JWT"). Lets components render
 * it as escaped text instead of injecting HTML. Works during SSR (no DOM).
 */
export function htmlToText(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, decodeEntity);
}
