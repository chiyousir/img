declare module 'pdf-parse' {
  function parse(dataBuffer: Buffer, options?: {
    max?: number;
    version?: string;
  }): Promise<{
    text: string;
    numpages: number;
    info: any;
    metadata: any;
    version: string;
  }>;
  export = parse;
} 