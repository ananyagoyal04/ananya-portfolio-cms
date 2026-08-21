import { useEffect, useState } from 'react';

const LINKS = [
  { href: '#about', label: 'About' },
  { href: '#skills', label: 'Skills' },
  { href: '#certificates', label: 'Certificates' },
  { href: '#projects', label: 'Projects' },
  { href: '#education', label: 'Education' },
  { href: '#contact', label: 'Contact' }
];

export default function Nav({ email }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('');

  useEffect(() => {
    const sections = LINKS.map((l) => document.querySelector(l.href)).filter(Boolean);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive('#' + entry.target.id);
        });
      },
      { threshold: 0.4 }
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  return (
    <>
      <header>
        <nav>
          <a href="#top" className="logo">AG<em>.</em></a>
          <ul className="nav-links">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href} className={active === l.href ? 'active' : ''}>{l.label}</a>
              </li>
            ))}
          </ul>
          <a href={`mailto:${email}`} className="nav-cta" data-cursor-text="Say hi">Get in touch</a>
          <button className={`menu-toggle${open ? ' open' : ''}`} aria-label="Toggle menu" aria-expanded={open} onClick={() => setOpen(!open)}>
            <span></span><span></span><span></span>
          </button>
        </nav>
      </header>

      {open && (
        <div className="mobile-menu">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)}>{l.label}</a>
          ))}
          <a href={`mailto:${email}`} className="mm-email" onClick={() => setOpen(false)}>{email}</a>
        </div>
      )}
    </>
  );
}
