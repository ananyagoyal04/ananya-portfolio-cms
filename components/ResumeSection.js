import Reveal from './Reveal';

const STAR_POS = [
  [12,8],[22,88],[78,6],[85,92],[8,45],[15,70,'big'],[95,45],[4,50],[40,8],[15,30,'big'],
  [85,65],[20,70],[60,38],[25,5],[65,95],[50,60,'big'],[35,20],[55,80]
];

export default function ResumeSection({ profile }) {
  if (!profile.resumeUrl) return null;
  return (
    <section className="resume" id="resume">
      <div className="wrap">
        <Reveal type="scale">
          <div className="resume-card">
            <div className="resume-stars" aria-hidden="true">
              {STAR_POS.map(([top, left, big], i) => (
                <span key={i} className={big ? 'big' : ''} style={{ top: `${top}%`, left: `${left}%`, animationDelay: `${(i % 6) * 0.3}s` }} />
              ))}
            </div>
            <div className="resume-inner">
              <span className="sec-label" style={{ textAlign: 'center' }}>Résumé</span>
              <h2>Want the <em>full picture?</em></h2>
              <p className="mono">Every skill, every detail, one PDF away.</p>
              <div className="resume-orbit">
                <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer" className="btn btn-solid resume-btn" data-cursor-text="View">
                  See my resume &#8599;
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
