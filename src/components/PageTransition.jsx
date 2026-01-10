import React, { useRef, useImperativeHandle, forwardRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';

const PageTransition = forwardRef(({ 
  isActive, 
  onMidpoint, 
  onComplete,
}, ref) => {
  const containerRef = useRef(null);
  const panelsRef = useRef([]);
  const timelineRef = useRef(null);
  const hasCalledMidpoint = useRef(false);

  // Reset panels to initial state
  const resetPanels = () => {
    panelsRef.current.forEach(panel => {
      if (panel) {
        gsap.set(panel, { 
          x: '-120%', 
          opacity: 0,
          immediateRender: true 
        });
      }
    });
  };

  // Cleanup function
  const cleanup = () => {
    if (timelineRef.current) {
      timelineRef.current.kill();
      timelineRef.current = null;
    }
    resetPanels();
    hasCalledMidpoint.current = false;
  };

  useLayoutEffect(() => {
    // Always cleanup first
    cleanup();

    if (!isActive) return;

    const panels = panelsRef.current.filter(Boolean);
    if (panels.length === 0) return;

    // Small delay to ensure DOM is ready
    const startAnimation = () => {
      hasCalledMidpoint.current = false;

      const tl = gsap.timeline({
        onComplete: () => {
          cleanup();
          onComplete?.();
        }
      });

      // Set initial state
      tl.set(panels, { 
        x: '-120%', 
        opacity: 1,
        force3D: true,
      });

      // Animate in
      tl.to(panels, {
        x: '0%',
        duration: 0.6,
        stagger: 0.05,
        ease: 'power2.inOut',
      });

      // Call midpoint
      tl.call(() => {
        if (!hasCalledMidpoint.current) {
          hasCalledMidpoint.current = true;
          onMidpoint?.();
        }
      });

      // Hold briefly
      tl.to({}, { duration: 0.1 });

      // Animate out
      tl.to(panels, {
        x: '120%',
        duration: 0.5,
        stagger: 0.04,
        ease: 'power2.inOut',
      });

      timelineRef.current = tl;
    };

    // Use requestAnimationFrame to ensure we're in sync with the browser
    const rafId = requestAnimationFrame(startAnimation);

    return () => {
      cancelAnimationFrame(rafId);
      cleanup();
    };
  }, [isActive, onMidpoint, onComplete]);

  // Expose methods via ref
  useImperativeHandle(ref, () => ({
    kill: cleanup
  }));

  // Always render but hide when not active
  const panels = [
    { bg: '#6b5548' },
    { bg: '#7a6455' },
    { bg: '#927867' },
    { bg: '#a88b78' },
    { bg: '#b99a87' },
  ];

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none"
      style={{ 
        zIndex: 9999, 
        overflow: 'hidden',
        visibility: isActive ? 'visible' : 'hidden',
      }}
    >
      {panels.map((panel, i) => (
        <div
          key={i}
          ref={el => panelsRef.current[i] = el}
          className="absolute will-change-transform"
          style={{
            top: 0,
            left: '-10%',
            width: '120%',
            height: '100%',
            background: panel.bg,
            transform: 'translateX(-120%) skewX(-10deg)',
            opacity: 0,
            backfaceVisibility: 'hidden',
          }}
        />
      ))}
    </div>
  );
});

PageTransition.displayName = 'PageTransition';

export default PageTransition;