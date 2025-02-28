// declarations.d.ts
declare module './pdf-extractor.js' {
    export function extractTextFromPDF(file: File): Promise<string>;
}