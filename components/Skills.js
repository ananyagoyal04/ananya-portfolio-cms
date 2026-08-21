import Reveal from './Reveal';

export default function Skills({ skills }) {
  return (
    <section className="skills" id="skills">
      <div className="wrap">
        <div className="sec-head">
          <div>
            <Reveal><span className="sec-label">02 &mdash; Stack</span></Reveal>
            <Reveal delay={0.05}><h2 className="sec-title">What I build with.</h2></Reveal>
            <Reveal delay={0.1}><p className="funky-line" style={{ marginTop: 14 }}>git commit -m &quot;it works now, don&apos;t ask how&quot;</p></Reveal>
          </div>
          <Reveal><p className="sec-note">Six categories, one growing toolkit &mdash; hover a row to look closer.</p></Reveal>
        </div>

        <div className="skill-list">
          {skills.map((s, i) => (
            <Reveal key={s._id || s.category} delay={i * 0.05}>
              <div className="skill-row" data-cursor-text="Skill">
                <span className="skill-num">{String(i + 1).padStart(2, '0')}</span>
                <span className="skill-cat">{s.category}</span>
                <span className="skill-items">
                  {(s.items || []).map((item) => <span key={item}>{item}</span>)}
                </span>
                <span className="skill-arrow">&#8594;</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
