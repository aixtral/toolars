export interface UAResult {
  browser: { name: string; version: string };
  os: { name: string; version: string };
  device: "desktop" | "mobile" | "tablet" | "bot" | "unknown";
  engine: string;
  raw: string;
  privacyNote: string;
}

const browserPatterns: Array<{ name: string; pattern: RegExp }> = [
  { name: "Googlebot", pattern: /Googlebot\/([\d.]+)/ },
  { name: "Bingbot", pattern: /bingbot\/([\d.]+)/ },
  { name: "Edge", pattern: /Edg(?:e|A|iOS)?\/([\d.]+)/ },
  { name: "OPR", pattern: /OPR\/([\d.]+)/ },
  { name: "Opera", pattern: /Opera\/([\d.]+)/ },
  { name: "Vivaldi", pattern: /Vivaldi\/([\d.]+)/ },
  { name: "YaBrowser", pattern: /YaBrowser\/([\d.]+)/ },
  { name: "Samsung Internet", pattern: /SamsungBrowser\/([\d.]+)/ },
  { name: "UCBrowser", pattern: /UCBrowser\/([\d.]+)/ },
  { name: "Firefox", pattern: /Firefox\/([\d.]+)/ },
  { name: "Safari", pattern: /Version\/([\d.]+).*Safari/ },
  { name: "Chrome", pattern: /Chrome\/([\d.]+)/ }
];

const osPatterns: Array<{ name: string; pattern: RegExp; versionTransform?: (value: string) => string }> = [
  { name: "Windows", pattern: /Windows NT ([\d.]+)/ },
  { name: "macOS", pattern: /Mac OS X ([\d_]+)/, versionTransform: (value) => value.replace(/_/g, ".") },
  { name: "iOS", pattern: /iPhone OS ([\d_]+)/, versionTransform: (value) => value.replace(/_/g, ".") },
  { name: "iOS", pattern: /iPad.*CPU OS ([\d_]+)/, versionTransform: (value) => value.replace(/_/g, ".") },
  { name: "Android", pattern: /Android ([\d.]+)/ },
  { name: "Linux", pattern: /Linux/ },
  { name: "CrOS", pattern: /CrOS/ }
];

const botPatterns = [/bot/i, /crawl/i, /spider/i, /slurp/i, /mediapartners/i];
const tabletPatterns = [/iPad/i, /Tablet/i, /PlayBook/i];
const privacyNote = "Local User-Agent parsing only; strings stay in the browser.";

export function parseUserAgent(ua: string): UAResult {
  if (!ua.trim()) {
    return {
      browser: { name: "Unknown", version: "" },
      os: { name: "Unknown", version: "" },
      device: "unknown",
      engine: "Unknown",
      raw: ua,
      privacyNote
    };
  }

  return {
    browser: detectBrowser(ua),
    os: detectOS(ua),
    device: detectDevice(ua),
    engine: detectEngine(ua),
    raw: ua,
    privacyNote
  };
}

function detectBrowser(ua: string): { name: string; version: string } {
  for (const { name, pattern } of browserPatterns) {
    const match = ua.match(pattern);
    if (match) return { name, version: match[1] };
  }

  return { name: "Unknown", version: "" };
}

function detectOS(ua: string): { name: string; version: string } {
  for (const { name, pattern, versionTransform } of osPatterns) {
    const match = ua.match(pattern);
    if (match) {
      const version = match[1] ? (versionTransform ? versionTransform(match[1]) : match[1]) : "";
      return { name, version };
    }
  }

  return { name: "Unknown", version: "" };
}

function detectDevice(ua: string): UAResult["device"] {
  if (botPatterns.some((pattern) => pattern.test(ua))) return "bot";
  if (tabletPatterns.some((pattern) => pattern.test(ua))) return "tablet";
  if (/Mobile|Android(?!.*Tablet)|iPhone|iPod/i.test(ua)) return "mobile";
  if (ua.includes("Mozilla")) return "desktop";
  return "unknown";
}

function detectEngine(ua: string): string {
  if (/Edg|OPR|Chrome|Vivaldi|YaBrowser|SamsungBrowser/i.test(ua)) return "Blink";
  if (/Firefox/i.test(ua)) return "Gecko";
  if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) return "WebKit";
  return "Unknown";
}
