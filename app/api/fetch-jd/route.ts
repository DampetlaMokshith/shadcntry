// ─── Fetch JD from URL — Server-Side API Route ───────────────────────────
// Fetches a job description from a URL server-side to avoid CORS issues.
// Extracts readable text content from the HTML response.

import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { error: "URL is required" },
        { status: 400 }
      );
    }

    // Validate URL format
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
    } catch {
      return NextResponse.json(
        { error: "Invalid URL format" },
        { status: 400 }
      );
    }

    // Only allow http/https
    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      return NextResponse.json(
        { error: "Only HTTP and HTTPS URLs are supported" },
        { status: 400 }
      );
    }

    // Fetch the URL with a timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch URL: ${response.status} ${response.statusText}` },
        { status: 502 }
      );
    }

    const html = await response.text();

    // Extract text from HTML
    const text = extractTextFromHtml(html);

    if (!text || text.length < 20) {
      return NextResponse.json(
        { error: "Could not extract meaningful text from the URL. The page might require JavaScript or login." },
        { status: 422 }
      );
    }

    return NextResponse.json({ text, url });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      return NextResponse.json(
        { error: "Request timed out. The URL took too long to respond." },
        { status: 504 }
      );
    }

    return NextResponse.json(
      { error: "An unexpected error occurred while fetching the URL." },
      { status: 500 }
    );
  }
}

function extractTextFromHtml(html: string): string {
  // Remove script and style tags completely
  let text = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "");
  text = text.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "");
  text = text.replace(/<noscript[^>]*>[\s\S]*?<\/noscript>/gi, "");
  text = text.replace(/<header[^>]*>[\s\S]*?<\/header>/gi, "");
  text = text.replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, "");
  text = text.replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, "");

  // Replace block elements with newlines
  text = text.replace(/<\/(p|div|h[1-6]|li|tr|br|section|article)>/gi, "\n");
  text = text.replace(/<br\s*\/?>/gi, "\n");

  // Remove remaining HTML tags
  text = text.replace(/<[^>]+>/g, " ");

  // Decode HTML entities
  text = text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&#\d+;/g, " ");

  // Collapse whitespace and clean up
  text = text
    .split("\n")
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter((line) => line.length > 0)
    .join("\n");

  return text.trim();
}
