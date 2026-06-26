import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

/**
 * Contact — Developer portfolio contact page
 * Matches the dark IDE aesthetic.
 * Features direct social links and a mailto trigger.
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
  punctuation: "#abb2bf",
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

    .social-link {
      color: ${theme.string};
      text-decoration: none;
      transition: all 0.2s ease;
      padding: 2px 6px;
      border-radius: 4px;
      position: relative;
      display: inline-block;
    }
    
    .social-link:hover {
      background-color: rgba(152, 195, 121, 0.1); /* Slight green tint on hover */
      text-decoration: underline;
    }

    .social-row {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      margin-bottom: 0.8rem;
      padding-left: 2rem;
      font-size: 1rem;
    }

    @media (max-width: 600px) {
      .social-row {
        flex-direction: column;
        align-items: flex-start;
        padding-left: 1rem;
      }
      .link-comment {
        margin-left: 0 !important;
        margin-top: 0.25rem;
      }
    }

    a:focus-visible, button:focus-visible, .ide-tab:focus-visible {
      outline: 2px solid ${theme.func};
      outline-offset: 2px;
    }
  `}</style>
);

const Contact = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const shellStyle = {
    backgroundColor: theme.bg,
    color: theme.textPrimary,
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    minHeight: "100vh",
  };

  // Replace these with your actual links and email
  const MY_EMAIL = "supainnandy1234@gmail.com";
  const GITHUB_URL = "https://github.com/SupainNandy";
  const LINKEDIN_URL = "https://www.linkedin.com/in/supain-nandy-a8a09b25b/";
  const INSTAGRAM_URL = "https://www.instagram.com/_supain_nandy_21/";
  const FACEBOOK_URL = "https://www.facebook.com/supain.nandy";

  return (
    <div style={shellStyle}>
      <GlobalStyles />
      <TitleBar />
      <TabBar navigate={navigate} currentPath={location.pathname} />

      <section style={{ padding: "3.5rem 1.5rem", maxWidth: "800px", margin: "0 auto" }}>
        <div style={{ marginBottom: "2rem" }} className="fade-block">
          <span className="mono" style={{ color: theme.textFaint, fontSize: "0.85rem" }}>
            {"// contact.jsx"}
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
            <span style={{ color: theme.keyword }}>export const</span>{" "}
            <span style={{ color: theme.func }}>Socials</span>
            <span style={{ color: theme.textPrimary }}> = {"{"}</span>
          </h2>
        </div>

        <div
          className="fade-block mono"
          style={{
            backgroundColor: theme.bgSurface,
            border: `1px solid ${theme.border}`,
            borderRadius: "8px",
            padding: "2rem",
            boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
            animationDelay: "0.1s",
            overflowX: "auto",
          }}
        >
          <p style={{ color: theme.textMuted, marginBottom: "1.5rem", fontSize: "0.9rem" }}>
            <span style={{ color: theme.textFaint }}>{"/*"}</span><br/>
            {" * Click a string to open the link."}<br/>
            {" * The email string will open your default mail client."}<br/>
            <span style={{ color: theme.textFaint }}>{" */"}</span>
          </p>

          {/* Email */}
          <div className="social-row">
            <span style={{ color: theme.property, minWidth: "110px" }}>email:</span>
            <a 
              href={`mailto:${MY_EMAIL}?subject=Hello from your portfolio`} 
              className="social-link"
            >
              "{MY_EMAIL}"
            </a>
            <span style={{ color: theme.punctuation }}>,</span>
            <span className="link-comment" style={{ color: theme.textFaint, marginLeft: "1rem", fontSize: "0.85rem" }}>
              // Opens mail client
            </span>
          </div>

          {/* GitHub */}
          <div className="social-row">
            <span style={{ color: theme.property, minWidth: "110px" }}>github:</span>
            <a 
              href={GITHUB_URL} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="social-link"
            >
              "{GITHUB_URL}"
            </a>
            <span style={{ color: theme.punctuation }}>,</span>
          </div>

          {/* LinkedIn */}
          <div className="social-row">
            <span style={{ color: theme.property, minWidth: "110px" }}>linkedIn:</span>
            <a 
              href={LINKEDIN_URL} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="social-link"
            >
              "{LINKEDIN_URL}"
            </a>
            <span style={{ color: theme.punctuation }}>,</span>
          </div>

          {/* Instagram */}
          <div className="social-row">
            <span style={{ color: theme.property, minWidth: "110px" }}>instagram:</span>
            <a 
              href={INSTAGRAM_URL} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="social-link"
            >
              "{INSTAGRAM_URL}"
            </a>
            <span style={{ color: theme.punctuation }}>,</span>
          </div>

          {/* Facebook */}
          <div className="social-row">
            <span style={{ color: theme.property, minWidth: "110px" }}>facebook:</span>
            <a 
              href={FACEBOOK_URL} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="social-link"
            >
              "{FACEBOOK_URL}"
            </a>
          </div>

        </div>

        <p
          className="mono fade-block"
          style={{
            fontSize: "clamp(1.5rem, 3.2vw, 2.1rem)",
            fontWeight: 700,
            marginTop: "1.5rem",
            marginBottom: 0,
            animationDelay: "0.2s"
          }}
        >
          {"};"}
        </p>
      </section>
    </div>
  );
};

export default Contact;