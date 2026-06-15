"use client";

import { useResume } from "@/lib/resume-context";

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const [year, month] = dateStr.split("-");
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  return `${months[parseInt(month, 10) - 1]} ${year}`;
}

function toUrl(link: string): string {
  if (!link) return "";
  if (link.startsWith("http://") || link.startsWith("https://")) return link;
  if (link.includes("@")) return `mailto:${link}`;
  return `https://${link}`;
}

function SkillDots({ level, color }: { level: number; color: string }) {
  return (
    <div style={{ display: "flex", gap: "1.5px" }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          style={{
            height: "5px",
            width: "5px",
            borderRadius: "50%",
            backgroundColor: i <= level ? color : "#d4d4d8",
          }}
        />
      ))}
    </div>
  );
}

// ─── Shared helpers ─────────────────────────────────────────────────────────

interface StyleConfig {
  baseFontSize: string;
  headingSize: string;
  subSize: string;
  lineH: number;
  sectionGap: string;
  accent: string;
}

function getStyleConfig(styles: ReturnType<typeof useResume>["styles"]): StyleConfig {
  const fontSizeMap = { small: "10px", medium: "11px", large: "12px" };
  const headingSizeMap = { small: "20px", medium: "24px", large: "28px" };
  const subheadingSizeMap = { small: "12px", medium: "13px", large: "14px" };
  const lineHeightMap = { compact: 1.3, normal: 1.5, relaxed: 1.7 };
  const sectionGapMap = { compact: "12px", normal: "18px", spacious: "24px" };
  return {
    baseFontSize: fontSizeMap[styles.fontSize],
    headingSize: headingSizeMap[styles.fontSize],
    subSize: subheadingSizeMap[styles.fontSize],
    lineH: lineHeightMap[styles.lineHeight],
    sectionGap: sectionGapMap[styles.sectionSpacing],
    accent: styles.accentColor,
  };
}

// ─── Layout: Classic ────────────────────────────────────────────────────────

function ClassicLayout() {
  const { data, styles } = useResume();
  const { personalInfo, experience, education, skills, projects, certifications, languages, sectionOrder } = data;
  const sc = getStyleConfig(styles);

  const renderSection = (sectionId: string) => {
    switch (sectionId) {
      case "summary":
        return personalInfo.summary ? (
          <div key="summary">
            <ClassicSectionTitle text="Professional Summary" sc={sc} />
            <p style={{ fontSize: sc.baseFontSize, lineHeight: sc.lineH, color: "#374151" }}>{personalInfo.summary}</p>
          </div>
        ) : null;
      case "experience":
        return experience.length > 0 ? (
          <div key="experience">
            <ClassicSectionTitle text="Experience" sc={sc} />
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {experience.map((exp) => (
                <div key={exp.id}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: "4px" }}>
                    <div>
                      <span style={{ fontWeight: 600, fontSize: sc.subSize, color: "#111827" }}>{exp.position || "Position"}</span>
                      {exp.company && <span style={{ fontSize: sc.baseFontSize, color: "#6b7280" }}> at {exp.company}</span>}
                    </div>
                    <span style={{ fontSize: "10px", color: "#9ca3af", whiteSpace: "nowrap" }}>{formatDate(exp.startDate)} — {exp.current ? "Present" : formatDate(exp.endDate)}</span>
                  </div>
                  {exp.location && <p style={{ fontSize: "10px", color: "#9ca3af", marginTop: "1px" }}>{exp.location}</p>}
                  {exp.description && <div style={{ fontSize: sc.baseFontSize, lineHeight: sc.lineH, color: "#374151", marginTop: "4px", whiteSpace: "pre-line" }}>{exp.description}</div>}
                </div>
              ))}
            </div>
          </div>
        ) : null;
      case "education":
        return education.length > 0 ? (
          <div key="education">
            <ClassicSectionTitle text="Education" sc={sc} />
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {education.map((edu) => (
                <div key={edu.id}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: "4px" }}>
                    <span style={{ fontWeight: 600, fontSize: sc.subSize, color: "#111827" }}>{edu.degree || "Degree"}{edu.field ? ` in ${edu.field}` : ""}</span>
                    <span style={{ fontSize: "10px", color: "#9ca3af", whiteSpace: "nowrap" }}>{formatDate(edu.startDate)} — {formatDate(edu.endDate)}</span>
                  </div>
                  <p style={{ fontSize: sc.baseFontSize, color: "#6b7280" }}>{edu.institution || "Institution"}{edu.gpa ? ` · GPA: ${edu.gpa}` : ""}</p>
                  {edu.description && <p style={{ fontSize: "10px", color: "#6b7280", marginTop: "2px" }}>{edu.description}</p>}
                </div>
              ))}
            </div>
          </div>
        ) : null;
      case "skills":
        return skills.length > 0 ? (
          <div key="skills">
            <ClassicSectionTitle text="Skills" sc={sc} />
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 16px" }}>
              {skills.map((skill) => (
                <div key={skill.id} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span style={{ fontSize: sc.baseFontSize, color: "#374151" }}>{skill.name || "Skill"}</span>
                  <SkillDots level={skill.level} color={sc.accent} />
                </div>
              ))}
            </div>
          </div>
        ) : null;
      case "projects":
        return projects.length > 0 ? (
          <div key="projects">
            <ClassicSectionTitle text="Projects" sc={sc} />
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {projects.map((proj) => (
                <div key={proj.id}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: "6px", flexWrap: "wrap" }}>
                    <span style={{ fontWeight: 600, fontSize: sc.subSize, color: "#111827" }}>{proj.name || "Project"}</span>
                    {proj.link && <a href={toUrl(proj.link)} target="_blank" rel="noopener noreferrer" style={{ fontSize: "9px", color: sc.accent, textDecoration: "none" }}>{proj.link}</a>}
                  </div>
                  {proj.description && <p style={{ fontSize: sc.baseFontSize, lineHeight: sc.lineH, color: "#374151", marginTop: "2px" }}>{proj.description}</p>}
                  {proj.technologies && <p style={{ fontSize: "10px", color: "#9ca3af", marginTop: "2px" }}>Tech: {proj.technologies}</p>}
                </div>
              ))}
            </div>
          </div>
        ) : null;
      case "certifications":
        return certifications.length > 0 ? (
          <div key="certifications">
            <ClassicSectionTitle text="Certifications" sc={sc} />
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              {certifications.map((cert) => (
                <div key={cert.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap" }}>
                  <div>
                    <span style={{ fontWeight: 600, fontSize: sc.baseFontSize, color: "#111827" }}>{cert.name || "Certification"}</span>
                    {cert.issuer && <span style={{ fontSize: sc.baseFontSize, color: "#6b7280" }}> — {cert.issuer}</span>}
                  </div>
                  {cert.date && <span style={{ fontSize: "10px", color: "#9ca3af" }}>{formatDate(cert.date)}</span>}
                </div>
              ))}
            </div>
          </div>
        ) : null;
      case "languages":
        return languages.length > 0 ? (
          <div key="languages">
            <ClassicSectionTitle text="Languages" sc={sc} />
            <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 20px" }}>
              {languages.map((lang) => (
                <span key={lang.id} style={{ fontSize: sc.baseFontSize, color: "#374151" }}>
                  {lang.name || "Language"}<span style={{ color: "#9ca3af" }}> — {lang.proficiency}</span>
                </span>
              ))}
            </div>
          </div>
        ) : null;
      default: return null;
    }
  };

  return (
    <>
      <div style={{ textAlign: "center", marginBottom: sc.sectionGap }}>
        <h1 style={{ fontSize: sc.headingSize, fontWeight: 700, color: "#111827", margin: 0, letterSpacing: "-0.02em", lineHeight: 1.2 }}>{personalInfo.fullName || "Your Name"}</h1>
        {personalInfo.jobTitle && <p style={{ fontSize: sc.subSize, color: sc.accent, fontWeight: 500, margin: "4px 0 0 0", letterSpacing: "0.02em" }}>{personalInfo.jobTitle}</p>}
        <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "4px 14px", marginTop: "8px", fontSize: "10px", color: "#6b7280" }}>
          {personalInfo.email && <a href={`mailto:${personalInfo.email}`} style={{ color: "#6b7280", textDecoration: "none" }}>{personalInfo.email}</a>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.website && <a href={toUrl(personalInfo.website)} target="_blank" rel="noopener noreferrer" style={{ color: sc.accent, textDecoration: "none" }}>{personalInfo.website}</a>}
          {personalInfo.linkedin && <a href={toUrl(personalInfo.linkedin)} target="_blank" rel="noopener noreferrer" style={{ color: sc.accent, textDecoration: "none" }}>{personalInfo.linkedin}</a>}
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: sc.sectionGap }}>
        {sectionOrder.map(renderSection)}
      </div>
    </>
  );
}

function ClassicSectionTitle({ text, sc }: { text: string; sc: StyleConfig }) {
  return (
    <div style={{ marginBottom: "8px" }}>
      <h2 style={{ fontSize: sc.subSize, fontWeight: 700, color: "#111827", textTransform: "uppercase", letterSpacing: "0.08em", margin: 0, paddingBottom: "4px", borderBottom: `2px solid ${sc.accent}` }}>{text}</h2>
    </div>
  );
}

// ─── Layout: Sidebar (Image 1 — Isabel Mercado style) ───────────────────────

function SidebarLayout() {
  const { data, styles } = useResume();
  const { personalInfo, experience, education, skills, projects, certifications, languages } = data;
  const sc = getStyleConfig(styles);

  return (
    <>
      {/* Dark header */}
      <div style={{ background: "#1f2937", margin: "-20mm -18mm 0", padding: "18mm 18mm 12mm", textAlign: "center" }}>
        <h1 style={{ fontSize: sc.headingSize, fontWeight: 800, color: "#ffffff", margin: 0, letterSpacing: "0.04em", textTransform: "uppercase", lineHeight: 1.2 }}>{personalInfo.fullName || "YOUR NAME"}</h1>
        {personalInfo.jobTitle && <p style={{ fontSize: sc.subSize, color: sc.accent, fontWeight: 500, margin: "4px 0 0", letterSpacing: "0.1em", textTransform: "uppercase" }}>{personalInfo.jobTitle}</p>}
        <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "4px 16px", marginTop: "8px", fontSize: "9px", color: "#d1d5db" }}>
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.email && <a href={`mailto:${personalInfo.email}`} style={{ color: "#d1d5db", textDecoration: "none" }}>{personalInfo.email}</a>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
        </div>
      </div>

      {/* Summary below header */}
      {personalInfo.summary && (
        <div style={{ padding: "14px 0", borderBottom: `1px solid #e5e7eb`, marginBottom: sc.sectionGap }}>
          <SidebarSectionTitle text="Summary" sc={sc} />
          <p style={{ fontSize: sc.baseFontSize, lineHeight: sc.lineH, color: "#374151", margin: 0 }}>{personalInfo.summary}</p>
        </div>
      )}

      {/* Two columns */}
      <div style={{ display: "flex", gap: "24px" }}>
        {/* Left column — 38% */}
        <div style={{ width: "38%", flexShrink: 0 }}>
          {education.length > 0 && (
            <div style={{ marginBottom: sc.sectionGap }}>
              <SidebarSectionTitle text="Education" sc={sc} />
              {education.map((edu) => (
                <div key={edu.id} style={{ marginBottom: "8px" }}>
                  <div style={{ fontWeight: 700, fontSize: sc.baseFontSize, color: "#111827" }}>{edu.institution || "Institution"}</div>
                  <div style={{ fontSize: "10px", color: "#6b7280", fontStyle: "italic" }}>{edu.degree}{edu.field ? ` in ${edu.field}` : ""}</div>
                  <div style={{ fontSize: "9px", color: "#9ca3af" }}>{formatDate(edu.startDate)} — {formatDate(edu.endDate)}</div>
                </div>
              ))}
            </div>
          )}
          {skills.length > 0 && (
            <div style={{ marginBottom: sc.sectionGap }}>
              <SidebarSectionTitle text="Skills" sc={sc} />
              <ul style={{ margin: 0, paddingLeft: "14px", fontSize: sc.baseFontSize, color: "#374151", lineHeight: 1.8 }}>
                {skills.map((s) => <li key={s.id}>{s.name}</li>)}
              </ul>
            </div>
          )}
          {certifications.length > 0 && (
            <div style={{ marginBottom: sc.sectionGap }}>
              <SidebarSectionTitle text="Certifications" sc={sc} />
              {certifications.map((c) => (
                <div key={c.id} style={{ marginBottom: "4px", fontSize: sc.baseFontSize, color: "#374151" }}>
                  <div style={{ fontWeight: 600 }}>{c.name}</div>
                  <div style={{ fontSize: "9px", color: "#9ca3af" }}>{c.issuer}{c.date ? ` · ${formatDate(c.date)}` : ""}</div>
                </div>
              ))}
            </div>
          )}
          {languages.length > 0 && (
            <div>
              <SidebarSectionTitle text="Languages" sc={sc} />
              {languages.map((l) => (
                <div key={l.id} style={{ fontSize: sc.baseFontSize, color: "#374151", marginBottom: "2px" }}>{l.name} — <span style={{ color: "#9ca3af" }}>{l.proficiency}</span></div>
              ))}
            </div>
          )}
        </div>

        {/* Right column — 62% */}
        <div style={{ flex: 1 }}>
          {experience.length > 0 && (
            <div style={{ marginBottom: sc.sectionGap }}>
              <SidebarSectionTitle text="Professional Experience" sc={sc} />
              {experience.map((exp, i) => (
                <div key={exp.id} style={{ marginBottom: i < experience.length - 1 ? "12px" : 0 }}>
                  <div style={{ fontWeight: 700, fontSize: sc.subSize, color: "#111827" }}>{exp.position || "Position"}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "#6b7280", marginBottom: "3px" }}>
                    <span>{exp.company}{exp.location ? ` · ${exp.location}` : ""}</span>
                    <span style={{ color: "#9ca3af" }}>{formatDate(exp.startDate)} — {exp.current ? "Present" : formatDate(exp.endDate)}</span>
                  </div>
                  {exp.description && <div style={{ fontSize: sc.baseFontSize, lineHeight: sc.lineH, color: "#374151", whiteSpace: "pre-line" }}>{exp.description}</div>}
                </div>
              ))}
            </div>
          )}
          {projects.length > 0 && (
            <div>
              <SidebarSectionTitle text="Projects" sc={sc} />
              {projects.map((p) => (
                <div key={p.id} style={{ marginBottom: "8px" }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
                    <span style={{ fontWeight: 600, fontSize: sc.subSize, color: "#111827" }}>{p.name}</span>
                    {p.link && <a href={toUrl(p.link)} target="_blank" rel="noopener noreferrer" style={{ fontSize: "9px", color: sc.accent, textDecoration: "none" }}>{p.link}</a>}
                  </div>
                  {p.description && <p style={{ fontSize: sc.baseFontSize, color: "#374151", marginTop: "2px" }}>{p.description}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function SidebarSectionTitle({ text, sc }: { text: string; sc: StyleConfig }) {
  return (
    <div style={{ marginBottom: "6px" }}>
      <h2 style={{ fontSize: sc.subSize, fontWeight: 700, color: "#111827", textTransform: "uppercase", letterSpacing: "0.06em", margin: 0, paddingBottom: "3px", borderBottom: `1.5px solid ${sc.accent}` }}>{text}</h2>
    </div>
  );
}

// ─── Layout: Modern (Image 2 — Daniel Gallego style) ────────────────────────

function ModernLayout() {
  const { data, styles } = useResume();
  const { personalInfo, experience, education, skills, projects, certifications, languages } = data;
  const sc = getStyleConfig(styles);

  return (
    <>
      {/* Header — bold uppercase name */}
      <div style={{ marginBottom: sc.sectionGap }}>
        <h1 style={{ fontSize: sc.headingSize, fontWeight: 800, color: "#111827", margin: 0, letterSpacing: "-0.01em", textTransform: "uppercase", lineHeight: 1.1 }}>{personalInfo.fullName || "YOUR NAME"}</h1>
        {personalInfo.jobTitle && <p style={{ fontSize: sc.subSize, color: "#6b7280", fontWeight: 500, margin: "4px 0 0", textTransform: "uppercase", letterSpacing: "0.1em" }}>{personalInfo.jobTitle}</p>}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 14px", marginTop: "6px", fontSize: "10px", color: "#9ca3af" }}>
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.email && <a href={`mailto:${personalInfo.email}`} style={{ color: "#9ca3af", textDecoration: "none" }}>{personalInfo.email}</a>}
          {personalInfo.website && <a href={toUrl(personalInfo.website)} target="_blank" rel="noopener noreferrer" style={{ color: "#9ca3af", textDecoration: "none" }}>{personalInfo.website}</a>}
        </div>
      </div>

      {/* Summary */}
      {personalInfo.summary && (
        <div style={{ marginBottom: sc.sectionGap }}>
          <ModernSectionBar text="Summary" sc={sc} />
          <p style={{ fontSize: sc.baseFontSize, lineHeight: sc.lineH, color: "#374151" }}>{personalInfo.summary}</p>
        </div>
      )}

      {/* Technical Skills — grid layout */}
      {skills.length > 0 && (
        <div style={{ marginBottom: sc.sectionGap }}>
          <ModernSectionBar text="Technical Skills" sc={sc} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "4px 16px" }}>
            {skills.map((s) => (
              <span key={s.id} style={{ fontSize: sc.baseFontSize, color: "#374151" }}>{s.name}</span>
            ))}
          </div>
        </div>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <div style={{ marginBottom: sc.sectionGap }}>
          <ModernSectionBar text="Professional Experience" sc={sc} />
          {experience.map((exp, i) => (
            <div key={exp.id} style={{ marginBottom: i < experience.length - 1 ? "12px" : 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontWeight: 700, fontSize: sc.subSize, color: "#111827" }}>{exp.position}{exp.company ? `, ${exp.company}` : ""}</span>
                <span style={{ fontSize: "10px", color: "#9ca3af", whiteSpace: "nowrap" }}>{formatDate(exp.startDate)} — {exp.current ? "Present" : formatDate(exp.endDate)}</span>
              </div>
              {exp.description && <div style={{ fontSize: sc.baseFontSize, lineHeight: sc.lineH, color: "#374151", marginTop: "3px", whiteSpace: "pre-line" }}>{exp.description}</div>}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div style={{ marginBottom: sc.sectionGap }}>
          <ModernSectionBar text="Education" sc={sc} />
          {education.map((edu) => (
            <div key={edu.id} style={{ marginBottom: "6px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontWeight: 700, fontSize: sc.subSize, color: "#111827" }}>{edu.degree}{edu.field ? ` in ${edu.field}` : ""}</span>
                <span style={{ fontSize: "10px", color: "#9ca3af" }}>{formatDate(edu.startDate)} — {formatDate(edu.endDate)}</span>
              </div>
              <p style={{ fontSize: sc.baseFontSize, color: "#6b7280" }}>{edu.institution}{edu.gpa ? ` · GPA: ${edu.gpa}` : ""}</p>
              {edu.description && <p style={{ fontSize: "10px", color: "#6b7280", marginTop: "2px" }}>{edu.description}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Additional info — projects, certs, languages */}
      {(projects.length > 0 || certifications.length > 0 || languages.length > 0) && (
        <div>
          <ModernSectionBar text="Additional Information" sc={sc} />
          <div style={{ fontSize: sc.baseFontSize, color: "#374151", lineHeight: 1.8 }}>
            {languages.length > 0 && (
              <div><strong>Languages:</strong> {languages.map((l) => `${l.name} (${l.proficiency})`).join(", ")}</div>
            )}
            {certifications.length > 0 && (
              <div><strong>Certifications:</strong> {certifications.map((c) => c.name).join(", ")}</div>
            )}
            {projects.length > 0 && (
              <div><strong>Projects:</strong> {projects.map((p) => p.name).join(", ")}</div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function ModernSectionBar({ text, sc }: { text: string; sc: StyleConfig }) {
  return (
    <div style={{ background: sc.accent, padding: "3px 8px", marginBottom: "8px", borderRadius: "2px" }}>
      <h2 style={{ fontSize: sc.subSize, fontWeight: 700, color: "#ffffff", textTransform: "uppercase", letterSpacing: "0.06em", margin: 0 }}>{text}</h2>
    </div>
  );
}

// ─── Main Preview Component ─────────────────────────────────────────────────

export function ResumePreview() {
  const { styles } = useResume();

  return (
    <div
      className="resume-page bg-white shadow-xl mx-auto select-text"
      style={{
        width: "210mm",
        minHeight: "297mm",
        padding: "20mm 18mm",
        fontFamily: "'Inter', system-ui, sans-serif",
        fontSize: "11px",
        lineHeight: 1.5,
        color: "#111827",
      }}
    >
      {styles.layout === "sidebar" ? <SidebarLayout /> : styles.layout === "modern" ? <ModernLayout /> : <ClassicLayout />}
    </div>
  );
}
