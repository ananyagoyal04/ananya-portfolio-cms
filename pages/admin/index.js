import { useEffect, useState, useCallback } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

const TABS = ['Profile', 'Skills', 'Certificates', 'Projects', 'Education'];

/* ---------------------------------------------------------------
   Shared helpers
   --------------------------------------------------------------- */
function openCloudinaryUpload(onDone) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
  if (!cloudName || !uploadPreset || !window.cloudinary) {
    alert('Cloudinary is not configured yet — see the README for the two env vars needed, or just paste a URL into the field manually.');
    return;
  }
  const widget = window.cloudinary.createUploadWidget(
    { cloudName, uploadPreset, sources: ['local'], multiple: false, resourceType: 'auto' },
    (error, result) => {
      if (!error && result && result.event === 'success') {
        onDone(result.info.secure_url);
      }
    }
  );
  widget.open();
}

async function apiCall(url, method, body) {
  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

function UploadField({ label, value, onChange, accept }) {
  return (
    <div className="admin-field">
      <label>{label}</label>
      {value && accept === 'image' && <img src={value} alt="" className="admin-upload-preview" />}
      <input type="text" value={value || ''} onChange={(e) => onChange(e.target.value)} placeholder="https://…  (or click Upload)" />
      <div style={{ marginTop: 8 }}>
        <button type="button" className="admin-btn" onClick={() => openCloudinaryUpload(onChange)}>Upload file</button>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   Profile tab
   --------------------------------------------------------------- */
function ProfileTab({ profile, setProfile, onSaved }) {
  const [form, setForm] = useState(profile);
  const [saving, setSaving] = useState(false);
  useEffect(() => setForm(profile), [profile]);

  async function save() {
    setSaving(true);
    try {
      await apiCall('/api/profile', 'PUT', form);
      setProfile(form);
      onSaved('Profile updated.');
    } catch (e) {
      onSaved(e.message, true);
    }
    setSaving(false);
  }

  return (
    <div className="admin-card">
      <h3>Profile &amp; hero content</h3>
      <div className="admin-row">
        <div className="admin-field"><label>Name</label><input value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
        <div className="admin-field"><label>Location</label><input value={form.location || ''} onChange={(e) => setForm({ ...form, location: e.target.value })} /></div>
      </div>
      <div className="admin-field"><label>Eyebrow (title line above name)</label><input value={form.eyebrow || ''} onChange={(e) => setForm({ ...form, eyebrow: e.target.value })} /></div>
      <div className="admin-row">
        <div className="admin-field"><label>Hero line 1</label><input value={form.heroLine1 || ''} onChange={(e) => setForm({ ...form, heroLine1: e.target.value })} /></div>
        <div className="admin-field"><label>Hero line 2 (your name, accent)</label><input value={form.heroLine2 || ''} onChange={(e) => setForm({ ...form, heroLine2: e.target.value })} /></div>
      </div>
      <div className="admin-field"><label>Funky one-liner under the name</label><input value={form.funkyHero || ''} onChange={(e) => setForm({ ...form, funkyHero: e.target.value })} /></div>
      <div className="admin-field"><label>Hero description</label><textarea value={form.heroDesc || ''} onChange={(e) => setForm({ ...form, heroDesc: e.target.value })} /></div>

      <div className="admin-row">
        <div className="admin-field"><label>About heading — line 1</label><input value={form.aboutHeadingLine1 || ''} onChange={(e) => setForm({ ...form, aboutHeadingLine1: e.target.value })} /></div>
        <div className="admin-field"><label>About heading — line 2 (accent)</label><input value={form.aboutHeadingLine2 || ''} onChange={(e) => setForm({ ...form, aboutHeadingLine2: e.target.value })} /></div>
      </div>
      <div className="admin-field"><label>About paragraph</label><textarea value={form.aboutParagraph || ''} onChange={(e) => setForm({ ...form, aboutParagraph: e.target.value })} /></div>

      <div className="admin-row">
        <div className="admin-field"><label>Email</label><input value={form.email || ''} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
        <div className="admin-field"><label>GitHub URL</label><input value={form.github || ''} onChange={(e) => setForm({ ...form, github: e.target.value })} /></div>
      </div>
      <div className="admin-field"><label>LinkedIn URL</label><input value={form.linkedin || ''} onChange={(e) => setForm({ ...form, linkedin: e.target.value })} /></div>

      <UploadField label="Portrait photo" value={form.portraitUrl} accept="image" onChange={(v) => setForm({ ...form, portraitUrl: v })} />
      <UploadField label="Resume PDF" value={form.resumeUrl} onChange={(v) => setForm({ ...form, resumeUrl: v })} />

      <div className="admin-actions">
        <button className="admin-btn primary" onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save profile'}</button>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   Generic list-based tab (Skills / Certificates / Projects / Education)
   --------------------------------------------------------------- */
function ListTab({ endpoint, items, setItems, emptyItem, renderFields, renderSummary, onSaved }) {
  const [draft, setDraft] = useState(emptyItem);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  function startEdit(item) {
    setEditingId(item._id);
    setDraft(item);
  }
  function resetForm() {
    setEditingId(null);
    setDraft(emptyItem);
  }

  async function save() {
    setSaving(true);
    try {
      if (editingId) {
        await apiCall(`/api/${endpoint}`, 'PUT', { ...draft, _id: editingId });
        setItems(items.map((it) => (it._id === editingId ? { ...draft, _id: editingId } : it)));
        onSaved('Updated.');
      } else {
        const created = await apiCall(`/api/${endpoint}`, 'POST', draft);
        setItems([...items, created]);
        onSaved('Added.');
      }
      resetForm();
    } catch (e) {
      onSaved(e.message, true);
    }
    setSaving(false);
  }

  async function remove(id) {
    if (!confirm('Delete this entry?')) return;
    try {
      await apiCall(`/api/${endpoint}`, 'DELETE', { _id: id });
      setItems(items.filter((it) => it._id !== id));
      onSaved('Deleted.');
      if (editingId === id) resetForm();
    } catch (e) {
      onSaved(e.message, true);
    }
  }

  return (
    <>
      <div className="admin-card">
        <h3>{editingId ? 'Edit entry' : 'Add new'}</h3>
        {renderFields(draft, setDraft)}
        <div className="admin-actions">
          <button className="admin-btn primary" onClick={save} disabled={saving}>
            {saving ? 'Saving…' : editingId ? 'Update' : 'Add'}
          </button>
          {editingId && <button className="admin-btn" onClick={resetForm}>Cancel edit</button>}
        </div>
      </div>

      <div className="admin-card">
        <h3>Current entries ({items.length})</h3>
        {items.length === 0 && <p className="mono" style={{ color: 'var(--ink-faint)', fontSize: 13 }}>Nothing here yet.</p>}
        {items.map((item) => (
          <div className="admin-list-item" key={item._id}>
            <span>{renderSummary(item)}</span>
            <div className="admin-actions" style={{ marginTop: 0 }}>
              <button className="admin-btn" onClick={() => startEdit(item)}>Edit</button>
              <button className="admin-btn danger" onClick={() => remove(item._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

/* ---------------------------------------------------------------
   Main dashboard
   --------------------------------------------------------------- */
export default function AdminDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState('Profile');
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState(null);

  const [profile, setProfile] = useState({});
  const [skills, setSkills] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [projects, setProjects] = useState([]);
  const [education, setEducation] = useState([]);

  const notify = useCallback((text, isError = false) => {
    setMsg({ text, isError });
    setTimeout(() => setMsg(null), 3500);
  }, []);

  useEffect(() => {
    async function load() {
      const [p, sk, ce, pr, ed] = await Promise.all([
        fetch('/api/profile').then((r) => r.json()),
        fetch('/api/skills').then((r) => r.json()),
        fetch('/api/certificates').then((r) => r.json()),
        fetch('/api/projects').then((r) => r.json()),
        fetch('/api/education').then((r) => r.json())
      ]);
      setProfile(p);
      setSkills(sk);
      setCertificates(ce);
      setProjects(pr);
      setEducation(ed);
      setLoading(false);
    }
    load();
  }, []);

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  }

  if (loading) {
    return <div className="admin-shell"><div className="admin-body"><p className="mono">Loading…</p></div></div>;
  }

  return (
    <div className="admin-shell">
      <Head><title>Admin — Ananya Goyal</title></Head>

      <div className="admin-header">
        <span className="logo">AG<em style={{ color: 'var(--fire)' }}>.</em> admin</span>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <a href="/" target="_blank" rel="noreferrer" className="admin-btn" style={{ fontSize: 12 }}>View live site &#8599;</a>
          <button className="admin-logout" onClick={logout}>Log out</button>
        </div>
      </div>

      <div className="admin-body">
        {msg && <div className={`admin-msg ${msg.isError ? 'err' : 'ok'}`}>{msg.text}</div>}

        <div className="admin-tabs">
          {TABS.map((t) => (
            <button key={t} className={`admin-tab${tab === t ? ' active' : ''}`} onClick={() => setTab(t)}>{t}</button>
          ))}
        </div>

        {tab === 'Profile' && <ProfileTab profile={profile} setProfile={setProfile} onSaved={notify} />}

        {tab === 'Skills' && (
          <ListTab
            endpoint="skills"
            items={skills}
            setItems={setSkills}
            emptyItem={{ category: '', items: [] }}
            onSaved={notify}
            renderSummary={(it) => `${it.category} — ${(it.items || []).join(', ')}`}
            renderFields={(draft, setDraft) => (
              <>
                <div className="admin-field"><label>Category name</label><input value={draft.category || ''} onChange={(e) => setDraft({ ...draft, category: e.target.value })} /></div>
                <div className="admin-field">
                  <label>Skills (comma-separated)</label>
                  <input
                    value={(draft.items || []).join(', ')}
                    onChange={(e) => setDraft({ ...draft, items: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) })}
                  />
                </div>
              </>
            )}
          />
        )}

        {tab === 'Certificates' && (
          <ListTab
            endpoint="certificates"
            items={certificates}
            setItems={setCertificates}
            emptyItem={{ title: '', subtitle: '', imageUrl: '', certUrl: '' }}
            onSaved={notify}
            renderSummary={(it) => `${it.title} — ${it.subtitle || ''}`}
            renderFields={(draft, setDraft) => (
              <>
                <div className="admin-row">
                  <div className="admin-field"><label>Title</label><input value={draft.title || ''} onChange={(e) => setDraft({ ...draft, title: e.target.value })} /></div>
                  <div className="admin-field"><label>Issuer / subtitle</label><input value={draft.subtitle || ''} onChange={(e) => setDraft({ ...draft, subtitle: e.target.value })} /></div>
                </div>
                <UploadField label="Certificate image (jpg/png)" value={draft.imageUrl} accept="image" onChange={(v) => setDraft({ ...draft, imageUrl: v })} />
                <UploadField label="Certificate PDF (optional — leave blank to just use the image)" value={draft.certUrl} onChange={(v) => setDraft({ ...draft, certUrl: v })} />
              </>
            )}
          />
        )}

        {tab === 'Projects' && (
          <ListTab
            endpoint="projects"
            items={projects}
            setItems={setProjects}
            emptyItem={{ name: '', status: '', description: '', techStack: [], funkyLine: '' }}
            onSaved={notify}
            renderSummary={(it) => `${it.name} — ${it.status || ''}`}
            renderFields={(draft, setDraft) => (
              <>
                <div className="admin-row">
                  <div className="admin-field"><label>Project name</label><input value={draft.name || ''} onChange={(e) => setDraft({ ...draft, name: e.target.value })} /></div>
                  <div className="admin-field"><label>Status</label><input value={draft.status || ''} onChange={(e) => setDraft({ ...draft, status: e.target.value })} placeholder="e.g. Prototype · In Progress" /></div>
                </div>
                <div className="admin-field"><label>Description</label><textarea value={draft.description || ''} onChange={(e) => setDraft({ ...draft, description: e.target.value })} /></div>
                <div className="admin-field">
                  <label>Tech stack (comma-separated)</label>
                  <input
                    value={(draft.techStack || []).join(', ')}
                    onChange={(e) => setDraft({ ...draft, techStack: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) })}
                  />
                </div>
                <div className="admin-field"><label>Funky one-liner (optional)</label><input value={draft.funkyLine || ''} onChange={(e) => setDraft({ ...draft, funkyLine: e.target.value })} /></div>
              </>
            )}
          />
        )}

        {tab === 'Education' && (
          <ListTab
            endpoint="education"
            items={education}
            setItems={setEducation}
            emptyItem={{ level: '', degree: '', institution: '', note: '', years: '', score: '' }}
            onSaved={notify}
            renderSummary={(it) => `${it.degree} — ${it.institution}`}
            renderFields={(draft, setDraft) => (
              <>
                <div className="admin-row">
                  <div className="admin-field"><label>Level label (e.g. 24—NOW or 12th)</label><input value={draft.level || ''} onChange={(e) => setDraft({ ...draft, level: e.target.value })} /></div>
                  <div className="admin-field"><label>Years (e.g. 2024 — Present)</label><input value={draft.years || ''} onChange={(e) => setDraft({ ...draft, years: e.target.value })} /></div>
                </div>
                <div className="admin-field"><label>Degree / class</label><input value={draft.degree || ''} onChange={(e) => setDraft({ ...draft, degree: e.target.value })} /></div>
                <div className="admin-field"><label>Institution</label><input value={draft.institution || ''} onChange={(e) => setDraft({ ...draft, institution: e.target.value })} /></div>
                <div className="admin-field"><label>Note</label><textarea value={draft.note || ''} onChange={(e) => setDraft({ ...draft, note: e.target.value })} /></div>
                <div className="admin-field"><label>Score / CGPA badge (e.g. CGPA — 8.9)</label><input value={draft.score || ''} onChange={(e) => setDraft({ ...draft, score: e.target.value })} /></div>
              </>
            )}
          />
        )}
      </div>
    </div>
  );
}
