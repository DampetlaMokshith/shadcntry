// ─── ATS Scoring System ────────────────────────────────────────────────────
// Calculates match scores between JD and resume using keyword analysis.

import type {
  ATSResult,
  CategoryScore,
  CategorizedKeywords,
  KeywordCategory,
  ParsedExperience,
  Suggestion,
} from "./types";
import {
  extractKeywords,
  flattenKeywords,
  detectRequiredVsPreferred,
  parseExperience,
} from "./keyword-engine";

// ─── Category Weights ─────────────────────────────────────────────────────

const CATEGORY_CONFIG: {
  key: KeywordCategory;
  label: string;
  weight: number;
}[] = [
  { key: "hardSkills", label: "Hard Skills", weight: 0.4 },
  { key: "softSkills", label: "Soft Skills", weight: 0.15 },
  { key: "education", label: "Education", weight: 0.15 },
  { key: "experience", label: "Experience", weight: 0.15 },
  { key: "jobSpecific", label: "Job-Specific Terms", weight: 0.15 },
];

// ─── Score Calculation ────────────────────────────────────────────────────

function calculateCategoryScore(
  category: KeywordCategory,
  label: string,
  weight: number,
  jdKeywords: string[],
  resumeKeywords: string[]
): CategoryScore {
  if (jdKeywords.length === 0) {
    return {
      category,
      label,
      matched: [],
      missing: [],
      score: 100,
      weight,
    };
  }

  const resumeSet = new Set(resumeKeywords.map((k) => k.toLowerCase()));
  const matched: string[] = [];
  const missing: string[] = [];

  for (const keyword of jdKeywords) {
    const lower = keyword.toLowerCase();
    // Check exact match or partial match (e.g., "react" matches "reactjs")
    // But NO Levenshtein for short strings — prevents "java" ≈ "jira" false positives
    const isMatched =
      resumeSet.has(lower) ||
      Array.from(resumeSet).some(
        (rk) =>
          rk.includes(lower) ||
          lower.includes(rk) ||
          (lower.length >= 5 && rk.length >= 5 && levenshteinSimilarity(lower, rk) > 0.85)
      );

    if (isMatched) {
      matched.push(keyword);
    } else {
      missing.push(keyword);
    }
  }

  const score =
    jdKeywords.length > 0
      ? Math.round((matched.length / jdKeywords.length) * 100)
      : 100;

  return { category, label, matched, missing, score, weight };
}

/**
 * Experience-specific scoring using NUMERIC comparison.
 * "3 years of experience" vs "4+ years required" → compares 3 >= 4 → NOT a match.
 * Falls back to keyword matching for seniority levels (senior, junior, etc).
 */
function calculateExperienceScore(
  weight: number,
  jdText: string,
  resumeText: string,
  jdExpKeywords: string[],
  resumeExpKeywords: string[]
): CategoryScore {
  const jdExperience = parseExperience(jdText);
  const resumeExperience = parseExperience(resumeText);

  // If neither side has structured experience data, fall back to keyword matching
  if (jdExperience.length === 0 && jdExpKeywords.length === 0) {
    return {
      category: "experience",
      label: "Experience",
      matched: [],
      missing: [],
      score: 100,
      weight,
    };
  }

  const matched: string[] = [];
  const missing: string[] = [];

  // Get the max years from the resume (candidate's total experience)
  const resumeMaxYears = resumeExperience.length > 0
    ? Math.max(...resumeExperience.map((e) => e.minYears))
    : null;

  // Compare each JD experience requirement against the resume
  for (const jdExp of jdExperience) {
    if (resumeMaxYears !== null) {
      const requiredYears = jdExp.minYears;

      if (resumeMaxYears >= requiredYears) {
        matched.push(`${requiredYears}+ yrs required ✓ (You have: ${resumeMaxYears} yrs)`);
      } else {
        const gap = requiredYears - resumeMaxYears;
        missing.push(`${requiredYears}+ yrs required (You have: ${resumeMaxYears} yrs, ${gap} yr${gap > 1 ? 's' : ''} short)`);
      }
    } else {
      // Resume has no detectable experience numbers
      missing.push(`${jdExp.raw} (not found in resume)`);
    }
  }

  // Handle seniority level matches separately
  const jdLevels = jdExperience.filter((e) => e.level !== null);
  const resumeLevels = resumeExperience.filter((e) => e.level !== null);

  for (const jdLevel of jdLevels) {
    const hasMatch = resumeLevels.some((r) => r.level === jdLevel.level);
    if (hasMatch) {
      if (!matched.some((m) => m.includes(jdLevel.level!))) {
        matched.push(`${jdLevel.level} level`);
      }
    } else {
      if (!missing.some((m) => m.includes(jdLevel.level!))) {
        missing.push(`${jdLevel.level} level (not found in resume)`);
      }
    }
  }

  // If no structured data was found in JD, fall back to raw keyword string comparison
  // but WITHOUT Levenshtein (experience strings are too similar to each other)
  if (jdExperience.length === 0 && jdExpKeywords.length > 0) {
    const resumeExpSet = new Set(resumeExpKeywords.map((k) => k.toLowerCase()));
    for (const kw of jdExpKeywords) {
      const lower = kw.toLowerCase();
      const isFound = resumeExpSet.has(lower) ||
        Array.from(resumeExpSet).some((rk) => rk.includes(lower) || lower.includes(rk));
      if (isFound) {
        matched.push(kw);
      } else {
        missing.push(kw);
      }
    }
  }

  const total = matched.length + missing.length;
  const score = total > 0 ? Math.round((matched.length / total) * 100) : 100;

  return {
    category: "experience",
    label: "Experience",
    matched,
    missing,
    score,
    weight,
  };
}

/**
 * Simple Levenshtein distance-based similarity for fuzzy matching.
 * Returns a value between 0 and 1 (1 = identical).
 */
function levenshteinSimilarity(a: string, b: string): number {
  if (a === b) return 1;
  if (a.length === 0 || b.length === 0) return 0;

  const matrix: number[][] = [];

  for (let i = 0; i <= a.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= b.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }

  const distance = matrix[a.length][b.length];
  const maxLen = Math.max(a.length, b.length);
  return 1 - distance / maxLen;
}

// ─── Main Analysis Function ───────────────────────────────────────────────

export function analyzeMatch(
  jdText: string,
  resumeText: string
): ATSResult {
  const jdKeywords = extractKeywords(jdText);
  const resumeKeywords = extractKeywords(resumeText);

  const allJdKeywords = flattenKeywords(jdKeywords);
  const allResumeKeywords = flattenKeywords(resumeKeywords);

  // Calculate per-category scores
  // Experience uses special numeric comparison; others use keyword matching
  const categoryScores: CategoryScore[] = CATEGORY_CONFIG.map((config) => {
    if (config.key === "experience") {
      return calculateExperienceScore(
        config.weight,
        jdText,
        resumeText,
        jdKeywords.experience,
        resumeKeywords.experience
      );
    }
    return calculateCategoryScore(
      config.key,
      config.label,
      config.weight,
      jdKeywords[config.key],
      resumeKeywords[config.key]
    );
  });

  // Calculate weighted overall score
  const totalWeight = categoryScores.reduce(
    (sum, cs) => sum + (cs.matched.length + cs.missing.length > 0 ? cs.weight : 0),
    0
  );

  const overallScore =
    totalWeight > 0
      ? Math.round(
          categoryScores.reduce(
            (sum, cs) =>
              sum +
              cs.score *
                (cs.matched.length + cs.missing.length > 0 ? cs.weight : 0),
            0
          ) / totalWeight
        )
      : 0;

  // Collect all matched & missing
  const matchedKeywords = categoryScores.flatMap((cs) => cs.matched);
  const missingKeywords = categoryScores.flatMap((cs) => cs.missing);

  // Detect required vs preferred for missing keywords
  const { required: requiredMissing, preferred: preferredMissing } =
    detectRequiredVsPreferred(jdText, missingKeywords);

  // Generate suggestions
  const suggestions = generateSuggestions(
    categoryScores,
    requiredMissing,
    preferredMissing,
    jdKeywords,
    resumeKeywords
  );

  return {
    overallScore,
    categoryScores,
    matchedKeywords,
    missingKeywords,
    suggestions,
    jdKeywordCount: allJdKeywords.length,
    resumeKeywordCount: allResumeKeywords.length,
    requiredMissing,
    preferredMissing,
  };
}

// ─── Suggestion Generator ─────────────────────────────────────────────────

function generateSuggestions(
  categoryScores: CategoryScore[],
  requiredMissing: string[],
  preferredMissing: string[],
  _jdKeywords: CategorizedKeywords,
  _resumeKeywords: CategorizedKeywords
): Suggestion[] {
  const suggestions: Suggestion[] = [];
  let id = 0;

  // 1. Missing required hard skills — highest priority
  const missingHardSkills = categoryScores.find(
    (cs) => cs.category === "hardSkills"
  );
  if (missingHardSkills && missingHardSkills.missing.length > 0) {
    const requiredHard = missingHardSkills.missing.filter((k) =>
      requiredMissing.includes(k)
    );
    const preferredHard = missingHardSkills.missing.filter((k) =>
      preferredMissing.includes(k)
    );

    if (requiredHard.length > 0) {
      suggestions.push({
        id: `s-${id++}`,
        priority: "high",
        category: "hardSkills",
        title: "Add missing required technical skills",
        description: `Your resume is missing ${requiredHard.length} required technical skill(s) mentioned in the job description. Add these to your skills section or weave them into your experience descriptions.`,
        keywords: requiredHard,
      });
    }

    if (preferredHard.length > 0) {
      suggestions.push({
        id: `s-${id++}`,
        priority: "medium",
        category: "hardSkills",
        title: "Consider adding preferred technical skills",
        description: `The JD lists ${preferredHard.length} preferred/bonus technical skill(s) you're missing. Adding these would strengthen your application.`,
        keywords: preferredHard,
      });
    }
  }

  // 2. Missing soft skills
  const missingSoftSkills = categoryScores.find(
    (cs) => cs.category === "softSkills"
  );
  if (missingSoftSkills && missingSoftSkills.missing.length > 0) {
    suggestions.push({
      id: `s-${id++}`,
      priority: missingSoftSkills.missing.length > 3 ? "high" : "medium",
      category: "softSkills",
      title: "Incorporate missing soft skills",
      description: `The JD emphasizes ${missingSoftSkills.missing.length} soft skill(s) not found in your resume. Integrate these into your experience bullet points or summary.`,
      keywords: missingSoftSkills.missing,
    });
  }

  // 3. Education gaps
  const missingEducation = categoryScores.find(
    (cs) => cs.category === "education"
  );
  if (missingEducation && missingEducation.missing.length > 0) {
    suggestions.push({
      id: `s-${id++}`,
      priority: "medium",
      category: "education",
      title: "Address education/certification requirements",
      description: `The JD mentions ${missingEducation.missing.length} education or certification keyword(s) missing from your resume. If you have relevant qualifications, make sure they're clearly listed.`,
      keywords: missingEducation.missing,
    });
  }

  // 4. Experience gaps
  const missingExperience = categoryScores.find(
    (cs) => cs.category === "experience"
  );
  if (missingExperience && missingExperience.missing.length > 0) {
    suggestions.push({
      id: `s-${id++}`,
      priority: "high",
      category: "experience",
      title: "Match experience level requirements",
      description: `The JD specifies experience requirements that your resume doesn't clearly address. Make sure your years of experience and seniority level are explicit.`,
      keywords: missingExperience.missing,
    });
  }

  // 5. Job-specific terminology
  const missingJobSpecific = categoryScores.find(
    (cs) => cs.category === "jobSpecific"
  );
  if (missingJobSpecific && missingJobSpecific.missing.length > 0) {
    const topMissing = missingJobSpecific.missing.slice(0, 10);
    suggestions.push({
      id: `s-${id++}`,
      priority: "low",
      category: "jobSpecific",
      title: "Use industry-specific terminology",
      description: `Your resume doesn't include ${missingJobSpecific.missing.length} industry/role-specific term(s) from the JD. Mirror the exact language when describing similar concepts.`,
      keywords: topMissing,
    });
  }

  // 6. General formatting suggestions based on overall score
  const overallHardScore = missingHardSkills?.score ?? 100;
  if (overallHardScore < 50) {
    suggestions.push({
      id: `s-${id++}`,
      priority: "high",
      category: "hardSkills",
      title: "Consider tailoring your resume for this role",
      description:
        "Your resume matches less than 50% of the required technical skills. Consider creating a tailored version specifically for this role, highlighting relevant projects and experience.",
      keywords: [],
    });
  }

  return suggestions.sort((a, b) => {
    const priority = { high: 0, medium: 1, low: 2 };
    return priority[a.priority] - priority[b.priority];
  });
}
