"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import {
  IconUpload,
  IconFileTypePdf,
  IconFileTypeDocx,
  IconFileText,
  IconLink,
  IconAnalyze,
  IconX,
  IconAlertTriangle,
  IconCircleCheck,
  IconCircleMinus,
  IconArrowRight,
  IconSparkles,
  IconChevronDown,
  IconChevronUp,
  IconClipboardText,
  IconBriefcase,
  IconTarget,
} from "@tabler/icons-react";
import type {
  AnalysisState,
  JDInput,
  ResumeInput,
  ATSResult,
  CategoryScore,
  Suggestion,
} from "@/lib/ats/types";
import { extractTextFromFile } from "@/lib/ats/text-extractor";
import { analyzeMatch } from "@/lib/ats/scoring";

// ─── Score Color Utility ──────────────────────────────────────────────────

function getScoreColor(score: number): string {
  if (score >= 80) return "#22c55e";
  if (score >= 60) return "#eab308";
  if (score >= 40) return "#f97316";
  return "#ef4444";
}

function getScoreGradient(score: number): string {
  if (score >= 80) return "from-emerald-500 to-green-400";
  if (score >= 60) return "from-yellow-500 to-amber-400";
  if (score >= 40) return "from-orange-500 to-amber-500";
  return "from-red-500 to-rose-400";
}

function getScoreLabel(score: number): string {
  if (score >= 85) return "Excellent Match";
  if (score >= 70) return "Strong Match";
  if (score >= 55) return "Good Match";
  if (score >= 40) return "Fair Match";
  if (score >= 25) return "Weak Match";
  return "Poor Match";
}

function getPriorityColor(priority: string): string {
  if (priority === "high") return "bg-red-500/15 text-red-400 border-red-500/30";
  if (priority === "medium") return "bg-yellow-500/15 text-yellow-400 border-yellow-500/30";
  return "bg-blue-500/15 text-blue-400 border-blue-500/30";
}

function getPriorityLabel(priority: string): string {
  if (priority === "high") return "High Impact";
  if (priority === "medium") return "Medium Impact";
  return "Low Impact";
}

// ─── Animated Score Ring ──────────────────────────────────────────────────

function ScoreRing({ score, size = 200 }: { score: number; size?: number }) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedScore / 100) * circumference;

  useEffect(() => {
    let frame: number;
    let start: number | null = null;
    const duration = 1500;

    const animate = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(Math.round(eased * score));
      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      }
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [score]);

  const color = getScoreColor(animatedScore);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        className="-rotate-90"
        viewBox={`0 0 ${size} ${size}`}
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          className="text-white/5"
        />
        {/* Score arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transition: "stroke-dashoffset 0.1s ease-out",
            filter: `drop-shadow(0 0 8px ${color}60)`,
          }}
        />
      </svg>
      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="text-5xl font-bold tabular-nums"
          style={{ color }}
        >
          {animatedScore}
        </span>
        <span className="text-sm text-white/40 mt-0.5">out of 100</span>
      </div>
    </div>
  );
}

// ─── Category Score Bar ───────────────────────────────────────────────────

function CategoryBar({ cs }: { cs: CategoryScore }) {
  const [expanded, setExpanded] = useState(false);
  const total = cs.matched.length + cs.missing.length;

  if (total === 0) return null;

  return (
    <div className="ats-category-card">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-white/90">
            {cs.label}
          </span>
          <div className="flex items-center gap-2">
            <span
              className="text-sm font-bold tabular-nums"
              style={{ color: getScoreColor(cs.score) }}
            >
              {cs.score}%
            </span>
            {expanded ? (
              <IconChevronUp className="text-white/40" size={14} />
            ) : (
              <IconChevronDown className="text-white/40" size={14} />
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-2 rounded-full bg-white/5 overflow-hidden">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${getScoreGradient(cs.score)} transition-all duration-1000 ease-out`}
            style={{ width: `${cs.score}%` }}
          />
        </div>

        <div className="flex items-center gap-3 mt-2 text-xs text-white/40">
          <span className="flex items-center gap-1">
            <IconCircleCheck size={12} className="text-emerald-400" />
            {cs.matched.length} matched
          </span>
          <span className="flex items-center gap-1">
            <IconCircleMinus size={12} className="text-red-400" />
            {cs.missing.length} missing
          </span>
        </div>
      </button>

      {expanded && (
        <div className="mt-3 pt-3 border-t border-white/5">
          {cs.matched.length > 0 && (
            <div className="mb-2">
              <p className="text-xs text-white/30 mb-1.5">Matched</p>
              <div className="flex flex-wrap gap-1.5">
                {cs.matched.map((k) => (
                  <span key={k} className="ats-chip ats-chip-matched">
                    {k}
                  </span>
                ))}
              </div>
            </div>
          )}
          {cs.missing.length > 0 && (
            <div>
              <p className="text-xs text-white/30 mb-1.5">Missing</p>
              <div className="flex flex-wrap gap-1.5">
                {cs.missing.map((k) => (
                  <span key={k} className="ats-chip ats-chip-missing">
                    {k}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Suggestion Card ──────────────────────────────────────────────────────

function SuggestionCard({ suggestion }: { suggestion: Suggestion }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="ats-suggestion-card">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left"
      >
        <div className="flex items-start gap-3">
          <span
            className={`inline-flex px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider border ${getPriorityColor(suggestion.priority)}`}
          >
            {getPriorityLabel(suggestion.priority)}
          </span>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-white/90">
              {suggestion.title}
            </h4>
            {expanded && (
              <p className="text-xs text-white/50 mt-1.5 leading-relaxed">
                {suggestion.description}
              </p>
            )}
          </div>
          {expanded ? (
            <IconChevronUp className="text-white/30 shrink-0" size={14} />
          ) : (
            <IconChevronDown className="text-white/30 shrink-0" size={14} />
          )}
        </div>
      </button>

      {expanded && suggestion.keywords.length > 0 && (
        <div className="mt-3 pt-2 border-t border-white/5 ml-[72px]">
          <div className="flex flex-wrap gap-1.5">
            {suggestion.keywords.map((k) => (
              <span key={k} className="ats-chip ats-chip-suggestion">
                {k}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Results Panel ────────────────────────────────────────────────────────

function ResultsPanel({ result }: { result: ATSResult }) {
  return (
    <div className="ats-results-panel animate-in fade-in-0 slide-in-from-bottom-4 duration-700">
      {/* Score Header */}
      <div className="ats-score-header">
        <div className="flex flex-col items-center">
          <ScoreRing score={result.overallScore} />
          <div className="mt-4 text-center">
            <h3
              className={`text-lg font-bold bg-gradient-to-r ${getScoreGradient(result.overallScore)} bg-clip-text text-transparent`}
            >
              {getScoreLabel(result.overallScore)}
            </h3>
            <p className="text-sm text-white/40 mt-1">
              {result.matchedKeywords.length} of{" "}
              {result.matchedKeywords.length + result.missingKeywords.length}{" "}
              keywords matched
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3 mt-6 w-full">
          <div className="ats-stat-card">
            <span className="text-2xl font-bold text-emerald-400">
              {result.matchedKeywords.length}
            </span>
            <span className="text-[10px] text-white/40 uppercase tracking-wider">
              Matched
            </span>
          </div>
          <div className="ats-stat-card">
            <span className="text-2xl font-bold text-red-400">
              {result.missingKeywords.length}
            </span>
            <span className="text-[10px] text-white/40 uppercase tracking-wider">
              Missing
            </span>
          </div>
          <div className="ats-stat-card">
            <span className="text-2xl font-bold text-blue-400">
              {result.suggestions.length}
            </span>
            <span className="text-[10px] text-white/40 uppercase tracking-wider">
              Tips
            </span>
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="mt-6">
        <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wider mb-3 flex items-center gap-2">
          <IconTarget size={16} />
          Category Breakdown
        </h3>
        <div className="flex flex-col gap-2">
          {result.categoryScores.map((cs) => (
            <CategoryBar key={cs.category} cs={cs} />
          ))}
        </div>
      </div>

      {/* Suggestions */}
      {result.suggestions.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wider mb-3 flex items-center gap-2">
            <IconSparkles size={16} />
            Improvement Suggestions
          </h3>
          <div className="flex flex-col gap-2">
            {result.suggestions.map((s) => (
              <SuggestionCard key={s.id} suggestion={s} />
            ))}
          </div>
        </div>
      )}

      {/* Required Missing */}
      {result.requiredMissing.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-red-400/80 uppercase tracking-wider mb-3 flex items-center gap-2">
            <IconAlertTriangle size={16} />
            Critical Missing Keywords
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {result.requiredMissing.map((k) => (
              <span key={k} className="ats-chip ats-chip-critical">
                {k}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main ATS Page ────────────────────────────────────────────────────────

export default function ATSPage() {
  const [jdInput, setJdInput] = useState<JDInput>({
    mode: "text",
    text: "",
    url: "",
  });
  const [resumeInput, setResumeInput] = useState<ResumeInput>({
    file: null,
    text: "",
    fileName: "",
  });
  const [analysis, setAnalysis] = useState<AnalysisState>({ status: "idle" });
  const [isDragging, setIsDragging] = useState(false);
  const [fetchingUrl, setFetchingUrl] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ─── File Upload Handling ─────────────────────────────────────────────

  const handleFileUpload = useCallback(async (file: File) => {
    const validTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
      "text/plain",
      "text/rtf",
    ];
    const validExtensions = [".pdf", ".docx", ".doc", ".txt", ".rtf"];
    const ext = "." + file.name.split(".").pop()?.toLowerCase();

    if (!validTypes.includes(file.type) && !validExtensions.includes(ext)) {
      setAnalysis({
        status: "error",
        message: `Unsupported file type: ${file.type || ext}. Please upload a PDF, DOCX, DOC, or TXT file.`,
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setAnalysis({
        status: "error",
        message: "File is too large (max 10MB).",
      });
      return;
    }

    setResumeInput({ file, text: "", fileName: file.name });

    try {
      setAnalysis({ status: "extracting", step: "Reading resume file..." });
      const text = await extractTextFromFile(file);

      if (!text || text.trim().length < 10) {
        setAnalysis({
          status: "error",
          message:
            "Could not extract text from the file. The file might be scanned/image-based or corrupted.",
        });
        return;
      }

      setResumeInput({ file, text, fileName: file.name });
      setAnalysis({ status: "idle" });
    } catch (err) {
      setAnalysis({
        status: "error",
        message: `Error reading file: ${err instanceof Error ? err.message : "Unknown error"}`,
      });
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFileUpload(file);
    },
    [handleFileUpload]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  // ─── URL Fetching ────────────────────────────────────────────────────

  const fetchJDFromUrl = useCallback(async () => {
    if (!jdInput.url.trim()) return;

    setFetchingUrl(true);
    setAnalysis({ status: "extracting", step: "Fetching job description from URL..." });

    try {
      const response = await fetch("/api/fetch-jd", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: jdInput.url.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        setAnalysis({
          status: "error",
          message: data.error || "Failed to fetch job description.",
        });
        return;
      }

      setJdInput((prev) => ({ ...prev, text: data.text, mode: "text" }));
      setAnalysis({ status: "idle" });
    } catch {
      setAnalysis({
        status: "error",
        message: "Network error while fetching URL. Please check the URL and try again.",
      });
    } finally {
      setFetchingUrl(false);
    }
  }, [jdInput.url]);

  // ─── Analysis ────────────────────────────────────────────────────────

  const runAnalysis = useCallback(async () => {
    if (!jdInput.text.trim()) {
      setAnalysis({
        status: "error",
        message: "Please provide a job description.",
      });
      return;
    }

    if (!resumeInput.text.trim()) {
      setAnalysis({
        status: "error",
        message: "Please upload your resume.",
      });
      return;
    }

    setAnalysis({ status: "analyzing" });

    // Small delay for visual feedback
    await new Promise((r) => setTimeout(r, 800));

    try {
      const result = analyzeMatch(jdInput.text, resumeInput.text);
      setAnalysis({ status: "complete", result });
    } catch (err) {
      setAnalysis({
        status: "error",
        message: `Analysis failed: ${err instanceof Error ? err.message : "Unknown error"}`,
      });
    }
  }, [jdInput.text, resumeInput.text]);

  const resetAnalysis = useCallback(() => {
    setAnalysis({ status: "idle" });
    setJdInput({ mode: "text", text: "", url: "" });
    setResumeInput({ file: null, text: "", fileName: "" });
  }, []);

  // ─── Render ──────────────────────────────────────────────────────────

  const canAnalyze =
    jdInput.text.trim().length > 0 &&
    resumeInput.text.trim().length > 0 &&
    analysis.status !== "analyzing" &&
    analysis.status !== "extracting";

  const showResults = analysis.status === "complete";

  return (
    <div className="ats-page">
      {/* Background effects */}
      <div className="ats-bg-grid" />
      <div className="ats-bg-glow-1" />
      <div className="ats-bg-glow-2" />

      {/* Header */}
      <header className="ats-header">
        <div className="flex items-center gap-3">
          <div className="ats-logo">
            <IconAnalyze size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              ATS Scanner
            </h1>
            <p className="text-xs text-white/40">
              Universal Resume Analyzer
            </p>
          </div>
        </div>
        {showResults && (
          <button onClick={resetAnalysis} className="ats-btn-ghost">
            <IconArrowRight size={14} data-icon="inline-start" className="rotate-180" />
            New Analysis
          </button>
        )}
      </header>

      {/* Main Content */}
      <main className="ats-main">
        {!showResults ? (
          // ─── Input Phase ────────────────────────────────────────────
          <div className="ats-input-grid">
            {/* Left: JD Input */}
            <div className="ats-panel">
              <div className="ats-panel-header">
                <IconClipboardText size={18} className="text-violet-400" />
                <h2 className="text-sm font-semibold text-white/90">
                  Job Description
                </h2>
              </div>

              {/* Mode Toggle */}
              <div className="ats-toggle-group">
                <button
                  className={`ats-toggle ${jdInput.mode === "text" ? "ats-toggle-active" : ""}`}
                  onClick={() => setJdInput((p) => ({ ...p, mode: "text" }))}
                >
                  <IconFileText size={14} data-icon="inline-start" />
                  Paste Text
                </button>
                <button
                  className={`ats-toggle ${jdInput.mode === "url" ? "ats-toggle-active" : ""}`}
                  onClick={() => setJdInput((p) => ({ ...p, mode: "url" }))}
                >
                  <IconLink size={14} data-icon="inline-start" />
                  From URL
                </button>
              </div>

              {jdInput.mode === "text" ? (
                <textarea
                  id="jd-textarea"
                  className="ats-textarea"
                  placeholder="Paste the complete job description here...&#10;&#10;Include: job title, responsibilities, requirements, qualifications, skills, experience, etc."
                  value={jdInput.text}
                  onChange={(e) =>
                    setJdInput((p) => ({ ...p, text: e.target.value }))
                  }
                  rows={16}
                />
              ) : (
                <div className="flex flex-col gap-3">
                  <div className="ats-url-input-group">
                    <input
                      id="jd-url-input"
                      type="url"
                      className="ats-url-input"
                      placeholder="https://jobs.example.com/listing/12345"
                      value={jdInput.url}
                      onChange={(e) =>
                        setJdInput((p) => ({ ...p, url: e.target.value }))
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") fetchJDFromUrl();
                      }}
                    />
                    <button
                      className="ats-btn-fetch"
                      onClick={fetchJDFromUrl}
                      disabled={!jdInput.url.trim() || fetchingUrl}
                    >
                      {fetchingUrl ? (
                        <span className="ats-spinner" />
                      ) : (
                        "Fetch"
                      )}
                    </button>
                  </div>
                  {jdInput.text && (
                    <div className="ats-fetched-preview">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-emerald-400 font-medium">
                          ✓ Job description fetched successfully
                        </span>
                        <button
                          onClick={() =>
                            setJdInput((p) => ({ ...p, text: "" }))
                          }
                          className="text-white/30 hover:text-white/60"
                        >
                          <IconX size={14} />
                        </button>
                      </div>
                      <p className="text-xs text-white/40 line-clamp-4">
                        {jdInput.text.slice(0, 300)}...
                      </p>
                    </div>
                  )}
                </div>
              )}

              {jdInput.text && jdInput.mode === "text" && (
                <p className="text-xs text-white/30 mt-2">
                  {jdInput.text.split(/\s+/).length} words detected
                </p>
              )}
            </div>

            {/* Right: Resume Upload */}
            <div className="ats-panel">
              <div className="ats-panel-header">
                <IconBriefcase size={18} className="text-cyan-400" />
                <h2 className="text-sm font-semibold text-white/90">
                  Your Resume
                </h2>
              </div>

              {/* Drop Zone */}
              <div
                className={`ats-dropzone ${isDragging ? "ats-dropzone-active" : ""} ${resumeInput.fileName ? "ats-dropzone-has-file" : ""}`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept=".pdf,.docx,.doc,.txt,.rtf"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(file);
                  }}
                />

                {resumeInput.fileName ? (
                  <div className="flex flex-col items-center gap-3">
                    {resumeInput.fileName.endsWith(".pdf") ? (
                      <IconFileTypePdf
                        size={40}
                        className="text-red-400"
                      />
                    ) : resumeInput.fileName.endsWith(".docx") ? (
                      <IconFileTypeDocx
                        size={40}
                        className="text-blue-400"
                      />
                    ) : (
                      <IconFileText
                        size={40}
                        className="text-white/40"
                      />
                    )}
                    <div className="text-center">
                      <p className="text-sm font-medium text-white/80">
                        {resumeInput.fileName}
                      </p>
                      <p className="text-xs text-emerald-400 mt-1">
                        ✓{" "}
                        {resumeInput.text
                          ? `${resumeInput.text.split(/\s+/).length} words extracted`
                          : "Processing..."}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setResumeInput({
                          file: null,
                          text: "",
                          fileName: "",
                        });
                      }}
                      className="ats-btn-ghost text-xs"
                    >
                      <IconX size={12} data-icon="inline-start" />
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <div className="ats-upload-icon">
                      <IconUpload size={28} />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-white/70">
                        Drop your resume here
                      </p>
                      <p className="text-xs text-white/40 mt-1">
                        or click to browse
                      </p>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="ats-file-badge">PDF</span>
                      <span className="ats-file-badge">DOCX</span>
                      <span className="ats-file-badge">DOC</span>
                      <span className="ats-file-badge">TXT</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Analysis Status */}
              <div className="mt-4">
                {analysis.status === "error" && (
                  <div className="ats-error-banner">
                    <IconAlertTriangle
                      size={16}
                      className="shrink-0 text-red-400"
                    />
                    <p className="text-xs text-red-300">
                      {analysis.message}
                    </p>
                  </div>
                )}

                {analysis.status === "extracting" && (
                  <div className="ats-status-banner">
                    <span className="ats-spinner" />
                    <p className="text-xs text-white/60">{analysis.step}</p>
                  </div>
                )}

                {analysis.status === "analyzing" && (
                  <div className="ats-status-banner">
                    <span className="ats-spinner" />
                    <p className="text-xs text-white/60">
                      Analyzing keywords and calculating score...
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          // ─── Results Phase ──────────────────────────────────────────
          <ResultsPanel result={analysis.result} />
        )}

        {/* Analyze Button */}
        {!showResults && (
          <div className="flex justify-center mt-8">
            <button
              id="analyze-button"
              className="ats-btn-analyze"
              onClick={runAnalysis}
              disabled={!canAnalyze}
            >
              {analysis.status === "analyzing" ? (
                <>
                  <span className="ats-spinner-light" />
                  Analyzing...
                </>
              ) : (
                <>
                  <IconAnalyze size={20} data-icon="inline-start" />
                  Analyze Resume
                </>
              )}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
