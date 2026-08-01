export interface RegexMatch {
  match: string;
  index: number;
  groups: string[];
}

export interface RegexTestResult {
  matches: RegexMatch[];
  error: string | null;
}

const MAX_MATCHES = 1000;

export function testRegex(pattern: string, flags: string, input: string): RegexTestResult {
  if (!pattern || !input) return { matches: [], error: null };

  try {
    const globalFlags = flags.includes("g") ? flags : `${flags}g`;
    const regex = new RegExp(pattern, globalFlags);
    const matches: RegexMatch[] = [];
    let match: RegExpExecArray | null;

    while ((match = regex.exec(input)) !== null && matches.length < MAX_MATCHES) {
      matches.push({ match: match[0], index: match.index, groups: match.slice(1) });
      if (match[0] === "") regex.lastIndex += 1; // avoid an infinite loop on zero-length matches
    }

    return { matches, error: null };
  } catch (err) {
    return { matches: [], error: err instanceof Error ? err.message : "Invalid regular expression." };
  }
}

export interface HighlightSegment {
  text: string;
  matched: boolean;
}

export function buildHighlightSegments(input: string, matches: RegexMatch[]): HighlightSegment[] {
  if (matches.length === 0) return [{ text: input, matched: false }];

  const segments: HighlightSegment[] = [];
  let cursor = 0;

  for (const match of matches) {
    if (match.index > cursor) {
      segments.push({ text: input.slice(cursor, match.index), matched: false });
    }
    if (match.match.length > 0) {
      segments.push({ text: match.match, matched: true });
      cursor = match.index + match.match.length;
    } else {
      cursor = match.index;
    }
  }

  if (cursor < input.length) {
    segments.push({ text: input.slice(cursor), matched: false });
  }

  return segments;
}
