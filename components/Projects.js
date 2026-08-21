import Reveal from './Reveal';
import Tilt from './Tilt';

export default function Projects({ projects }) {
  const hasProjects = projects && projects.length > 0;

  return (
    <section className="projects" id="projects">
      <div className="wrap">
        <div className="sec-head">
          <div>
            <Reveal><span className="sec-label">04 &mdash; Projects</span></Reveal>
            <Reveal delay={0.05}>
              <h2 className="sec-title">
                {hasProjects ? 'What I\u2019m building.' : 'Currently building something worth showing.'}
              </h2>
            </Reveal>
          </div>
          <Reveal><p className="sec-note">This space grows as prototypes turn into real, shipped work.</p></Reveal>
        </div>

        {hasProjects ? (
          projects.map((p, i) => (
            <Reveal key={p._id || p.name} type="scale" delay={i * 0.06}>
              <Tilt className="project-card" maxTilt={3} style={{ marginBottom: 26 }}>
                <div className="grid-bg" aria-hidden="true"></div>
                <div className="glow" aria-hidden="true"></div>
                <div className="project-inner">
                  {p.status && <span className="status-pill">{p.status}</span>}
                  <h3>{p.name}</h3>
                  {p.description && <p>{p.description}</p>}
                  {p.techStack && p.techStack.length > 0 && (
                    <div className="project-tags">
                      {p.techStack.map((t) => <span key={t}>{t}</span>)}
                    </div>
                  )}
                  {p.funkyLine && <p className="funky-line" style={{ marginTop: 20 }}>{p.funkyLine}</p>}
                  <div className="project-arrow">
                    <span>Demo coming soon</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path d="M12 5v14M5 12l7 7 7-7" />
                    </svg>
                  </div>
                </div>
              </Tilt>
            </Reveal>
          ))
        ) : (
          <Reveal type="scale">
            <Tilt className="project-card" maxTilt={3}>
              <div className="grid-bg" aria-hidden="true"></div>
              <div className="glow" aria-hidden="true"></div>
              <div className="project-inner">
                <span className="status-pill">In Progress</span>
                <h3>First real projects are being prototyped.</h3>
                <p>Nothing fake goes here. When something ships, it lands in this exact spot.</p>
              </div>
            </Tilt>
          </Reveal>
        )}
      </div>
    </section>
  );
}
