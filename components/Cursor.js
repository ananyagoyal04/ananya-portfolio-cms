import { useEffect, useRef } from 'react';

export default function Cursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;

    if (!isFinePointer || reduceMotion) {
      document.body.classList.add('no-cursor');
      return;
    }

    const dot = dotRef.current, ring = ringRef.current, ringText = textRef.current;
    let mouseX = window.innerWidth/2, mouseY = window.innerHeight/2, ringX = mouseX, ringY = mouseY;
    let rafId;

    function onMove(e) {
      mouseX = e.clientX; mouseY = e.clientY;
      dot.style.transform = `translate(${mouseX}px,${mouseY}px) translate(-50%,-50%)`;
    }
    window.addEventListener('mousemove', onMove);

    function animate() {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      ring.style.transform = `translate(${ringX}px,${ringY}px) translate(-50%,-50%)`;
      rafId = requestAnimationFrame(animate);
    }
    animate();

    function attach() {
      const targets = document.querySelectorAll('a, button, .skill-row, [data-cursor-text]');
      targets.forEach((el) => {
        el.addEventListener('mouseenter', () => {
          const txt = el.getAttribute('data-cursor-text');
          ringText.textContent = txt && txt.length ? txt : 'View';
          ring.classList.add('active');
        });
        el.addEventListener('mouseleave', () => {
          ring.classList.remove('active');
          ringText.textContent = '';
        });
      });
    }
    // slight delay so dynamically-rendered content (from the DB) is in the DOM
    const timeout = setTimeout(attach, 400);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMove);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <>
      <div className="cursor-dot" ref={dotRef} />
      <div className="cursor-ring" ref={ringRef}><span ref={textRef}></span></div>
    </>
  );
}
