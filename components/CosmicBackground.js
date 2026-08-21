import { useEffect, useRef } from 'react';

export default function CosmicBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;

    let W, H, DPR;
    let stars = [];
    let glyphs = [];
    const CHARSET = '{}<>();=+-*/01#$%&[]';
    let centerXRatio = 0.74, centerYRatio = 0.4;
    let cx, cy, MAX_R, MIN_R;
    let parX = 0, parY = 0, targetParX = 0, targetParY = 0;
    let t = 0;
    let rafId;

    function layoutCenter() {
      if (window.innerWidth <= 760) { centerXRatio = 0.62; centerYRatio = 0.22; }
      else if (window.innerWidth <= 1024) { centerXRatio = 0.68; centerYRatio = 0.3; }
      else { centerXRatio = 0.74; centerYRatio = 0.4; }
      cx = W * centerXRatio;
      cy = H * centerYRatio;
    }

    function resize() {
      DPR = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W * DPR;
      canvas.height = H * DPR;
      canvas.style.width = W + 'px';
      canvas.style.height = H + 'px';
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      layoutCenter();
    }

    function makeStars() {
      stars = [];
      const count = Math.min(140, Math.floor((W * H) / 11000));
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * W, y: Math.random() * H, r: Math.random() * 1.3 + 0.3,
          baseAlpha: Math.random() * 0.5 + 0.25, speed: Math.random() * 0.02 + 0.006,
          phase: Math.random() * Math.PI * 2
        });
      }
    }

    function spawnGlyph(radius) {
      return { angle: Math.random() * Math.PI * 2, radius, char: CHARSET[Math.floor(Math.random() * CHARSET.length)], size: Math.random() * 5 + 9 };
    }
    function resetGlyph(g) {
      g.radius = MAX_R * (0.85 + Math.random() * 0.15);
      g.angle = Math.random() * Math.PI * 2;
      g.char = CHARSET[Math.floor(Math.random() * CHARSET.length)];
      g.size = Math.random() * 5 + 9;
    }
    function makeGlyphs() {
      glyphs = [];
      MAX_R = Math.min(W, H) * 0.46;
      MIN_R = 14;
      const count = window.innerWidth <= 760 ? 130 : 260;
      for (let i = 0; i < count; i++) glyphs.push(spawnGlyph(Math.random() * MAX_R));
    }

    resize(); makeStars(); makeGlyphs();

    function onResize() { resize(); makeStars(); makeGlyphs(); }
    window.addEventListener('resize', onResize);

    function onMouseMove(e) {
      targetParX = (e.clientX / window.innerWidth - 0.5) * 26;
      targetParY = (e.clientY / window.innerHeight - 0.5) * 26;
    }
    if (isFinePointer) window.addEventListener('mousemove', onMouseMove);

    function lerpColor(a, b, k) {
      return [Math.round(a[0] + (b[0]-a[0])*k), Math.round(a[1] + (b[1]-a[1])*k), Math.round(a[2] + (b[2]-a[2])*k)];
    }
    function colorForFraction(f) {
      if (f < 0.5) return lerpColor([120,224,210],[255,177,78], f/0.5);
      return lerpColor([255,177,78],[255,90,50], (f-0.5)/0.5);
    }

    function draw() {
      t += 1;
      parX += (targetParX - parX) * 0.05;
      parY += (targetParY - parY) * 0.05;
      ctx.clearRect(0, 0, W, H);

      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        const a = reduceMotion ? s.baseAlpha : s.baseAlpha + Math.sin(t * s.speed + s.phase) * 0.25;
        ctx.beginPath();
        ctx.arc(s.x + parX*0.1, s.y + parY*0.1, s.r, 0, Math.PI*2);
        ctx.fillStyle = `rgba(244,241,255,${Math.max(0, Math.min(1,a))})`;
        ctx.fill();
      }

      const ox = cx + parX, oy = cy + parY;

      const glow = ctx.createRadialGradient(ox, oy, MIN_R*0.5, ox, oy, MAX_R*0.9);
      glow.addColorStop(0, 'rgba(255,120,60,0.35)');
      glow.addColorStop(0.35, 'rgba(255,90,50,0.12)');
      glow.addColorStop(1, 'rgba(255,90,50,0)');
      ctx.fillStyle = glow;
      ctx.beginPath(); ctx.arc(ox, oy, MAX_R*0.9, 0, Math.PI*2); ctx.fill();

      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      const speed = reduceMotion ? 0 : 1;
      for (let j = 0; j < glyphs.length; j++) {
        const g = glyphs[j];
        let frac = 1 - (g.radius - MIN_R) / (MAX_R - MIN_R);
        frac = Math.max(0, Math.min(1, frac));
        const angularSpeed = (0.0016 + 0.02 / (g.radius + 20)) * speed;
        const inwardSpeed = (0.15 + frac*frac*1.6) * speed;
        g.angle += angularSpeed; g.radius -= inwardSpeed;
        if (g.radius <= MIN_R) { resetGlyph(g); continue; }
        const gx = ox + Math.cos(g.angle) * g.radius;
        const gy = oy + Math.sin(g.angle) * g.radius * 0.62;
        const col = colorForFraction(frac);
        const alpha = 0.25 + frac*0.65;
        ctx.font = `${g.size.toFixed(0)}px "JetBrains Mono", monospace`;
        ctx.fillStyle = `rgba(${col[0]},${col[1]},${col[2]},${alpha.toFixed(2)})`;
        if (frac > 0.55) { ctx.shadowBlur = 10*frac; ctx.shadowColor = `rgba(255,120,50,${(frac*0.8).toFixed(2)})`; }
        else ctx.shadowBlur = 0;
        ctx.fillText(g.char, gx, gy);
      }
      ctx.shadowBlur = 0;

      const core = ctx.createRadialGradient(ox, oy, 0, ox, oy, MIN_R*1.6);
      core.addColorStop(0, 'rgba(2,1,4,1)');
      core.addColorStop(0.7, 'rgba(2,1,4,1)');
      core.addColorStop(1, 'rgba(255,120,60,0.25)');
      ctx.fillStyle = core;
      ctx.beginPath(); ctx.arc(ox, oy, MIN_R*1.6, 0, Math.PI*2); ctx.fill();

      rafId = requestAnimationFrame(draw);
    }
    draw();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
      if (isFinePointer) window.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  return (
    <div className="cosmic-bg">
      <canvas id="vortex-canvas" ref={canvasRef} />
      <div className="vignette" />
    </div>
  );
}
