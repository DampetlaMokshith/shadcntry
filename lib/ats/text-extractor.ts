// ─── ATS Text Extraction Utilities ─────────────────────────────────────────
// Extracts plain text from PDF, DOCX, and TXT files client-side.

/**
 * Extract text from a PDF file using PDF.js (pdfjs-dist).
 * Runs entirely client-side — no server needed.
 */
export async function extractTextFromPdf(file: File): Promise<string> {
  const pdfjsLib = await import("pdfjs-dist");

  // Set the worker source — use the bundled worker
  pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.mjs",
    import.meta.url
  ).toString();

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  const textParts: string[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item) => {
        if ("str" in item) return item.str;
        return "";
      })
      .join(" ");
    textParts.push(pageText);
  }

  return textParts.join("\n").trim();
}

/**
 * Extract text from a DOCX file using mammoth.
 * Converts DOCX to plain text client-side.
 */
export async function extractTextFromDocx(file: File): Promise<string> {
  const mammoth = await import("mammoth");
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value.trim();
}

/**
 * Extract text from a plain text file using FileReader.
 */
export async function extractTextFromTxt(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).trim());
    reader.onerror = () => reject(new Error("Failed to read text file"));
    reader.readAsText(file);
  });
}

/**
 * Dispatch to the appropriate extractor based on file type.
 */
export async function extractTextFromFile(file: File): Promise<string> {
  const name = file.name.toLowerCase();
  const type = file.type.toLowerCase();

  if (name.endsWith(".pdf") || type === "application/pdf") {
    return extractTextFromPdf(file);
  }

  if (
    name.endsWith(".docx") ||
    type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    return extractTextFromDocx(file);
  }

  if (
    name.endsWith(".doc") ||
    type === "application/msword"
  ) {
    // .doc files are harder to parse client-side; try as text fallback
    return extractTextFromTxt(file);
  }

  if (
    name.endsWith(".txt") ||
    name.endsWith(".rtf") ||
    type.startsWith("text/")
  ) {
    return extractTextFromTxt(file);
  }

  // Default: try reading as text
  return extractTextFromTxt(file);
}

/**
 * Sanitize and extract readable text from raw HTML.
 * Used after fetching a JD from a URL.
 */
export function extractTextFromHtml(html: string): string {
  // Remove script and style tags completely
  let text = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "");
  text = text.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "");

  // Remove HTML tags
  text = text.replace(/<[^>]+>/g, " ");

  // Decode common HTML entities
  text = text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&#\d+;/g, " ");

  // Collapse whitespace
  text = text.replace(/\s+/g, " ").trim();

  return text;
}
