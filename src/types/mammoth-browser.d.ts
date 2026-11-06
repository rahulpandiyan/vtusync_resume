declare module "mammoth/mammoth.browser" {
  export interface MammothResult {
    value: string;
    messages: unknown[];
  }

  export interface ExtractOptions {
    arrayBuffer?: ArrayBuffer;
    path?: string;
    filename?: string;
  }

  export function extractRawText(options: ExtractOptions): Promise<MammothResult>;
  export function extractHtml(options: ExtractOptions): Promise<MammothResult & { html: string }>;
}
