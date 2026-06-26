import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
const API = import.meta.env.BACKEND_URI

/**
 * Home — Developer portfolio landing page
 * Aesthetic: dark code-editor / IDE chrome (tabs, line numbers, status bar)
 * Hero renders the developer as a typed-out JS object literal.
 */

const theme = {
  bg: "#0d1117",
  bgSurface: "#0f1419",
  bgSidebar: "#161b22",
  bgCard: "#161b22",
  bgCardHover: "#1c2229",
  border: "#30363d",
  borderLight: "#3d444d",
  textPrimary: "#e6edf3",
  textMuted: "#8b949e",
  textFaint: "#525a64",
  keyword: "#c678dd", // const, function, return
  string: "#98c379", // strings / green status
  func: "#61afef", // function names / primary accent
  number: "#d19a66", // numbers / constants
  comment: "#5c6370",
  property: "#e06c75",
  lineNumber: "#3d444d",
};

const STATUS_LABEL = "actively_interviewing";

const FALLBACK_PROJECTS = [
  {
    _id: "royal-route",
    title: "Royal Route — Car Rental Platform",
    description:
      "Full-stack car rental system with JWT-authenticated admin dashboard, fleet management, booking approvals, and a luxury black-and-gold UI with canvas-based animated graphics.",
    techStack: ["React", "Node.js", "Express", "MongoDB", "JWT"],
    liveLink: "https://royalroute.vercel.app",
    githubLink: "#",
    fileName: "RoyalRoute.jsx",
  },
  {
    _id: "kanban-board",
    title: "Kanban Board",
    description:
      "Drag-and-drop task management board with persistent board state, column management, and a clean dark SaaS-style interface.",
    techStack: ["React", "Node.js", "Express", "MongoDB"],
    liveLink: "https://kanbanboard-xi.vercel.app",
    githubLink: "#",
    fileName: "KanbanBoard.jsx",
  },
  {
    _id: "agentic-ai",
    title: "Agentic AI Application",
    description:
      "An AI-driven application exploring agentic workflows — autonomous task execution and decision chains built on top of LLM APIs.",
    techStack: ["React", "Node.js", "AI/LLM APIs"],
    liveLink: "#",
    githubLink: "#",
    fileName: "AgenticAI.jsx",
  },
  {
    _id: "todo-list",
    title: "Todo List App",
    description:
      "A full CRUD task manager with persistent storage, built to demonstrate clean REST API design and state management fundamentals.",
    techStack: ["React", "Node.js", "Express", "MongoDB"],
    liveLink: "#",
    githubLink: "#",
    fileName: "TodoApp.jsx",
  },
];

// Each tab maps to a real route. Update these paths to match your router config.
const TABS = [
  { label: "home.jsx", path: "/" },
  { label: "about.jsx", path: "/about" },
  { label: "projects.jsx", path: "/projects" },
  { label: "contact.jsx", path: "/contact" },
  { label: "Admin", path: "/admin" },
];

const buildHeroLines = (personalInfo) => [
  {
    num: 1,
    content: [
      { t: "keyword", v: "const " },
      { t: "func", v: "developer" },
      { t: "plain", v: " = {" },
    ],
  },
  {
    num: 2,
    content: [
      { t: "property", v: "  name" },
      { t: "plain", v: ": " },
      { t: "string", v: `"${personalInfo.name}"` },
      { t: "plain", v: "," },
    ],
  },
  {
    num: 3,
    content: [
      { t: "property", v: "  role" },
      { t: "plain", v: ": " },
      { t: "string", v: `"${personalInfo.role}"` },
      { t: "plain", v: "," },
    ],
  },
  {
    num: 4,
    content: [
      { t: "property", v: "  stack" },
      { t: "plain", v: ": " },
      { t: "plain", v: "[" },
      { t: "string", v: '"MongoDB"' },
      { t: "plain", v: ", " },
      { t: "string", v: '"Express"' },
      { t: "plain", v: ", " },
      { t: "string", v: '"React"' },
      { t: "plain", v: ", " },
      { t: "string", v: '"Node"' },
      { t: "plain", v: "]," },
    ],
  },
  {
    num: 5,
    content: [
      { t: "property", v: "  education" },
      { t: "plain", v: ": " },
      { t: "string", v: `"${personalInfo.education}"` },
      { t: "plain", v: "," },
    ],
  },
  {
    num: 6,
    content: [
      { t: "property", v: "  status" },
      { t: "plain", v: ": " },
      { t: "string", v: `"${STATUS_LABEL}"` },
      { t: "plain", v: "," },
    ],
  },
  {
    num: 7,
    content: [
      { t: "keyword", v: "  return " },
      { t: "func", v: "this" },
      { t: "plain", v: ";" },
    ],
  },
  { num: 8, content: [{ t: "plain", v: "};" }] },
];

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [usingFallback, setUsingFallback] = useState(false);
  const [typedLines, setTypedLines] = useState([]);
  const [cursorVisible, setCursorVisible] = useState(true);
  const hasTypedRef = useRef(false);

  const personalInfo = {
    name: "Supain Nandy",
    role: "MERN Stack Developer",
    location: "West Bengal, India",
    education: "MCA Student @ MAKAUT",
    summary:
      "MCA student and full-stack developer who builds scalable, responsive web applications with the MERN stack. Currently seeking a software developer role to contribute, learn, and ship real production code.",
  };

  // ---- Fetch projects from live backend, fall back to static data ----
  useEffect(() => {
    fetchProjects();
  }, []);

  // ---- Fetch resume ----
  const [resume, setResume] = useState(null);

  useEffect(() => {
    fetchResume();
  }, []);

  const fetchResume = async () => {
    try {
      const res = await axios.get(`${API}/admin/resume`);
      setResume(res.data);
    } catch (err) {
      console.error("Error fetching resume:", err);
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await axios.get(`${API}/admin/project/`, {
        withCredentials: true,
      });
      const fetched = res.data?.projects || [];
      if (fetched.length > 0) {
        setFeaturedProjects(fetched);
        setUsingFallback(false);
      } else {
        setFeaturedProjects(FALLBACK_PROJECTS);
        setUsingFallback(true);
      }
    } catch (err) {
      console.error("Error fetching projects, using fallback data:", err);
      setFeaturedProjects(FALLBACK_PROJECTS);
      setUsingFallback(true);
    }
  };

  // ---- Hero typing animation: types out the object literal once ----
  // heroLines is built once and stored in a ref so the effect's closure
  // always reads from the exact same array, even under StrictMode's
  // mount -> unmount -> remount cycle in development.
  const heroLinesRef = useRef(null);
  if (heroLinesRef.current === null) {
    heroLinesRef.current = buildHeroLines(personalInfo);
  }
  const heroLines = heroLinesRef.current;

  useEffect(() => {
    // Guards against double-invocation (React StrictMode) re-starting
    // the animation and desyncing line indices.
    if (hasTypedRef.current) return;
    hasTypedRef.current = true;

    let lineIndex = 0;
    let timeoutId;
    const lines = heroLinesRef.current;

    const revealNext = () => {
      if (lineIndex < lines.length) {
        const nextLine = lines[lineIndex];
        if (nextLine) {
          setTypedLines((prev) => [...prev, nextLine]);
        }
        lineIndex += 1;
        timeoutId = setTimeout(revealNext, 160);
      }
    };

    timeoutId = setTimeout(revealNext, 300);
    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    const blink = setInterval(() => setCursorVisible((v) => !v), 530);
    return () => clearInterval(blink);
  }, []);

  const renderTokens = (content) =>
    content.map((tok, i) => {
      const colorMap = {
        keyword: theme.keyword,
        func: theme.func,
        string: theme.string,
        property: theme.property,
        number: theme.number,
        comment: theme.comment,
        plain: theme.textPrimary,
      };
      return (
        <span key={i} style={{ color: colorMap[tok.t] || theme.textPrimary }}>
          {tok.v}
        </span>
      );
    });

  return (
    <div
      style={{
        backgroundColor: theme.bg,
        color: theme.textPrimary,
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        minHeight: "100vh",
        overflowX: "hidden",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Inter:wght@400;500;600;700;800&display=swap');

        * { box-sizing: border-box; }

        .mono { font-family: 'JetBrains Mono', 'Fira Code', monospace; }

        ::selection { background: ${theme.func}; color: #001018; }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(28px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          .project-wrapper, .fade-in-block { animation: none !important; opacity: 1 !important; }
        }

        .project-wrapper {
          opacity: 0;
          animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .fade-in-block {
          opacity: 0;
          animation: fadeIn 0.8s ease forwards;
        }

        /* Tab bar */
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

        /* File-explorer style project card */
        .file-card {
          background-color: ${theme.bgCard};
          border: 1px solid ${theme.border};
          border-radius: 6px;
          transition: border-color 0.3s ease, background-color 0.3s ease, transform 0.3s ease;
          position: relative;
        }
        .file-card:hover {
          border-color: ${theme.func};
          background-color: ${theme.bgCardHover};
          transform: translateY(-4px);
        }

        .tech-pill {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.7rem;
          padding: 3px 9px;
          border-radius: 4px;
          border: 1px solid ${theme.border};
          color: ${theme.textMuted};
          background-color: rgba(255,255,255,0.02);
          letter-spacing: 0.2px;
        }

        .run-link {
          font-family: 'JetBrains Mono', monospace;
          color: ${theme.func};
          text-decoration: none;
          font-size: 0.82rem;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: gap 0.25s ease, color 0.2s ease;
        }
        .run-link:hover {
          color: ${theme.string};
          gap: 10px;
        }

        .cta-primary {
          background-color: ${theme.func};
          color: #04101c;
          font-weight: 600;
          border: none;
          border-radius: 6px;
          padding: 12px 24px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.85rem;
          transition: transform 0.25s ease, box-shadow 0.25s ease, background-color 0.25s ease;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
        }
        .cta-primary:hover {
          background-color: #79bdf3;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(97, 175, 239, 0.25);
        }

        .cta-secondary {
          background-color: transparent;
          color: ${theme.textPrimary};
          border: 1px solid ${theme.border};
          border-radius: 6px;
          padding: 12px 24px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.85rem;
          transition: border-color 0.25s ease, transform 0.25s ease;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
        }
        .cta-secondary:hover {
          border-color: ${theme.borderLight};
          transform: translateY(-2px);
        }

        a:focus-visible, button:focus-visible, .ide-tab:focus-visible {
          outline: 2px solid ${theme.func};
          outline-offset: 2px;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: ${theme.string};
          display: inline-block;
          box-shadow: 0 0 0 0 rgba(152, 195, 121, 0.5);
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(152, 195, 121, 0.45); }
          70% { box-shadow: 0 0 0 6px rgba(152, 195, 121, 0); }
          100% { box-shadow: 0 0 0 0 rgba(152, 195, 121, 0); }
        }

        @media (max-width: 767px) {
          .hero-photo-col { order: -1; margin-bottom: 2rem; }
        }

        @media (max-width: 480px) {
          .ide-tab { padding: 9px 13px; font-size: 0.74rem; }
        }
      `}</style>

      {/* ===== Top "menu bar" strip ===== */}
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
          <div
            style={{
              width: 11,
              height: 11,
              borderRadius: "50%",
              backgroundColor: "#ff5f56",
            }}
          />
          <div
            style={{
              width: 11,
              height: 11,
              borderRadius: "50%",
              backgroundColor: "#ffbd2e",
            }}
          />
          <div
            style={{
              width: 11,
              height: 11,
              borderRadius: "50%",
              backgroundColor: "#27c93f",
            }}
          />
        </div>
        <span
          className="mono"
          style={{
            color: theme.textFaint,
            fontSize: "0.78rem",
            marginLeft: "10px",
          }}
        >
          supain-nandy — portfolio — VS Code
        </span>
      </div>

      {/* ===== Tab bar — each tab routes to a real page ===== */}
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
          const isActive = location.pathname === tab.path;
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

      {/* ===== Hero Section ===== */}
      <section
        style={{
          padding: "5rem 1.5rem 4rem",
          maxWidth: "1180px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "3rem",
          }}
          className="hero-grid"
        >
          <style>{`
            @media (min-width: 992px) {
              .hero-grid { grid-template-columns: 1.3fr 0.9fr !important; align-items: center; }
            }
          `}</style>

          {/* Code block hero */}
          <div>
            <div
              style={{
                backgroundColor: theme.bgSurface,
                border: `1px solid ${theme.border}`,
                borderRadius: "8px",
                overflow: "hidden",
                boxShadow: "0 20px 60px rgba(0,0,0,0.45)",
              }}
            >
              <div
                style={{
                  padding: "9px 16px",
                  borderBottom: `1px solid ${theme.border}`,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  backgroundColor: theme.bgSidebar,
                }}
              >
                <span
                  className="mono"
                  style={{ color: theme.textFaint, fontSize: "0.75rem" }}
                >
                  home.jsx
                </span>
                <span
                  className="mono"
                  style={{ color: theme.textFaint, fontSize: "0.7rem" }}
                >
                  UTF-8
                </span>
              </div>
              <div style={{ padding: "1.75rem 1.5rem", minHeight: "280px" }}>
                {typedLines.map((line) => {
                  if (!line) return null;
                  return (
                    <div
                      key={line.num}
                      className="fade-in-block mono"
                      style={{
                        display: "flex",
                        fontSize: "0.95rem",
                        lineHeight: "1.85",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      <span
                        style={{
                          color: theme.lineNumber,
                          width: "28px",
                          flexShrink: 0,
                          userSelect: "none",
                          textAlign: "right",
                          marginRight: "18px",
                        }}
                      >
                        {line.num}
                      </span>
                      <span>{renderTokens(line.content)}</span>
                    </div>
                  );
                })}
                {typedLines.length >= heroLines.length && (
                  <div
                    style={{
                      display: "flex",
                      fontSize: "0.95rem",
                      lineHeight: "1.85",
                    }}
                    className="mono"
                  >
                    <span
                      style={{
                        width: "28px",
                        flexShrink: 0,
                        marginRight: "18px",
                      }}
                    />
                    <span
                      style={{
                        display: "inline-block",
                        width: "8px",
                        height: "18px",
                        backgroundColor: cursorVisible
                          ? theme.func
                          : "transparent",
                        marginTop: "3px",
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            <div style={{ marginTop: "2rem" }}>
              <p
                style={{
                  color: theme.textMuted,
                  fontSize: "1.05rem",
                  lineHeight: "1.75",
                  maxWidth: "560px",
                }}
              >
                {personalInfo.summary}
              </p>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "0.9rem",
                  marginTop: "1.75rem",
                }}
              >
                <a href="#projects" className="cta-primary">
                  view --projects
                </a>
                {resume?.resumePdf && (
                  <a
                    href={resume.resumePdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cta-secondary"
                  >
                    ./view_resume.pdf
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Photo panel — styled like an editor "preview" pane */}
          <div className="hero-photo-col">
            <div
              style={{
                border: `1px solid ${theme.border}`,
                borderRadius: "8px",
                overflow: "hidden",
                backgroundColor: theme.bgSurface,
              }}
            >
              <div
                style={{
                  padding: "9px 16px",
                  borderBottom: `1px solid ${theme.border}`,
                  backgroundColor: theme.bgSidebar,
                }}
              >
                <span
                  className="mono"
                  style={{ color: theme.textFaint, fontSize: "0.75rem" }}
                >
                  preview
                </span>
              </div>
              <div style={{ padding: "1.5rem", textAlign: "center" }}>
                <img
                  src="public\IMG_20260415_170003.jpg"
                  alt={personalInfo.name}
                  style={{
                    width: "100%",
                    maxWidth: "280px",
                    aspectRatio: "1 / 1",
                    objectFit: "cover",
                    borderRadius: "8px",
                    border: `1px solid ${theme.border}`,
                  }}
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                />
                <div
                  style={{
                    display: "none",
                    width: "100%",
                    maxWidth: "280px",
                    aspectRatio: "1 / 1",
                    margin: "0 auto",
                    borderRadius: "8px",
                    border: `1px dashed ${theme.border}`,
                    alignItems: "center",
                    justifyContent: "center",
                    color: theme.textFaint,
                    fontSize: "2.5rem",
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                >
                  SN
                </div>

                <div style={{ marginTop: "1.5rem", textAlign: "left" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginBottom: "0.6rem",
                    }}
                  >
                    <span className="status-dot" />
                    <span
                      className="mono"
                      style={{ color: theme.string, fontSize: "0.8rem" }}
                    >
                      {STATUS_LABEL}
                    </span>
                  </div>
                  <div
                    className="mono"
                    style={{
                      color: theme.textMuted,
                      fontSize: "0.8rem",
                      lineHeight: "1.7",
                    }}
                  >
                    <div>📍 {personalInfo.location}</div>
                    <div>🎓 {personalInfo.education}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Projects Section ===== */}
      <section
        id="projects"
        style={{
          borderTop: `1px solid ${theme.border}`,
          backgroundColor: theme.bgSurface,
          padding: "4.5rem 1.5rem",
        }}
      >
        <div style={{ maxWidth: "1180px", margin: "0 auto" }}>
          <div style={{ marginBottom: "2.75rem" }}>
            <span
              className="mono"
              style={{ color: theme.comment, fontSize: "0.85rem" }}
            >
              {"// featured work"}
            </span>
            <h2
              className="mono"
              style={{
                fontSize: "clamp(1.6rem, 3.5vw, 2.3rem)",
                fontWeight: 700,
                color: theme.textPrimary,
                marginTop: "0.5rem",
                marginBottom: "0",
              }}
            >
              <span style={{ color: theme.keyword }}>function</span>{" "}
              <span style={{ color: theme.func }}>projects</span>
              <span style={{ color: theme.textPrimary }}>() {"{"}</span>
            </h2>
            {usingFallback && (
              <p
                className="mono"
                style={{
                  color: theme.textFaint,
                  fontSize: "0.75rem",
                  marginTop: "0.6rem",
                }}
              >
                {"// showing cached project data — backend not reachable"}
              </p>
            )}
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {featuredProjects.map((project, index) => (
              <div
                key={project._id || index}
                className="project-wrapper file-card"
                style={{ animationDelay: `${index * 0.1}s`, padding: "1.5rem" }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "1rem",
                  }}
                >
                  <span style={{ color: theme.func, fontSize: "0.9rem" }}>
                    📄
                  </span>
                  <span
                    className="mono"
                    style={{ color: theme.textFaint, fontSize: "0.78rem" }}
                  >
                    {project.fileName ||
                      `${(project.title || "project").replace(/\s+/g, "")}.jsx`}
                  </span>
                </div>

                <h3
                  style={{
                    color: theme.textPrimary,
                    fontSize: "1.15rem",
                    fontWeight: 700,
                    marginBottom: "0.7rem",
                  }}
                >
                  {project.title}
                </h3>

                <p
                  style={{
                    color: theme.textMuted,
                    fontSize: "0.9rem",
                    lineHeight: "1.65",
                    marginBottom: "1.25rem",
                    minHeight: "72px",
                  }}
                >
                  {project.description}
                </p>

                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "0.45rem",
                    marginBottom: "1.4rem",
                  }}
                >
                  {(project.techStack || []).map((tech, tIndex) => (
                    <span key={tIndex} className="tech-pill">
                      {tech}
                    </span>
                  ))}
                </div>

                <div
                  style={{
                    borderTop: `1px solid ${theme.border}`,
                    paddingTop: "1rem",
                    display: "flex",
                    gap: "1.25rem",
                  }}
                >
                  <a
                    href={project.liveLink || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="run-link"
                  >
                    $ run --live <span aria-hidden="true">→</span>
                  </a>
                  {project.githubLink && project.githubLink !== "#" && (
                    <a
                      href={project.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="run-link"
                      style={{ color: theme.textMuted }}
                    >
                      $ view --source
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          <p
            className="mono"
            style={{
              color: theme.textPrimary,
              fontSize: "clamp(1.6rem, 3.5vw, 2.3rem)",
              fontWeight: 700,
              marginTop: "2.5rem",
              marginBottom: "0",
            }}
          >
            {"}"}
          </p>
        </div>
      </section>

      {/* ===== Contact / CTA Section ===== */}
      <section
        id="resume"
        style={{
          borderTop: `1px solid ${theme.border}`,
          backgroundColor: theme.bg,
          padding: "4.5rem 1.5rem",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: "640px", margin: "0 auto" }}>
          <span
            className="mono"
            style={{ color: theme.comment, fontSize: "0.85rem" }}
          >
            {"// let's build something"}
          </span>
          <h2
            style={{
              fontSize: "clamp(1.6rem, 3.5vw, 2.2rem)",
              fontWeight: 800,
              color: theme.textPrimary,
              marginTop: "0.6rem",
              marginBottom: "1rem",
            }}
          >
            Open to full-stack roles &amp; collaborations.
          </h2>
          <p
            style={{
              color: theme.textMuted,
              fontSize: "1rem",
              lineHeight: "1.7",
              marginBottom: "2rem",
            }}
          >
            Currently {STATUS_LABEL.replace("_", " ")} for MERN stack developer
            positions. Reach out and let's talk about how I can contribute to
            your team.
          </p>
          <div
            style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <a
              href="mailto:supainnandy123@gmail.com"
              className="cta-primary"
            >
              $ contact --email
            </a>
            <a
              href="https://www.linkedin.com/in/supain-nandy"
              target="_blank"
              rel="noopener noreferrer"
              className="cta-secondary"
            >
              $ open --linkedin
            </a>
          </div>
        </div>
      </section>

      {/* ===== Status bar (footer, IDE-style) ===== */}
      <div
        style={{
          borderTop: `1px solid ${theme.border}`,
          backgroundColor: theme.func,
          color: "#04101c",
          padding: "6px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "8px",
        }}
        className="mono"
      >
        <div
          style={{
            display: "flex",
            gap: "16px",
            alignItems: "center",
            fontSize: "0.75rem",
          }}
        >
          <span>● {STATUS_LABEL}</span>
          <span>main</span>
        </div>
        <div style={{ display: "flex", gap: "16px", fontSize: "0.75rem" }}>
          <span>UTF-8</span>
          <span>JavaScript</span>
          <span>
            © {new Date().getFullYear()} {personalInfo.name}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Home;