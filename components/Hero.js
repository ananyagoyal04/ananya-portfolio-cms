import Reveal from './Reveal';
import Tilt from './Tilt';

export default function Hero({ profile }) {
  return (
    <section className="hero" id="hero">
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <Reveal><p className="eyebrow">{profile.eyebrow}</p></Reveal>
          <h1 className="hero-title">
            <Reveal as="span" className="line">{profile.heroLine1}</Reveal>
            <Reveal as="span" className="line grad-text" delay={0.08}>{profile.heroLine2}</Reveal>
          </h1>
          {profile.funkyHero && (
            <Reveal delay={0.15}><p className="funky-line funky-hero">{profile.funkyHero}</p></Reveal>
          )}
          <Reveal delay={0.2}><p className="hero-desc">{profile.heroDesc}</p></Reveal>
          <Reveal delay={0.28}>
            <div className="hero-actions">
              <a href={`mailto:${profile.email}`} className="btn btn-solid" data-cursor-text="Email">Say hello</a>
              {profile.github && (
                <a href={profile.github} target="_blank" rel="noopener noreferrer" className="btn btn-line" data-cursor-text="Open">GitHub &#8599;</a>
              )}
              {profile.linkedin && (
                <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="btn btn-line" data-cursor-text="Open">LinkedIn &#8599;</a>
              )}
            </div>
          </Reveal>
        </div>

        <Reveal type="scale" delay={0.1}>
          <div className="portrait-wrap">
            <div className="portrait-shape" aria-hidden="true"></div>
            <Tilt className="portrait-card" maxTilt={7}>
              {profile.portraitUrl ? (
                <img src={profile.portraitUrl} alt={`Portrait of ${profile.name}`} />
              ) : (
                <div className="portrait-fallback">
                  <span className="initials">AG</span>
                  <span className="mono-tag">photo coming soon</span>
                </div>
              )}
              {profile.location && <span className="portrait-tag">{profile.location}</span>}
            </Tilt>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
