import React, { useRef } from 'react';
import {gsap, useGSAP} from "/gsap.config.js"


const PageTransition = ({ isActive, onMidpoint, onComplete }) => {
  const overlayRef = useRef(null);

  useGSAP(() => {
    if (!isActive) return;

    const overlay = overlayRef.current;
    if (!overlay) return;

    const tl = gsap.timeline();

    // Phase 1: Fade in overlay to cover screen
    tl.fromTo(
      overlay,
      { opacity: 0, visibility: 'visible' },
      {
        opacity: 1,
        duration: 0.4,
        ease: 'power2.inOut',
      }
    );

    // Midpoint: Screen is covered, trigger page swap
    tl.call(() => {
      onMidpoint?.();
    });

    // Small hold
    tl.to({}, { duration: 0.15 });

    // Phase 2: Fade out overlay to reveal new page
    tl.to(overlay, {
      opacity: 0,
      duration: 0.4,
      ease: 'power2.inOut',
      onComplete: () => {
        gsap.set(overlay, { visibility: 'hidden' });
        onComplete?.();
      },
    });

    return () => {
      tl.kill();
    };
  }, { dependencies: [isActive] });

  return (
    <div
      ref={overlayRef}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'linear-gradient(135deg, #927867 0%, #7a6455 50%, #6b5548 100%)',
        zIndex: 9999,
        pointerEvents: 'none',
        opacity: 0,
        visibility: 'hidden',
      }}
    />
  );
};

export default PageTransition;