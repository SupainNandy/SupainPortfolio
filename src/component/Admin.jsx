import { useState, useEffect, useCallback } from "react";
import axios from "axios";


/**
 * Uses Bootstrap 5 classes only. No external/custom CSS file needed —
 * just make sure Bootstrap's CSS is loaded once in your index.html:
 *
 * <link
 * href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
 * rel="stylesheet"
 * />
 *
 * Modals below are plain React-controlled (no bootstrap.bundle.js needed).
 */

const API = `${import.meta.env.BACKEND_URI}/admin`;
axios.defaults.withCredentials = true;

/* ---------------------------------------------------------
   Small shared UI primitives
--------------------------------------------------------- */

function Spinner({ small }) {
  return (
    <span
      className={`spinner-border ${small ? "spinner-border-sm" : ""}`}
      role="status"
      aria-hidden="true"
    ></span>
  );
}

function Banner({ banner, onClose }) {
  if (!banner) return null;
  const isError = banner.type === "error";
  return (
    <div className="toast-container position-fixed top-0 end-0 p-3" style={{ zIndex: 1080 }}>
      <div className={`toast show align-items-center text-white border-0 bg-${isError ? "danger" : "success"}`} role="alert">
        <div className="d-flex">
          <div className="toast-body">
            {isError ? "⚠ " : "✓ "}
            {banner.message}
          </div>
          <button type="button" className="btn-close btn-close-white me-2 m-auto" onClick={onClose}></button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div className="mb-3">
      <label className="form-label fw-semibold">{label}</label>
      {children}
    </div>
  );
}

function Button({ children, variant = "primary", className = "", loading, ...props }) {
  return (
    <button className={`btn btn-${variant} d-inline-flex align-items-center gap-2 ${className}`} disabled={loading || props.disabled} {...props}>
      {loading && <Spinner small />}
      {children}
    </button>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">{children}</div>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ label }) {
  return (
    <div className="text-center text-muted border rounded-3 py-5 my-3">
      <div className="fs-3 mb-2">+</div>
      <p className="mb-0 small">{label}</p>
    </div>
  );
}

/* ---------------------------------------------------------
   Login screen
--------------------------------------------------------- */

function AuthScreen({ onAuthed, notify }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(`${API}/auth/login`, {
        email: form.email,
        password: form.password,
      });
      notify("success", "Logged in successfully");
      onAuthed(data.admin);
    } catch (err) {
      notify("error", err?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center bg-dark min-vh-100 px-3">
      <div className="card bg-white border-0 shadow-lg p-4 p-md-5" style={{ maxWidth: 420, width: "100%" }}>
        <h2 className="fw-bold mb-1">Welcome back</h2>
        <p className="text-muted mb-4">Sign in to manage your portfolio.</p>

        <form onSubmit={submit}>
          <Field label="Email">
            <input type="email" className="form-control" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </Field>
          <Field label="Password">
            <input
              type="password"
              className="form-control"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </Field>

          <Button type="submit" loading={loading} className="w-100 mt-2">
            Log in
          </Button>
        </form>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   Generic CRUD list-fetch hook
--------------------------------------------------------- */

function useCrud(resource, listPath = "/") {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API}/${resource}${listPath}`);
      const list = data.education || data.skills || data.projects || [];
      setItems(Array.isArray(list) ? list : []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [resource, listPath]);

  return { items, setItems, loading, fetchAll, saving, setSaving };
}

/* ---------------------------------------------------------
   Education section
--------------------------------------------------------- */

const emptyEducation = { institute: "", degree: "", field: "", startYear: "", endYear: "", cgpa: "", university: "" };

function EducationSection({ notify }) {
  const { items, setItems, loading, fetchAll, saving, setSaving } = useCrud("education");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyEducation);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyEducation);
    setModalOpen(true);
  };
  const openEdit = (item) => {
    setEditing(item);
    setForm(item);
    setModalOpen(true);
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        const { data } = await axios.put(`${API}/education/update/${editing._id}`, form);
        setItems((prev) => prev.map((i) => (i._id === editing._id ? data.education : i)));
        notify("success", "Education updated");
      } else {
        const { data } = await axios.post(`${API}/education/create`, form);
        setItems((prev) => [...prev, data.education]);
        notify("success", "Education added");
      }
      setModalOpen(false);
    } catch (err) {
      notify("error", err?.response?.data?.error || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    if (!confirm("Delete this education entry?")) return;
    try {
      await axios.delete(`${API}/education/delete/${id}`);
      setItems((prev) => prev.filter((i) => i._id !== id));
      notify("success", "Education deleted");
    } catch {
      notify("error", "Delete failed");
    }
  };

  return (
    <SectionShell title="Education" actionLabel="Add education" onAction={openCreate} loading={loading}>
      {!loading && items.length === 0 && <EmptyState label="No education entries yet" />}
      <div className="row g-3">
        {items.map((edu) => (
          <div className="col-md-6" key={edu._id}>
            <CardItem
              title={edu.degree}
              subtitle={`${edu.institute} · ${edu.field || ""}`}
              meta={`${edu.startYear || "—"} – ${edu.endYear || "Present"}${edu.cgpa ? ` · CGPA ${edu.cgpa}` : ""}`}
              onEdit={() => openEdit(edu)}
              onDelete={() => remove(edu._id)}
            />
          </div>
        ))}
      </div>

      {modalOpen && (
        <Modal title={editing ? "Edit education" : "Add education"} onClose={() => setModalOpen(false)}>
          <form onSubmit={save}>
            <div className="row">
              <div className="col-md-6">
                <Field label="Institute">
                  <input className="form-control" value={form.institute} onChange={(e) => setForm({ ...form, institute: e.target.value })} required />
                </Field>
              </div>
              <div className="col-md-6">
                <Field label="University">
                  <input className="form-control" value={form.university || ""} onChange={(e) => setForm({ ...form, university: e.target.value })} />
                </Field>
              </div>
              <div className="col-md-6">
                <Field label="Degree">
                  <input className="form-control" value={form.degree} onChange={(e) => setForm({ ...form, degree: e.target.value })} required />
                </Field>
              </div>
              <div className="col-md-6">
                <Field label="Field of study">
                  <input className="form-control" value={form.field || ""} onChange={(e) => setForm({ ...form, field: e.target.value })} />
                </Field>
              </div>
              <div className="col-md-4">
                <Field label="Start year">
                  <input className="form-control" value={form.startYear || ""} onChange={(e) => setForm({ ...form, startYear: e.target.value })} />
                </Field>
              </div>
              <div className="col-md-4">
                <Field label="End year">
                  <input className="form-control" value={form.endYear || ""} onChange={(e) => setForm({ ...form, endYear: e.target.value })} />
                </Field>
              </div>
              <div className="col-md-4">
                <Field label="CGPA">
                  <input className="form-control" value={form.cgpa || ""} onChange={(e) => setForm({ ...form, cgpa: e.target.value })} />
                </Field>
              </div>
            </div>
            <div className="d-flex justify-content-end gap-2 mt-3">
              <Button variant="outline-secondary" type="button" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" loading={saving}>
                {editing ? "Save changes" : "Add education"}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </SectionShell>
  );
}

/* ---------------------------------------------------------
   Skills section
--------------------------------------------------------- */

const emptySkill = { name: "", category: "", level: "", description: "", featured: false, displayOrder: 0 };

function SkillsSection({ notify }) {
  const { items, setItems, loading, fetchAll, saving, setSaving } = useCrud("skill");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptySkill);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptySkill);
    setModalOpen(true);
  };
  const openEdit = (item) => {
    setEditing(item);
    setForm(item);
    setModalOpen(true);
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        const { data } = await axios.put(`${API}/skill/update/${editing._id}`, form);
        setItems((prev) => prev.map((i) => (i._id === editing._id ? data.skill : i)));
        notify("success", "Skill updated");
      } else {
        const { data } = await axios.post(`${API}/skill/create`, form);
        setItems((prev) => [...prev, data.skill]);
        notify("success", "Skill added");
      }
      setModalOpen(false);
    } catch (err) {
      notify("error", err?.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    if (!confirm("Delete this skill?")) return;
    try {
      await axios.delete(`${API}/skill/delete/${id}`);
      setItems((prev) => prev.filter((i) => i._id !== id));
      notify("success", "Skill deleted");
    } catch {
      notify("error", "Delete failed");
    }
  };

  return (
    <SectionShell title="Skills" actionLabel="Add skill" onAction={openCreate} loading={loading}>
      {!loading && items.length === 0 && <EmptyState label="No skills added yet" />}
      <div className="row g-3">
        {items.map((skill) => (
          <div className="col-md-4" key={skill._id}>
            <CardItem
              title={skill.name}
              subtitle={skill.category}
              meta={skill.level}
              badge={skill.featured ? "Featured" : null}
              onEdit={() => openEdit(skill)}
              onDelete={() => remove(skill._id)}
            />
          </div>
        ))}
      </div>

      {modalOpen && (
        <Modal title={editing ? "Edit skill" : "Add skill"} onClose={() => setModalOpen(false)}>
          <form onSubmit={save}>
            <div className="row">
              <div className="col-md-6">
                <Field label="Name">
                  <input className="form-control" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                </Field>
              </div>
              <div className="col-md-6">
                <Field label="Category">
                  <input className="form-control" value={form.category || ""} onChange={(e) => setForm({ ...form, category: e.target.value })} />
                </Field>
              </div>
              <div className="col-md-6">
                <Field label="Level">
                  <select className="form-select" value={form.level || ""} onChange={(e) => setForm({ ...form, level: e.target.value })}>
                    <option value="">Select level</option>
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                    <option>Expert</option>
                  </select>
                </Field>
              </div>
              <div className="col-md-6">
                <Field label="Display order">
                  <input
                    type="number"
                    className="form-control"
                    value={form.displayOrder || 0}
                    onChange={(e) => setForm({ ...form, displayOrder: Number(e.target.value) })}
                  />
                </Field>
              </div>
              <div className="col-12">
                <Field label="Description">
                  <textarea
                    className="form-control"
                    rows={3}
                    value={form.description || ""}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                  />
                </Field>
              </div>
              <div className="col-12 form-check ms-2">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="skillFeatured"
                  checked={!!form.featured}
                  onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                />
                <label htmlFor="skillFeatured" className="form-check-label">
                  Mark as featured
                </label>
              </div>
            </div>
            <div className="d-flex justify-content-end gap-2 mt-3">
              <Button variant="outline-secondary" type="button" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" loading={saving}>
                {editing ? "Save changes" : "Add skill"}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </SectionShell>
  );
}

/* ---------------------------------------------------------
   Projects section
--------------------------------------------------------- */

const emptyProject = {
  title: "",
  description: "",
  techStack: "",
  githubLink: "",
  liveLink: "",
  category: "",
  featured: false,
  displayOrder: 0,
};

function ProjectsSection({ notify }) {
  const { items, setItems, loading, fetchAll, saving, setSaving } = useCrud("project");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyProject);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyProject);
    setModalOpen(true);
  };
  const openEdit = (item) => {
    setEditing(item);
    setForm({ ...item, techStack: Array.isArray(item.techStack) ? item.techStack.join(", ") : item.techStack || "" });
    setModalOpen(true);
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...form,
      techStack:
        typeof form.techStack === "string"
          ? form.techStack.split(",").map((t) => t.trim()).filter(Boolean)
          : form.techStack,
    };
    try {
      if (editing) {
        const { data } = await axios.put(`${API}/project/${editing._id}`, payload);
        setItems((prev) => prev.map((i) => (i._id === editing._id ? data.project : i)));
        notify("success", "Project updated");
      } else {
        const { data } = await axios.post(`${API}/project/`, payload);
        setItems((prev) => [...prev, data.project]);
        notify("success", "Project added");
      }
      setModalOpen(false);
    } catch (err) {
      notify("error", err?.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    if (!confirm("Delete this project?")) return;
    try {
      await axios.delete(`${API}/project/${id}`);
      setItems((prev) => prev.filter((i) => i._id !== id));
      notify("success", "Project deleted");
    } catch {
      notify("error", "Delete failed");
    }
  };

  return (
    <SectionShell title="Projects" actionLabel="Add project" onAction={openCreate} loading={loading}>
      {!loading && items.length === 0 && <EmptyState label="No projects yet" />}
      <div className="row g-3">
        {items.map((project) => (
          <div className="col-md-6" key={project._id}>
            <CardItem
              title={project.title}
              subtitle={project.category}
              meta={Array.isArray(project.techStack) ? project.techStack.join(", ") : project.techStack}
              badge={project.featured ? "Featured" : null}
              links={[
                project.githubLink && { label: "GitHub", href: project.githubLink },
                project.liveLink && { label: "Live", href: project.liveLink },
              ].filter(Boolean)}
              onEdit={() => openEdit(project)}
              onDelete={() => remove(project._id)}
            />
          </div>
        ))}
      </div>

      {modalOpen && (
        <Modal title={editing ? "Edit project" : "Add project"} onClose={() => setModalOpen(false)}>
          <form onSubmit={save}>
            <div className="row">
              <div className="col-12">
                <Field label="Title">
                  <input className="form-control" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
                </Field>
              </div>
              <div className="col-12">
                <Field label="Description">
                  <textarea
                    className="form-control"
                    rows={3}
                    value={form.description || ""}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                  />
                </Field>
              </div>
              <div className="col-12">
                <Field label="Tech stack (comma separated)">
                  <input className="form-control" value={form.techStack} onChange={(e) => setForm({ ...form, techStack: e.target.value })} />
                </Field>
              </div>
              <div className="col-md-6">
                <Field label="GitHub link">
                  <input className="form-control" value={form.githubLink || ""} onChange={(e) => setForm({ ...form, githubLink: e.target.value })} />
                </Field>
              </div>
              <div className="col-md-6">
                <Field label="Live link">
                  <input className="form-control" value={form.liveLink || ""} onChange={(e) => setForm({ ...form, liveLink: e.target.value })} />
                </Field>
              </div>
              <div className="col-md-6">
                <Field label="Category">
                  <input className="form-control" value={form.category || ""} onChange={(e) => setForm({ ...form, category: e.target.value })} />
                </Field>
              </div>
              <div className="col-md-6">
                <Field label="Display order">
                  <input
                    type="number"
                    className="form-control"
                    value={form.displayOrder || 0}
                    onChange={(e) => setForm({ ...form, displayOrder: Number(e.target.value) })}
                  />
                </Field>
              </div>
              <div className="col-12 form-check ms-2">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="projFeatured"
                  checked={!!form.featured}
                  onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                />
                <label htmlFor="projFeatured" className="form-check-label">
                  Mark as featured
                </label>
              </div>
            </div>
            <div className="d-flex justify-content-end gap-2 mt-3">
              <Button variant="outline-secondary" type="button" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" loading={saving}>
                {editing ? "Save changes" : "Add project"}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </SectionShell>
  );
}

/* ---------------------------------------------------------
   Resume / CV section (singleton record)
--------------------------------------------------------- */

function ResumeSection({ notify }) {
  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [cvFile, setCvFile] = useState(null);

  const fetchDoc = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API}/resume/`);
      setDoc(data);
      setTitle(data?.title || "");
    } catch {
      setDoc(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDoc();
  }, [fetchDoc]);

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("title", title);
      if (resumeFile) fd.append("resumePdf", resumeFile);
      if (cvFile) fd.append("cvPdf", cvFile);

      if (doc?._id) {
        const { data } = await axios.put(`${API}/resume/${doc._id}`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setDoc(data.docs);
        notify("success", "Documents updated");
      } else {
        if (!resumeFile || !cvFile) {
          notify("error", "Both resume and CV PDFs are required");
          setSaving(false);
          return;
        }
        const { data } = await axios.post(`${API}/resume/`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setDoc(data.docs);
        notify("success", "Documents uploaded");
      }
      setResumeFile(null);
      setCvFile(null);
    } catch (err) {
      notify("error", err?.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!doc?._id || !confirm("Delete resume & CV?")) return;
    try {
      await axios.delete(`${API}/resume/${doc._id}`);
      setDoc(null);
      setTitle("");
      notify("success", "Documents deleted");
    } catch {
      notify("error", "Delete failed");
    }
  };

  return (
    <SectionShell title="Resume & CV" loading={loading}>
      <div className="row g-4">
        <div className="col-lg-6">
          <div className="card h-100">
            <div className="card-body">
              <h6 className="card-title text-muted mb-3">Current documents</h6>
              {!doc ? (
                <EmptyState label="No documents uploaded yet" />
              ) : (
                <div>
                  <p className="mb-2">
                    Title: <strong>{doc.title || "—"}</strong>
                  </p>
                  {doc.resumePdf && (
                    <a href={doc.resumePdf} target="_blank" rel="noreferrer" className="d-block mb-1">
                      View résumé →
                    </a>
                  )}
                  {doc.cvPdf && (
                    <a href={doc.cvPdf} target="_blank" rel="noreferrer" className="d-block mb-3">
                      View CV →
                    </a>
                  )}
                  <Button variant="danger" onClick={remove}>
                    Delete documents
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card h-100">
            <div className="card-body">
              <h6 className="card-title text-muted mb-3">{doc ? "Replace documents" : "Upload documents"}</h6>
              <form onSubmit={submit}>
                <Field label="Title">
                  <input className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. 2026 Resume" />
                </Field>
                <Field label="Resume PDF">
                  <input type="file" accept="application/pdf" className="form-control" onChange={(e) => setResumeFile(e.target.files[0])} />
                </Field>
                <Field label="CV PDF">
                  <input type="file" accept="application/pdf" className="form-control" onChange={(e) => setCvFile(e.target.files[0])} />
                </Field>
                <Button type="submit" loading={saving} className="w-100 mt-2">
                  {doc ? "Save changes" : "Upload documents"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </SectionShell>
  );
}

/* ---------------------------------------------------------
   Shared section shell + card item
--------------------------------------------------------- */

function SectionShell({ title, actionLabel, onAction, loading, children }) {
  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h4 className="fw-semibold mb-0">{title}</h4>
        {actionLabel && <Button onClick={onAction}>{actionLabel}</Button>}
      </div>
      {loading ? (
        <div className="d-flex justify-content-center py-5 text-muted">
          <Spinner />
        </div>
      ) : (
        children
      )}
    </div>
  );
}

function CardItem({ title, subtitle, meta, badge, links, onEdit, onDelete }) {
  return (
    <div className="card h-100">
      <div className="card-body d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start mb-1">
          <div>
            <h6 className="card-title mb-0">{title}</h6>
            {subtitle && <p className="card-subtitle text-muted small mb-0">{subtitle}</p>}
          </div>
          {badge && <span className="badge bg-primary-subtle text-primary-emphasis">{badge}</span>}
        </div>
        {meta && <p className="text-muted small mb-2">{meta}</p>}
        {links?.length > 0 && (
          <div className="d-flex gap-3 small mb-2">
            {links.map((l) => (
              <a key={l.label} href={l.href} target="_blank" rel="noreferrer">
                {l.label} ↗
              </a>
            ))}
          </div>
        )}
        <div className="mt-auto d-flex gap-2 pt-2">
          <Button variant="outline-secondary" className="btn-sm" onClick={onEdit}>
            Edit
          </Button>
          <Button variant="outline-danger" className="btn-sm" onClick={onDelete}>
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   Main Admin dashboard
--------------------------------------------------------- */

const NAV_ITEMS = [
  { id: "education", label: "Education", icon: "🎓" },
  { id: "skills", label: "Skills", icon: "🛠" },
  { id: "projects", label: "Projects", icon: "🧩" },
  { id: "resume", label: "Resume & CV", icon: "📄" },
];

export default function Admin() {
  const [admin, setAdmin] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [activeTab, setActiveTab] = useState("education");
  const [banner, setBanner] = useState(null);

  const notify = useCallback((type, message) => {
    setBanner({ type, message });
    window.clearTimeout(window.__adminBannerTimeout);
    window.__adminBannerTimeout = window.setTimeout(() => setBanner(null), 3500);
  }, []);

  // No dedicated "/me" route exists on the backend yet — wire up a real
  // session check when available; for now we just show the login screen.
  useEffect(() => {
    setCheckingAuth(false);
  }, []);

  const logout = () => {
    document.cookie = "adminToken=; Max-Age=0; path=/;";
    setAdmin(null);
  };

  if (checkingAuth) {
    return (
      <div className="d-flex align-items-center justify-content-center bg-dark min-vh-100">
        <Spinner />
      </div>
    );
  }

  if (!admin) {
    return <AuthScreen onAuthed={setAdmin} notify={notify} />;
  }

  return (
    <div className="d-flex min-vh-100 bg-light">
      <Banner banner={banner} onClose={() => setBanner(null)} />

      {/* Sidebar */}
      <aside className="d-flex flex-column bg-dark text-white p-3" style={{ width: 260 }}>
        <div className="d-flex align-items-center gap-3 mb-4 pb-3 border-bottom border-secondary">
          {admin.profilePicture ? (
            <img src={admin.profilePicture} alt={admin.name} className="rounded-circle" width={42} height={42} style={{ objectFit: "cover" }} />
          ) : (
            <div
              className="rounded-circle bg-primary-subtle text-primary-emphasis d-flex align-items-center justify-content-center fw-bold"
              style={{ width: 42, height: 42 }}
            >
              {admin.name?.[0]?.toUpperCase() || "A"}
            </div>
          )}
          <div>
            <p className="mb-0 fw-semibold">{admin.name}</p>
            <p className="mb-0 small text-secondary">{admin.email}</p>
          </div>
        </div>

        <nav className="nav nav-pills flex-column gap-1">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`nav-link text-start d-flex align-items-center gap-2 ${activeTab === item.id ? "active" : "text-white-50"}`}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-3">
          <Button variant="outline-light" onClick={logout} className="w-100">
            Log out
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-grow-1 p-4 p-md-5 overflow-auto">
        <header className="mb-4">
          <p className="text-muted mb-0 small">Portfolio admin</p>
          <h2 className="fw-bold">{NAV_ITEMS.find((n) => n.id === activeTab)?.label}</h2>
        </header>

        {activeTab === "education" && <EducationSection notify={notify} />}
        {activeTab === "skills" && <SkillsSection notify={notify} />}
        {activeTab === "projects" && <ProjectsSection notify={notify} />}
        {activeTab === "resume" && <ResumeSection notify={notify} />}
      </main>
    </div>
  );
}