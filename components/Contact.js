import Reveal from './Reveal';

export default function Contact({ profile }) {
  return (
    <section className="contact" id="contact">
      <div className="wrap">
        <Reveal><p className="sec-label" style={{ textAlign: 'center' }}>06 &mdash; Contact</p></Reveal>
        <Reveal delay={0.05}>
          <h2 className="contact-statement">
            Have an idea? <span>Let&apos;s</span><br />
            make <em>something.</em>
          </h2>
        </Reveal>
        <Reveal delay={0.1}><p className="funky-line" style={{ textAlign: 'center', display: 'block' }}>&lt;Ananya.exe running /&gt;</p></Reveal>
        <Reveal delay={0.15}>
          <a href={`mailto:${profile.email}`} className="contact-email" data-cursor-text="Copy">{profile.email}</a>
        </Reveal>
        <Reveal delay={0.2}>
          <div className="contact-links">
            {profile.github && (
              <a href={profile.github} target="_blank" rel="noopener noreferrer" className="contact-link" data-cursor-text="Open">
                GitHub <span className="arrow">&#8599;</span>
              </a>
            )}
            {profile.linkedin && (
              <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="contact-link" data-cursor-text="Open">
                LinkedIn <span className="arrow">&#8599;</span>
              </a>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
