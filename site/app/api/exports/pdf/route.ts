import { createExportHandler, type ExportHandlerOptions } from '../export-handler';

export function createPdfExportHandler(options: ExportHandlerOptions = {}) {
  return createExportHandler('pdf', options);
}

export const POST = createPdfExportHandler();
