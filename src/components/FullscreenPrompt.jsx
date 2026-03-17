import React, { useRef, useCallback, useEffect } from 'react';
import { gsap } from 'gsap';

// Returns true for iPhone, iPod, and iPad (including iPad Pro which reports as Mac)
const isIOSDevice = () => {
  if (/iPhone|iPod/i.test(navigator.userAgent)) return true;
  if (/iPad/i.test(navigator.userAgent)) return true;
  // iPad Pro on iOS 13+ reports as "Macintosh" in UA but has multi-touch (real Macs don't)
  if (/Macintosh/i.test(navigator.userAgent) && navigator.maxTouchPoints > 1) return true;
  return false;
};

const FullscreenPrompt = () => {
  // iOS devices don't support the Fullscreen API — skip the prompt entirely
  if (isIOSDevice()) return null;
  const overlayRef = useRef(null);
  const contentRef = useRef(null);
  const isAnimating = useRef(false);
  const isVisible = useRef(!document.fullscreenElement);

  // ── Show the overlay (slide down into view) ──
  const showOverlay = useCallback(() => {
    if (isAnimating.current || isVisible.current) return;
    isVisible.current = true;
    isAnimating.current = true;

    const overlay = overlayRef.current;
    const content = contentRef.current;
    if (!overlay || !content) return;

    overlay.style.pointerEvents = 'auto';
    gsap.set(overlay, { yPercent: -100 });
    gsap.set(content, { opacity: 0, y: -30 });

    const tl = gsap.timeline({
      onComplete: () => { isAnimating.current = false; },
    });

    tl.to(overlay, {
      yPercent: 0,
      duration: 0.5,
      ease: 'power3.out',
    }).to(content, {
      opacity: 1,
      y: 0,
      duration: 0.35,
      ease: 'power2.out',
    }, '-=0.15');
  }, []);

  // ── Hide the overlay (slide up out of view) ──
  const hideOverlay = useCallback(() => {
    if (isAnimating.current || !isVisible.current) return;
    isVisible.current = false;
    isAnimating.current = true;

    const overlay = overlayRef.current;
    const content = contentRef.current;
    if (!overlay || !content) return;

    const tl = gsap.timeline({
      onComplete: () => {
        isAnimating.current = false;
        if (overlay) overlay.style.pointerEvents = 'none';
      },
    });

    tl.to(content, {
      opacity: 0,
      y: -30,
      duration: 0.3,
      ease: 'power2.in',
    }).to(overlay, {
      yPercent: -100,
      duration: 0.6,
      ease: 'power3.inOut',
    });
  }, []);

  // ── Listen for fullscreen changes ──
  useEffect(() => {
    const onFSChange = () => {
      if (document.fullscreenElement) {
        hideOverlay();
      } else {
        showOverlay();
      }
    };

    // Intercept F11: prevent browser-native fullscreen, use API instead
    const onKeyDown = (e) => {
      if (e.key === 'F11') {
        e.preventDefault();
        if (document.fullscreenElement) {
          document.exitFullscreen().catch(() => {});
        } else {
          document.documentElement.requestFullscreen().catch(() => {});
        }
        // fullscreenchange event will handle show/hide
      }
    };

    document.addEventListener('fullscreenchange', onFSChange);
    document.addEventListener('webkitfullscreenchange', onFSChange);
    document.addEventListener('keydown', onKeyDown);

    // Set initial state without animation
    if (document.fullscreenElement) {
      gsap.set(overlayRef.current, { yPercent: -100 });
      if (overlayRef.current) overlayRef.current.style.pointerEvents = 'none';
      isVisible.current = false;
    }

    return () => {
      document.removeEventListener('fullscreenchange', onFSChange);
      document.removeEventListener('webkitfullscreenchange', onFSChange);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [hideOverlay, showOverlay]);

  // ── Request fullscreen on click ──
  const handleClick = useCallback(async () => {
    if (isAnimating.current) return;

    const el = document.documentElement;
    try {
      if (el.requestFullscreen) await el.requestFullscreen();
      else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
      else if (el.msRequestFullscreen) el.msRequestFullscreen();
      // fullscreenchange event will trigger hideOverlay automatically
    } catch {
      // Fullscreen request rejected — overlay stays visible
    }
  }, []);

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
