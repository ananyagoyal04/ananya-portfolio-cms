import Reveal from './Reveal';

export default function Education({ education }) {
  return (
    <section className="education" id="education">
      <div className="wrap">
        <Reveal><span className="sec-label">05 &mdash; Education</span></Reveal>

        {education.map((e, i) => (
          <div className="edu-item" key={e._id || e.degree}>
            <Reveal type="left" delay={i * 0.08}>
              <span className="edu-years" aria-hidden="true">
                {e.level && e.level.length <= 3 ? (
                  <>{e.level}<sup style={{ WebkitTextStroke: 0, fontSize: '0.4em' }}>{e.level === '12th' ? 'th' : ''}</sup></>
                ) : (
                  e.level
                )}
              </span>
            </Reveal>
            <Reveal type="right" delay={i * 0.08 + 0.05}>
              <div className="edu-content">
                <h3 className="edu-degree">{e.degree}</h3>
                <p className="edu-school">{e.institution}</p>
                {e.note && <p className="edu-note">{e.note}</p>}
                <div className="edu-meta">
                  {e.years && <span className="edu-status">{e.years}</span>}
                  {e.score && <span className="edu-cgpa">{e.score}</span>}
                </div>
              </div>
            </Reveal>
          </div>
        ))}
      </div>
    </section>
  );
}
