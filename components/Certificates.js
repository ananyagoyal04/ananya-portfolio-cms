import { useState } from 'react';
import Reveal from './Reveal';
import Tilt from './Tilt';

function CertImage({ src, alt }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return (
      <div className="cert-fallback">
        <span className="mono-tag">not added yet</span>
      </div>
    );
  }
  return <img src={src} alt={alt} onError={() => setFailed(true)} />;
}

export default function Certificates({ certificates }) {
  return (
    <section className="certificates" id="certificates">
      <div className="wrap">
        <div className="sec-head">
          <div>
            <Reveal><span className="sec-label">03 &mdash; Certifications</span></Reveal>
            <Reveal delay={0.05}><h2 className="sec-title">Proof, not just promises.</h2></Reveal>
            <Reveal delay={0.1}><p className="funky-line" style={{ marginTop: 14 }}>collecting badges like they&apos;re Pok&eacute;mon cards</p></Reveal>
          </div>
          <Reveal><p className="sec-note">Click a card to view the certificate.</p></Reveal>
        </div>

        <div className="cert-grid">
          {certificates.map((c, i) => {
            const clickable = !c.certUrl && c.imageUrl;
            const CardInner = (
              <>
                <div className="cert-image">
                  <CertImage src={c.imageUrl} alt={`${c.title} certificate`} />
                </div>
                <div className="cert-body">
                  <h3>{c.title}</h3>
                  <p className="cert-sub">{c.subtitle}</p>
                  {c.certUrl && (
                    <a href={c.certUrl} target="_blank" rel="noopener noreferrer" className="cert-link" data-cursor-text="View">
                      See certificate &#8599;
                    </a>
                  )}
                </div>
              </>
            );
            return (
              <Reveal key={c._id || c.title} type="scale" delay={i * 0.05}>
                <Tilt className="cert-card" maxTilt={5}>
                  {clickable ? (
                    <a href={c.imageUrl} target="_blank" rel="noopener noreferrer" data-cursor-text="View" style={{ display: 'contents' }}>
                      {CardInner}
                    </a>
                  ) : (
                    CardInner
                  )}
                </Tilt>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
