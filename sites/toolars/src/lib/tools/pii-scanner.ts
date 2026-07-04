export type PiiEntityType =
  | "email"
  | "phone"
  | "ssn"
  | "credit_card"
  | "ip_address"
  | "name"
  | "address"
  | "date_of_birth";

export type PiiRiskLevel = "low" | "medium" | "high" | "critical";

export interface PiiEntity {
  type: PiiEntityType;
  value: string;
  start: number;
  end: number;
  confidence: number;
}

export interface PiiScanResult {
  entities: PiiEntity[];
  redacted: string;
  score: number;
  riskLevel: PiiRiskLevel;
  summary: string;
  privacyNote: string;
}

const patterns: Record<PiiEntityType, RegExp[]> = {
  email: [/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g],
  phone: [/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, /\(\d{3}\)\s?\d{3}[-.]?\d{4}\b/g, /\b\d{3}\s\d{3}\s\d{4}\b/g],
  ssn: [/\b\d{3}-\d{2}-\d{4}\b/g, /\bSSN\s+\d{3}-\d{2}-\d{4}\b/gi],
  credit_card: [/\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g],
  ip_address: [/\b(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\b/g],
  name: [/\b(?:Mr\.|Mrs\.|Ms\.|Dr\.|Prof\.)\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g],
  address: [/\b\d{1,5}\s+(?:[A-Z][a-z]+\s*)+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Drive|Dr|Lane|Ln|Way|Court|Ct)\b/gi],
  date_of_birth: [/\b(?:DOB|Date of Birth|Birth Date)[:\s]+\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b/gi]
};

const sensitivity: Record<PiiEntityType, number> = {
  ssn: 18,
  credit_card: 16,
  date_of_birth: 12,
  email: 10,
  phone: 9,
  address: 10,
  name: 7,
  ip_address: 5
};

const privacyNote = "Local PII scan only; source text stays in the browser.";

export function scanPii(text: string): PiiScanResult {
  const entities = removeOverlaps(
    Object.entries(patterns).flatMap(([type, regexes]) =>
      regexes.flatMap((regex) =>
        Array.from(text.matchAll(regex), (match) => ({
          type: type as PiiEntityType,
          value: match[0],
          start: match.index ?? 0,
          end: (match.index ?? 0) + match[0].length,
          confidence: getConfidence(type as PiiEntityType, match[0])
        }))
      )
    )
  );
  const score = Math.min(100, Math.round(entities.reduce((sum, entity) => sum + sensitivity[entity.type] * entity.confidence, 0) * 1.8));
  const riskLevel = getRiskLevel(score);

  return {
    entities,
    redacted: redact(text, entities),
    score,
    riskLevel,
    summary: entities.length
      ? `${capitalize(riskLevel)} risk: detected ${entities.length.toLocaleString("en-US")} PII-like entities.`
      : "Low risk: local scan found no PII-like entities.",
    privacyNote
  };
}

function removeOverlaps(entities: PiiEntity[]): PiiEntity[] {
  return [...entities]
    .sort((a, b) => a.start - b.start || b.confidence - a.confidence)
    .reduce<PiiEntity[]>((kept, entity) => {
      const overlapIndex = kept.findIndex((item) => entity.start < item.end && entity.end > item.start);
      if (overlapIndex === -1) return [...kept, entity];
      if (entity.confidence > kept[overlapIndex].confidence) {
        const next = [...kept];
        next[overlapIndex] = entity;
        return next;
      }
      return kept;
    }, []);
}

function redact(text: string, entities: PiiEntity[]): string {
  return [...entities]
    .sort((a, b) => b.start - a.start)
    .reduce((output, entity) => `${output.slice(0, entity.start)}${redactionFor(entity.type)}${output.slice(entity.end)}`, text);
}

function redactionFor(type: PiiEntityType): string {
  const redactions: Record<PiiEntityType, string> = {
    email: "[REDACTED_EMAIL]",
    phone: "[REDACTED_PHONE]",
    ssn: "[REDACTED_SSN]",
    credit_card: "[REDACTED_CREDIT_CARD]",
    ip_address: "[REDACTED_IP]",
    name: "[REDACTED_NAME]",
    address: "[REDACTED_ADDRESS]",
    date_of_birth: "[REDACTED_DOB]"
  };
  return redactions[type];
}

function getConfidence(type: PiiEntityType, value: string): number {
  if (type === "email" || type === "ssn") return 0.98;
  if (type === "phone") return value.includes("(") || value.includes("-") ? 0.92 : 0.76;
  if (type === "credit_card") return 0.9;
  if (type === "name") return 0.62;
  return 0.8;
}

function getRiskLevel(score: number): PiiRiskLevel {
  if (score >= 85) return "critical";
  if (score >= 55) return "high";
  if (score >= 25) return "medium";
  return "low";
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
