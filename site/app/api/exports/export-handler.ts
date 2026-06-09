import { getSessionFromRequest } from '@/lib/auth';
import type { ToolarsSession } from '@/lib/auth';
import {
  evaluateExportAccess,
  getPlanById,
  type ExportFormat,
} from '@/lib/plans';
import { recordSecurityEvent } from '@/lib/security/events';
import {
  createMonthlyUsagePeriod,
  type UsageMeterRepository,
} from '@/lib/usage';
import { createUsageMeterRuntimeRepository } from '@/lib/usage/runtime';

export interface ExportHandlerOptions {
  usageRepository?: UsageMeterRepository;
  resolveSession?: (request: Request) => Promise<ToolarsSession | null>;
  now?: () => Date;
}

type ExportPayload = {
  title: string;
  rows: readonly (readonly string[])[];
};

function exportRoute(format: ExportFormat) {
  return `/api/exports/${format}`;
}

function formatLabel(format: ExportFormat) {
  return format.toUpperCase();
}

function slugify(value: string) {
  const slug = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  return slug || 'export';
}

function normalizeRows(value: unknown): string[][] {
  if (!Array.isArray(value)) return [];

  return value
    .filter((row): row is unknown[] => Array.isArray(row))
    .map((row) => row.map((cell) => String(cell ?? '')));
}

async function readExportPayload(request: Request): Promise<ExportPayload | null> {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return null;
  }

  if (!payload || typeof payload !== 'object') return null;

  const record = payload as Record<string, unknown>;
  const title = typeof record.title === 'string' ? record.title.trim() : '';
  const rows = normalizeRows(record.rows);

  if (!title || rows.length === 0) return null;

  return { title, rows };
}

function escapeCsvCell(value: string) {
  if (!/[",\n\r]/.test(value)) return value;
  return `"${value.replaceAll('"', '""')}"`;
}

function buildCsvPayload(rows: ExportPayload['rows']) {
  return rows.map((row) => row.map(escapeCsvCell).join(',')).join('\n');
}

function buildExportPayload(format: ExportFormat, payload: ExportPayload) {
  const filename = `toolars-${slugify(payload.title)}.${format}`;

  if (format === 'csv') {
    return {
      format,
      filename,
      contentType: 'text/csv',
      payload: buildCsvPayload(payload.rows),
    };
  }

  return {
    format,
    filename,
    contentType: 'application/pdf',
    payloadKind: 'preview',
    payload: `Toolars PDF export preview: ${payload.title}`,
  };
}

export function createExportHandler(
  format: ExportFormat,
  options: ExportHandlerOptions = {},
) {
  return async function exportHandler(request: Request) {
    const route = exportRoute(format);
    const session = await (options.resolveSession ?? getSessionFromRequest)(request);

    if (!session) {
      recordSecurityEvent({
        request,
        route,
        category: 'usage',
        action: 'missing_session',
        outcome: 'denied',
        status: 401,
        metadata: {
          format,
        },
      });
      return Response.json(
        { error: `Account required for ${formatLabel(format)} exports.` },
        { status: 401 },
      );
    }

    const payload = await readExportPayload(request);
    if (!payload) {
      recordSecurityEvent({
        request,
        route,
        category: 'usage',
        action: 'invalid_export_payload',
        outcome: 'invalid',
        status: 400,
        metadata: {
          userId: session.userId,
          planId: session.planId,
          format,
        },
      });
      return Response.json(
        { error: 'Export payload requires a title and rows.' },
        { status: 400 },
      );
    }

    const usageRepository =
      options.usageRepository ?? (await createUsageMeterRuntimeRepository());
    const period = createMonthlyUsagePeriod(options.now?.() ?? new Date());
    const usage = await usageRepository.readUsageSnapshot({
      workspaceId: session.workspaceId,
      period,
    });
    const gate = evaluateExportAccess({
      planId: session.planId,
      format,
      usedExports: usage.exportsUsed,
    });

    if (!gate.allowed) {
      recordSecurityEvent({
        request,
        route,
        category: 'usage',
        action: 'plan_denied',
        outcome: 'denied',
        status: 402,
        metadata: {
          userId: session.userId,
          planId: session.planId,
          format,
        },
      });
      return Response.json(
        { error: gate.reason, upgradeLabel: gate.upgradeLabel },
        { status: 402 },
      );
    }

    const updatedUsage = await usageRepository.incrementExports({
      workspaceId: session.workspaceId,
      period,
    });
    const plan = getPlanById(session.planId);

    return Response.json({
      export: buildExportPayload(format, payload),
      usage: {
        remainingExports: Math.max(0, plan.monthlyExports - updatedUsage.exportsUsed),
      },
    });
  };
}
