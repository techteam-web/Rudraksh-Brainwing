import React, { useState, useRef } from 'react';
import { gsap } from 'gsap';

const FullscreenPrompt = ({ onEnter }) => {
  const [exiting, setExiting] = useState(false);
  const overlayRef = useRef(null);
  const contentRef = useRef(null);

  const handleClick = () => {
    if (exiting) return;
    setExiting(true);

    const el = document.documentElement;
    if (el.requestFullscreen) el.requestFullscreen().catch(() => {});
    else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
    else if (el.msRequestFullscreen) el.msRequestFullscreen();

    const tl = gsap.timeline({
      onComplete: () => onEnter(),
    });

    // Fade out content first, then slide the overlay up
    tl.to(contentRef.current, {
      opacity: 0,
      y: -30,
      duration: 0.3,
      ease: 'power2.in',
    }).to(overlayRef.current, {
      yPercent: -100,
      duration: 0.6,
      ease: 'power3.inOut',
    });
  };

  return (
    <div
      ref={overlayRef}
      onClick={handleClick}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#080808',
        overflow: 'hidden',
      }}
    >
      {/* Subtle warm vignette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at center, rgba(193,165,123,0.03) 0%, transparent 60%)',
          pointerEvents: 'none',
        }}
      />

      {/* Content */}
      <div
        ref={contentRef}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '24px',
        }}
      >
        {/* Fullscreen icon */}
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#c1a57b"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ opacity: 0.7 }}
        >
          <path d="M8 3H5a2 2 0 0 0-2 2v3" />
          <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
          <path d="M3 16v3a2 2 0 0 0 2 2h3" />
          <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
        </svg>

        {/* Title */}
        <h1
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 'clamp(1.2rem, 2.5vw, 1.8rem)',
            fontWeight: 400,
            color: '#e8dcc8',
            letterSpacing: '0.08em',
            margin: 0,
          }}
        >
          Enter Fullscreen
        </h1>

        {/* Divider */}
        <div
          style={{
            width: '40px',
            height: '1px',
            backgroundColor: 'rgba(193,165,123,0.25)',
          }}
        />

        {/* Subtitle */}
        <p
          style={{
            fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
            fontSize: '0.8rem',
            fontWeight: 300,
            color: 'rgba(193,165,123,0.45)',
            letterSpacing: '0.12em',
            margin: 0,
          }}
        >
          Tap anywhere to continue
        </p>
      </div>
    </div>
  );
};

export default FullscreenPrompt;