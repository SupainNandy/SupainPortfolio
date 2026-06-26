import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
const API = import.meta.env.BACKEND_URI
/**
 * About — Developer profile page
 * Matches Home.jsx's dark IDE aesthetic: same theme tokens, same tab bar,
 * profile content rendered as a "file" pane instead of a Bootstrap card.
 */

const theme = {
  bg: "#0d1117",
  bgSurface: "#0f1419",
  bgSidebar: "#161b22",
  bgCard: "#161b22",
  border: "#30363d",
  borderLight: "#3d444d",
  textPrimary: "#e6edf3",
  textMuted: "#8b949e",
  textFaint: "#525a64",
  keyword: "#c678dd",
  string: "#98c379",
  func: "#61afef",
  property: "#e06c75",
  danger: "#f87171",
};

const TABS = [
  { label: "home.jsx", path: "/" },
  { label: "about.jsx", path: "/about" },
  { label: "projects.jsx", path: "/projects" },
  { label: "contact.jsx", path: "/contact" },
];

const TabBar = ({ navigate, currentPath }) => (
  <nav
    aria-label="Portfolio sections"
    style={{
      display: "flex",
      backgroundColor: theme.bgSidebar,
      borderBottom: `1px solid ${theme.border}`,
      overflowX: "auto",
    }}
  >
    {TABS.map((tab) => {
      const isActive = currentPath === tab.path;
      return (
        <button
          key={tab.path}
          type="button"
          className={`ide-tab mono ${isActive ? "active" : ""}`}
          onClick={() => navigate(tab.path)}
          aria-current={isActive ? "page" : undefined}
        >
          {tab.label}
        </button>
      );
    })}
  </nav>
);

const TitleBar = () => (
  <div
    style={{
      borderBottom: `1px solid ${theme.border}`,
      backgroundColor: theme.bgSidebar,
      padding: "10px 24px",
      display: "flex",
      alignItems: "center",
      gap: "10px",
    }}
  >
    <div style={{ display: "flex", gap: "7px" }}>
      <div style={{ width: 11, height: 11, borderRadius: "50%", backgroundColor: "#ff5f56" }} />
      <div style={{ width: 11, height: 11, borderRadius: "50%", backgroundColor: "#ffbd2e" }} />
      <div style={{ width: 11, height: 11, borderRadius: "50%", backgroundColor: "#27c93f" }} />
    </div>
    <span className="mono" style={{ color: theme.textFaint, fontSize: "0.78rem", marginLeft: "10px" }}>
      supain-nandy — portfolio — VS Code
    </span>
  </div>
);

const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Inter:wght@400;500;600;700;800&display=swap');

    * { box-sizing: border-box; }
    .mono { font-family: 'JetBrains Mono', 'Fira Code', monospace; }
    ::selection { background: ${theme.func}; color: #001018; }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @media (prefers-reduced-motion: reduce) {
      .fade-block { animation: none !important; opacity: 1 !important; }
    }
    .fade-block {
      opacity: 0;
      animation: fadeIn 0.5s ease forwards;
    }

    .ide-tab {
      padding: 10px 18px;
      font-size: 0.8rem;
      cursor: pointer;
      border-right: 1px solid ${theme.border};
      border-top: 2px solid transparent;
      background: none;
      color: ${theme.textFaint};
      white-space: nowrap;
      transition: color 0.2s ease, background-color 0.2s ease;
      user-select: none;
    }
    .ide-tab.active {
      color: ${theme.textPrimary};
      background-color: ${theme.bg};
      border-top: 2px solid ${theme.func};
    }
    .ide-tab:hover:not(.active) {
      color: ${theme.textMuted};
      background-color: rgba(255,255,255,0.02);
    }

    .about-link {
      color: ${theme.func};
      text-decoration: none;
      transition: color 0.2s ease;
    }
    .about-link:hover {
      color: ${theme.string};
      text-decoration: underline;
    }

    a:focus-visible, button:focus-visible, .ide-tab:focus-visible {
      outline: 2px solid ${theme.func};
      outline-offset: 2px;
    }

    .spinner {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      border: 3px solid ${theme.border};
      border-top-color: ${theme.func};
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    .about-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 0;
    }
    @media (min-width: 860px) {
      .about-grid {
        grid-template-columns: 280px 1fr;
      }
      .about-photo-col {
        border-right: 1px solid ${theme.border};
        border-bottom: none !important;
      }
    }

    .about-meta-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1.75rem;
    }
    @media (min-width: 600px) {
      .about-meta-grid {
        grid-template-columns: 1fr 1fr 1fr;
      }
    }

    @media (max-width: 480px) {
      .ide-tab { padding: 9px 13px; font-size: 0.74rem; }
    }
  `}</style>
);

const About = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [profile, setProfile] = useState(null);
  const [education, setEducation] = useState([]);
  const [skills, setSkills] = useState([]);
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // Run all fetch requests in parallel
        const [profileRes, eduRes, skillRes, resumeRes] = await Promise.all([
          fetch(`${API}/admin/profile`),
          fetch(`${API}/admin/education`),
          fetch(`${API}/admin/skill`),
          fetch(`${API}/admin/resume`)
        ]);

        if (!profileRes.ok) {
          throw new Error("Failed to fetch profile data");
        }

        const profileData = await profileRes.json();
        setProfile(profileData);

        // Fetching optional data: Education, Skills, Resume
        if (eduRes.ok) {
          const eduData = await eduRes.json();
          setEducation(eduData.education || []);
        }

        if (skillRes.ok) {
          const skillData = await skillRes.json();
          setSkills(skillData.skills || []);
        }

        if (resumeRes.ok) {
          const resumeData = await resumeRes.json();
          setResume(resumeData || null);
        }

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // PDF Download Helper
  const handleDownload = async (url, filename) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      
      const blobUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download failed:", error);
      window.open(url, "_blank");
    }
  };

  const shellStyle = {
    backgroundColor: theme.bg,
    color: theme.textPrimary,
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    minHeight: "100vh",
  };

  // ---- Loading state ----
  if (loading) {
    return (
      <div style={shellStyle}>
        <GlobalStyles />
        <TitleBar />
        <TabBar navigate={navigate} currentPath={location.pathname} />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "1rem",
            minHeight: "60vh",
          }}
        >
          <div className="spinner" role="status" aria-label="Loading profile" />
          <span className="mono" style={{ color: theme.textFaint, fontSize: "0.8rem" }}>
            loading profile data…
          </span>
        </div>
      </div>
    );
  }

  // ---- Error state ----
  if (error || !profile) {
    return (
      <div style={shellStyle}>
        <GlobalStyles />
        <TitleBar />
        <TabBar navigate={navigate} currentPath={location.pathname} />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.75rem",
            minHeight: "60vh",
            padding: "2rem",
            textAlign: "center",
          }}
        >
          <span className="mono" style={{ color: theme.danger, fontSize: "0.95rem" }}>
            ⚠ Error: {error || "No profile data found."}
          </span>
          <span className="mono" style={{ color: theme.textFaint, fontSize: "0.78rem" }}>
            {"// check that the backend is running on :8000"}
          </span>
        </div>
      </div>
    );
  }

  // ---- Loaded state ----
  return (
    <div style={shellStyle}>
      <GlobalStyles />
      <TitleBar />
      <TabBar navigate={navigate} currentPath={location.pathname} />

      <section style={{ padding: "3.5rem 1.5rem", maxWidth: "1180px", margin: "0 auto" }}>
        <div style={{ marginBottom: "2rem" }} className="fade-block">
          <span className="mono" style={{ color: theme.textFaint, fontSize: "0.85rem" }}>
            {"// about.jsx"}
          </span>
          <h2
            className="mono"
            style={{
              fontSize: "clamp(1.5rem, 3.2vw, 2.1rem)",
              fontWeight: 700,
              marginTop: "0.5rem",
              marginBottom: 0,
            }}
          >
            <span style={{ color: theme.keyword }}>function</span>{" "}
            <span style={{ color: theme.func }}>About</span>
            <span style={{ color: theme.textPrimary }}>() {"{"}</span>
          </h2>
        </div>

        <div
          className="fade-block"
          style={{
            backgroundColor: theme.bgSurface,
            border: `1px solid ${theme.border}`,
            borderRadius: "8px",
            overflow: "hidden",
            boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
            animationDelay: "0.1s",
          }}
        >
          <div
            style={{
              padding: "9px 16px",
              borderBottom: `1px solid ${theme.border}`,
              backgroundColor: theme.bgSidebar,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span className="mono" style={{ color: theme.textFaint, fontSize: "0.75rem" }}>
              profile.json
            </span>
            <span className="mono" style={{ color: theme.textFaint, fontSize: "0.7rem" }}>
              UTF-8
            </span>
          </div>

          <div className="about-grid">
            {/* Photo / identity column */}
            <div
              className="about-photo-col"
              style={{
                padding: "2.25rem 1.75rem",
                borderBottom: `1px solid ${theme.border}`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              {profile.profileImage ? (
                <img
                  src={profile.profileImage}
                  alt={profile.name}
                  style={{
                    width: "150px",
                    height: "150px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: `2px solid ${theme.border}`,
                    marginBottom: "1.25rem",
                  }}
                />
              ) : (
                <div
                  className="mono"
                  style={{
                    width: "150px",
                    height: "150px",
                    borderRadius: "50%",
                    border: `1px dashed ${theme.border}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: theme.textFaint,
                    fontSize: "1.8rem",
                    marginBottom: "1.25rem",
                  }}
                >
                  {(profile.name || "?").slice(0, 1).toUpperCase()}
                </div>
              )}

              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, margin: 0, color: theme.textPrimary }}>
                {profile.name}
              </h3>
              <p className="mono" style={{ color: theme.func, fontSize: "0.85rem", marginTop: "0.4rem", marginBottom: 0 }}>
                {profile.title}
              </p>

              {profile.bio && (
                <p
                  style={{
                    color: theme.textMuted,
                    fontSize: "0.85rem",
                    fontStyle: "italic",
                    marginTop: "1rem",
                    marginBottom: 0,
                    lineHeight: 1.6,
                  }}
                >
                  “{profile.bio}”
                </p>
              )}
            </div>

            {/* Details column */}
            <div style={{ padding: "2.25rem 1.75rem" }}>
              
              {/* Summary */}
              <h4
                className="mono"
                style={{
                  color: theme.textFaint,
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  marginTop: 0,
                  marginBottom: "1rem",
                  textTransform: "lowercase",
                }}
              >
                {"// summary"}
              </h4>
              <p
                style={{
                  color: theme.textMuted,
                  lineHeight: 1.75,
                  marginBottom: "2.25rem",
                  whiteSpace: "pre-line",
                }}
              >
                {profile.about || "I am a passionate developer constantly looking to learn and grow."}
              </p>

              {/* Skills */}
              {skills && skills.length > 0 && (
                <>
                  <h4
                    className="mono"
                    style={{
                      color: theme.textFaint,
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      marginTop: 0,
                      marginBottom: "1rem",
                      textTransform: "lowercase",
                    }}
                  >
                    {"// technical_skills"}
                  </h4>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem", marginBottom: "2.25rem" }}>
                    {skills.map((skill) => (
                      <span
                        key={skill._id}
                        className="mono"
                        style={{
                          backgroundColor: theme.bgSidebar,
                          color: theme.string,
                          padding: "5px 10px",
                          borderRadius: "4px",
                          fontSize: "0.75rem",
                          border: `1px solid ${theme.border}`,
                        }}
                      >
                        {skill.name} {skill.level && <span style={{color: theme.textFaint}}>({skill.level})</span>}
                      </span>
                    ))}
                  </div>
                </>
              )}

              {/* Education */}
              {education && education.length > 0 && (
                <>
                  <h4
                    className="mono"
                    style={{
                      color: theme.textFaint,
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      marginTop: 0,
                      marginBottom: "1rem",
                      textTransform: "lowercase",
                    }}
                  >
                    {"// education"}
                  </h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", marginBottom: "2.25rem" }}>
                    {education.map((edu) => (
                      <div key={edu._id} style={{ borderLeft: `2px solid ${theme.func}`, paddingLeft: "1rem" }}>
                        <div style={{ color: theme.textPrimary, fontWeight: 600, fontSize: "0.95rem" }}>
                          {edu.degree} in {edu.field}
                        </div>
                        <div style={{ color: theme.property, fontSize: "0.85rem", marginTop: "0.3rem" }}>
                          {edu.institute} {edu.university && `(${edu.university})`}
                        </div>
                        <div className="mono" style={{ color: theme.textMuted, fontSize: "0.75rem", marginTop: "0.3rem" }}>
                          {edu.startYear} - {edu.endYear || "Present"} {edu.cgpa && `| CGPA: ${edu.cgpa}`}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              <div className="about-meta-grid">
                {/* Contact Info */}
                <div style={{ borderTop: `1px solid ${theme.border}`, paddingTop: "1.25rem" }}>
                  <h4 style={{ fontSize: "0.95rem", fontWeight: 700, color: theme.textPrimary, marginTop: 0, marginBottom: "0.9rem" }}>
                    Contact
                  </h4>
                  {profile.email && (
                    <p style={{ color: theme.textMuted, marginBottom: "0.6rem", fontSize: "0.9rem" }}>
                      <span style={{ color: theme.property }}>email</span>:{" "}
                      <a href={`mailto:${profile.email}`} className="about-link">
                        {profile.email}
                      </a>
                    </p>
                  )}
                  {profile.phone && (
                    <p style={{ color: theme.textMuted, marginBottom: "0.6rem", fontSize: "0.9rem" }}>
                      <span style={{ color: theme.property }}>phone</span>: {profile.phone}
                    </p>
                  )}
                  {profile.address && (
                    <p style={{ color: theme.textMuted, marginBottom: 0, fontSize: "0.9rem" }}>
                      <span style={{ color: theme.property }}>location</span>: {profile.address}
                    </p>
                  )}
                </div>

                {/* Social Links */}
                <div style={{ borderTop: `1px solid ${theme.border}`, paddingTop: "1.25rem" }}>
                  <h4 style={{ fontSize: "0.95rem", fontWeight: 700, color: theme.textPrimary, marginTop: 0, marginBottom: "0.9rem" }}>
                    Connect
                  </h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem", fontSize: "0.9rem" }}>
                    {profile.linkedin && (
                      <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="about-link">
                        LinkedIn ↗
                      </a>
                    )}
                    {profile.github && (
                      <a href={profile.github} target="_blank" rel="noopener noreferrer" className="about-link">
                        GitHub ↗
                      </a>
                    )}
                    {profile.portfolio && (
                      <a href={profile.portfolio} target="_blank" rel="noopener noreferrer" className="about-link">
                        Portfolio ↗
                      </a>
                    )}
                    {profile.twitter && (
                      <a href={profile.twitter} target="_blank" rel="noopener noreferrer" className="about-link">
                        Twitter / X ↗
                      </a>
                    )}
                  </div>
                </div>

                {/* Resume / Documents */}
                {resume && (resume.resumePdf || resume.cvPdf) && (
                  <div style={{ borderTop: `1px solid ${theme.border}`, paddingTop: "1.25rem" }}>
                    <h4 style={{ fontSize: "0.95rem", fontWeight: 700, color: theme.textPrimary, marginTop: 0, marginBottom: "0.9rem" }}>
                      Documents
                    </h4>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem", fontSize: "0.9rem" }}>
                      {resume.resumePdf && (
                        <button 
                          onClick={() => handleDownload(resume.resumePdf, "Resume.pdf")}
                          className="about-link mono"
                          style={{ background: "none", border: "none", padding: 0, cursor: "pointer", fontSize: "inherit", textAlign: "left" }}
                        >
                          Resume PDF ⬇
                        </button>
                      )}
                      {resume.cvPdf && (
                        <button 
                          onClick={() => handleDownload(resume.cvPdf, "CV.pdf")}
                          className="about-link mono"
                          style={{ background: "none", border: "none", padding: 0, cursor: "pointer", fontSize: "inherit", textAlign: "left" }}
                        >
                          CV PDF ⬇
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <p
          className="mono"
          style={{
            fontSize: "clamp(1.5rem, 3.2vw, 2.1rem)",
            fontWeight: 700,
            marginTop: "2rem",
            marginBottom: 0,
          }}
        >
          {"}"}
        </p>
      </section>
    </div>
  );
};

export default About;