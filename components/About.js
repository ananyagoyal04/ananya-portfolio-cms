import Reveal from './Reveal';

export default function About({ profile }) {
  return (
    <section className="about" id="about">
      <div className="wrap">
        <Reveal><span className="sec-label">01 &mdash; About</span></Reveal>
        <Reveal delay={0.05}>
          <h2 className="about-statement">
            {profile.aboutHeadingLine1}<br />
            <em>{profile.aboutHeadingLine2}</em>
          </h2>
        </Reveal>
        <Reveal delay={0.1}><p className="funky-line">still debugging life, one semicolon at a time</p></Reveal>

        <div className="about-lower">
          <Reveal type="left"><p>{profile.aboutParagraph}</p></Reveal>
          <Reveal type="right">
            <div>
              <div className="about-detail">
                <span className="num">01</span>
                <span className="txt">Frontend-first, with an eye for interface and interaction detail.</span>
              </div>
              <div className="about-detail" style={{ marginTop: 20 }}>
                <span className="num">02</span>
                <span className="txt">Comfortable moving between code editor and design tool.</span>
              </div>
              <div className="about-detail" style={{ marginTop: 20 }}>
                <span className="num">03</span>
                <span className="txt">Currently expanding into full-stack &mdash; APIs, servers, databases.</span>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
