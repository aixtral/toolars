export type UrlParserErrorType = "invalid-url" | "invalid-percent-sequence" | "conversion-failed";

export interface UrlQueryPair {
  key: string;
  value: string;
}

export interface ParsedUrl {
  protocol: string;
  hostname: string;
  port: string;
  pathname: string;
  hash: string;
  origin: string;
  search: string;
  params: Record<string, string>;
  queryPairs: UrlQueryPair[];
}

export interface UrlParserError {
  type: UrlParserErrorType;
  message: string;
}

export interface UrlParseResult {
  success: boolean;
  output?: ParsedUrl;
  error?: UrlParserError;
  stats: {
    inputLength: number;
    queryCount: number;
  };
  summary: string;
  privacyNote: string;
}

export interface UrlCodeResult {
  success: boolean;
  output: string;
  error?: UrlParserError;
  stats: {
    inputLength: number;
    outputLength: number;
  };
}

const privacyNote = "Local URL parsing only; URLs stay in the browser.";

export function parseUrl(url: string): UrlParseResult {
  try {
    const parsed = new URL(url);
    const params: Record<string, string> = {};
    const queryPairs: UrlQueryPair[] = [];

    parsed.searchParams.forEach((value, key) => {
      params[key] = value;
      queryPairs.push({ key, value });
    });

    return {
      success: true,
      output: {
        protocol: parsed.protocol,
        hostname: parsed.hostname,
        port: parsed.port,
        pathname: parsed.pathname,
        hash: parsed.hash,
        origin: parsed.origin,
        search: parsed.search,
        params,
        queryPairs
      },
      stats: {
        inputLength: url.length,
        queryCount: queryPairs.length
      },
      summary: `Parsed ${url.length.toLocaleString("en-US")} characters with ${queryPairs.length.toLocaleString("en-US")} query pairs.`,
      privacyNote
    };
  } catch (error) {
    return {
      success: false,
      error: {
        type: "invalid-url",
        message: error instanceof Error ? error.message : "Invalid URL format"
      },
      stats: {
        inputLength: url.length,
        queryCount: 0
      },
      summary: "URL parsing failed.",
      privacyNote
    };
  }
}

export function encodeUrlComponent(input: string): UrlCodeResult {
  try {
    const output = encodeURIComponent(input);
    return {
      success: true,
      output,
      stats: {
        inputLength: input.length,
        outputLength: output.length
      }
    };
  } catch (error) {
    return {
      success: false,
      output: "",
      error: {
        type: "conversion-failed",
        message: error instanceof Error ? error.message : "Failed to encode URL component"
      },
      stats: {
        inputLength: input.length,
        outputLength: 0
      }
    };
  }
}

export function decodeUrlComponent(input: string): UrlCodeResult {
  try {
    const output = decodeURIComponent(input);
    return {
      success: true,
      output,
      stats: {
        inputLength: input.length,
        outputLength: output.length
      }
    };
  } catch (error) {
    return {
      success: false,
      output: "",
      error: {
        type: "invalid-percent-sequence",
        message: error instanceof Error ? error.message : "Failed to decode URL component"
      },
      stats: {
        inputLength: input.length,
        outputLength: 0
      }
    };
  }
}
