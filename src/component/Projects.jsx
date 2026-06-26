import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

/**
 * Projects — Single project view / Portfolio view
 * Fetches from GET /admin/project, matching the
 * dark IDE aesthetic shared with Home.jsx / About.jsx / Projects.jsx.
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
  number: "#d19a66",
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

    .back-link {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.82rem;
      color: ${theme.textMuted};
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: none;
      border: none;
      cursor: pointer;
      padding: 0;
      transition: color 0.2s ease, gap 0.25s ease;
    }
    .back-link:hover {
      color: ${theme.func};
      gap: 10px;
    }

    .tech-pill {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.72rem;
      padding: 4px 10px;
      border-radius: 4px;
      border: 1px solid ${theme.border};
      color: ${theme.textMuted};
      background-color: rgba(255,255,255,0.02);
      letter-spacing: 0.2px;
    }

    .cta-primary {
      background-color: ${theme.func};
      color: #04101c;
      font-weight: 600;
      border: none;
      border-radius: 6px;
      padding: 11px 22px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.82rem;
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
      padding: 11px 22px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.82rem;
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

    .featured-badge {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.7rem;
      padding: 4px 10px;
      border-radius: 4px;
      background-color: rgba(209, 154, 102, 0.12);
      color: ${theme.number};
      border: 1px solid rgba(209, 154, 102, 0.3);
      letter-spacing: 0.3px;
    }

    .category-badge {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.7rem;
      padding: 4px 10px;
      border-radius: 4px;
      background-color: rgba(97, 175, 239, 0.08);
      color: ${theme.func};
      border: 1px solid rgba(97, 175, 239, 0.25);
      letter-spacing: 0.3px;
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

    @media (max-width: 480px) {
      .ide-tab { padding: 9px 13px; font-size: 0.74rem; }
    }
  `}</style>
);

const Projects = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API = import.meta.env.BACKEND_URI
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get(`${API}/admin/project`);
        setProjects(res.data.projects || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load projects");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const shellStyle = {
    backgroundColor: theme.bg,
    color: theme.textPrimary,
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    minHeight: "100vh",
  };

  // Loading State
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
          <div className="spinner" role="status" aria-label="Loading project" />
          <span className="mono" style={{ color: theme.textFaint, fontSize: "0.8rem" }}>
            loading projects.json…
          </span>
        </div>
      </div>
    );
  }

  // Error or Empty State
  if (error || !projects || projects.length === 0) {
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
            gap: "1.25rem",
            minHeight: "60vh",
            padding: "2rem",
            textAlign: "center",
          }}
        >
          <span className="mono" style={{ color: theme.danger, fontSize: "0.95rem" }}>
            ⚠ {error || "No projects found."}
          </span>
          <button
            type="button"
            className="back-link"
            onClick={() => navigate("/")}
          >
            ← back to home
          </button>
        </div>
      </div>
    );
  }

  // Main UI Render Block
  return (
    <div style={shellStyle}>
      <GlobalStyles />
      <TitleBar />
      <TabBar navigate={navigate} currentPath={location.pathname} />

      <section
        style={{
          padding: "3.5rem 1.5rem 5rem",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <button
          type="button"
          className="back-link fade-block"
          onClick={() => navigate("/")}
          style={{ marginBottom: "2rem" }}
        >
          ← back to home
        </button>

        <div
          className="fade-block"
          style={{
            backgroundColor: theme.bgSurface,
            border: `1px solid ${theme.border}`,
            borderRadius: "8px",
            overflow: "hidden",
            boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
            animationDelay: "0.08s",
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
              projects.jsx
            </span>
            <span className="mono" style={{ color: theme.textFaint, fontSize: "0.7rem" }}>
              UTF-8
            </span>
          </div>

          <div style={{ padding: "2.25rem 2rem" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                gap: "24px",
              }}
            >
              {projects.map((project) => (
                <div
                  key={project._id || project.id}
                  style={{
                    background: theme.bgCard,
                    padding: "24px",
                    borderRadius: "8px",
                    border: `1px solid ${theme.border}`,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <div
                      style={{
                        display: "flex",
                        gap: "0.6rem",
                        flexWrap: "wrap",
                        marginBottom: "1.1rem",
                      }}
                    >
                      {project.category && (
                        <span className="category-badge">{project.category}</span>
                      )}
                      {project.featured && (
                        <span className="featured-badge">★ featured</span>
                      )}
                    </div>

                    <h2 style={{ fontSize: "1.25rem", margin: "0 0 10px 0", color: theme.textPrimary }}>
                      {project.title}
                    </h2>

                    <p style={{ color: theme.textMuted, fontSize: "0.9rem", lineHeight: "1.5", margin: "0 0 20px 0" }}>
                      {project.description}
                    </p>

                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "8px",
                        marginBottom: "20px",
                      }}
                    >
                      {project.techStack?.map((tech, i) => (
                        <span key={i} className="tech-pill">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div
                    style={{
                      borderTop: `1px solid ${theme.border}`,
                      paddingTop: "1.25rem",
                      display: "flex",
                      gap: "0.75rem",
                      flexWrap: "wrap",
                    }}
                  >
                    {project.liveLink && project.liveLink !== "#" && (
                      <a
                        href={project.liveLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cta-primary"
                        style={{ padding: "8px 16px", fontSize: "0.78rem" }}
                      >
                        $ run --live <span aria-hidden="true">→</span>
                      </a>
                    )}
                    {project.githubLink && project.githubLink !== "#" && (
                      <a
                        href={project.githubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cta-secondary"
                        style={{ padding: "8px 16px", fontSize: "0.78rem" }}
                      >
                        $ view --source
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Projects;