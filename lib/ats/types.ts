// ─── ATS System Type Definitions ───────────────────────────────────────────

export type KeywordCategory =
  | "hardSkills"
  | "softSkills"
  | "education"
  | "experience"
  | "jobSpecific";

export interface CategorizedKeywords {
  hardSkills: string[];
  softSkills: string[];
  education: string[];
  experience: string[];
  jobSpecific: string[];
}

/** Structured experience data parsed from raw text patterns */
export interface ParsedExperience {
  raw: string;           // original matched text e.g. "4+ years of experience"
  minYears: number;      // numeric lower bound e.g. 4
  maxYears: number | null; // upper bound for ranges like "3-5 years", null if open-ended
  isMinimum: boolean;    // true if "minimum", "at least", or "+" was used
  level: string | null;  // "senior" | "junior" | "mid" | "entry" | null
}


export interface CategoryScore {
  category: KeywordCategory;
  label: string;
  matched: string[];
  missing: string[];
  score: number; // 0-100
  weight: number; // fraction of total score
}

export interface ATSResult {
  overallScore: number; // 0-100
  categoryScores: CategoryScore[];
  matchedKeywords: string[];
  missingKeywords: string[];
  suggestions: Suggestion[];
  jdKeywordCount: number;
  resumeKeywordCount: number;
  requiredMissing: string[];
  preferredMissing: string[];
}

export interface Suggestion {
  id: string;
  priority: "high" | "medium" | "low";
  category: KeywordCategory;
  title: string;
  description: string;
  keywords: string[];
}

export type AnalysisState =
  | { status: "idle" }
  | { status: "extracting"; step: string }
  | { status: "analyzing" }
  | { status: "complete"; result: ATSResult }
  | { status: "error"; message: string };

export interface JDInput {
  mode: "text" | "url";
  text: string;
  url: string;
}

export interface ResumeInput {
  file: File | null;
  text: string;
  fileName: string;
}
