import { createExportHandler, type ExportHandlerOptions } from '../export-handler';

export function createCsvExportHandler(options: ExportHandlerOptions = {}) {
  return createExportHandler('csv', options);
}

export const POST = createCsvExportHandler();
