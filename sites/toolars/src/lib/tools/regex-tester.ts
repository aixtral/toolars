export interface RegexMatch {
  fullMatch: string;
  index: number;
  groups: Record<string, string>;
  captures: string[];
}

export interface RegexTesterError {
  type: "invalid-pattern";
  message: string;
}

export interface RegexTestResult {
  success: boolean;
  matches: RegexMatch[];
  matchCount: number;
  error?: RegexTesterError;
  pattern: {
    source: string;
    flags: string;
    isValid: boolean;
  };
  stats: {
    totalMatches: number;
    uniqueMatches: number;
    executionTime: number;
  };
  privacyNote: string;
}

export function testRegex(pattern: string, flags: string, text: string): RegexTestResult {
  const startTime = performance.now();

  try {
    const regex = new RegExp(pattern, flags);
    const matches: RegexMatch[] = [];
    let match: RegExpExecArray | null;

    regex.lastIndex = 0;
    if (regex.global) {
      while ((match = regex.exec(text)) !== null) {
        matches.push(createRegexMatch(match));
        if (match[0].length === 0) regex.lastIndex += 1;
      }
    } else {
      match = regex.exec(text);
      if (match) matches.push(createRegexMatch(match));
    }

    return {
      success: true,
      matches,
      matchCount: matches.length,
      pattern: {
        source: regex.source,
        flags: regex.flags,
        isValid: true
      },
      stats: {
        totalMatches: matches.length,
        uniqueMatches: new Set(matches.map((item) => item.fullMatch)).size,
        executionTime: performance.now() - startTime
      },
      privacyNote: "Local regex testing only; sample text stays in the browser."
    };
  } catch (error) {
    return {
      success: false,
      matches: [],
      matchCount: 0,
      error: {
        type: "invalid-pattern",
        message: error instanceof Error ? error.message : "Invalid regular expression."
      },
      pattern: {
        source: pattern,
        flags,
        isValid: false
      },
      stats: {
        totalMatches: 0,
        uniqueMatches: 0,
        executionTime: performance.now() - startTime
      },
      privacyNote: "Local regex testing only; sample text stays in the browser."
    };
  }
}

export function getRegexFlagDescriptions(): Record<string, string> {
  return {
    g: "Global - find all matches, not just the first",
    i: "Case-insensitive - match regardless of case",
    m: "Multiline - ^ and $ match line boundaries",
    s: "Dotall - . matches newline characters",
    u: "Unicode - enable Unicode support",
    y: "Sticky - match only from lastIndex position"
  };
}

function createRegexMatch(match: RegExpExecArray): RegexMatch {
  const groups: Record<string, string> = {};
  for (const [key, value] of Object.entries(match.groups ?? {})) {
    groups[key] = value ?? "";
  }

  return {
    fullMatch: match[0],
    index: match.index,
    groups,
    captures: match.slice(1)
  };
}
