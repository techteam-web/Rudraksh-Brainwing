import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

const HomePage = ({ onExplore }) => {
  const containerRef = useRef(null);
  const cursorRef = useRef(null);
  const cursorDotRef = useRef(null);
  const cursorTrailRef = useRef([]);
  const logoRef = useRef(null);
  const heroTextRef = useRef(null);
  const heroSubRef = useRef(null);
  const taglineRef = useRef(null);
  const cardRef = useRef(null);
  const leftCardRef = useRef(null);
  const rightCardRef = useRef(null);
  const leftButtonRef = useRef(null);
  const rightButtonRef = useRef(null);
  const leftButtonGlowRef = useRef(null);
  const rightButtonGlowRef = useRef(null);
  const orbsRef = useRef([]);
  const particlesRef = useRef([]);
  const loadingRef = useRef(null);
  const loadingTextRef = useRef(null);
  const loadingProgressRef = useRef(null);
  const glowOrbRef = useRef(null);
  const soundControlsRef = useRef(null);
  const auraBurstRef = useRef(null);

  const [isMuted, setIsMuted] = useState(false);
  const [loadingPercent, setLoadingPercent] = useState(0);

  const colors = {
    bg: "#927867",
    textPrimary: "#f5f0eb",
    textSecondary: "#e8e0d8",
    textAccent: "#ffffff",
    glowPrimary: "rgba(245, 240, 235, 0.3)",
    glowSecondary: "rgba(212, 165, 116, 0.25)",
  };

  // Custom cursor trail
  useEffect(() => {
    const trail = [];
    for (let i = 0; i < 5; i++) {
      const dot = document.createElement("div");
      dot.style.cssText = `position:fixed;width:${6 - i}px;height:${
        6 - i
      }px;background:${
        colors.textPrimary
      };border-radius:50%;pointer-events:none;z-index:9998;opacity:${
        0.4 - i * 0.07
      };will-change:transform;transform:translate(-50%,-50%);`;
      document.body.appendChild(dot);
      trail.push(dot);
    }
    cursorTrailRef.current = trail;
    return () => trail.forEach((dot) => dot.remove());
  }, []);

  // Cursor animation
  useEffect(() => {
    let mouseX = 0,
      mouseY = 0,
      cursorX = 0,
      cursorY = 0,
      dotX = 0,
      dotY = 0;
    const trailPositions = cursorTrailRef.current.map(() => ({ x: 0, y: 0 }));
    let animationId;

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const animate = () => {
      cursorX += (mouseX - cursorX) * 0.15;
      cursorY += (mouseY - cursorY) * 0.15;
      dotX += (mouseX - dotX) * 0.35;
      dotY += (mouseY - dotY) * 0.35;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${cursorX - 24}px, ${
          cursorY - 24
        }px)`;
      }
      if (cursorDotRef.current) {
        cursorDotRef.current.style.transform = `translate(${dotX - 6}px, ${
          dotY - 6
        }px)`;
      }

      trailPositions.forEach((pos, i) => {
        const target =
          i === 0 ? { x: mouseX, y: mouseY } : trailPositions[i - 1];
        pos.x += (target.x - pos.x) * (0.35 - i * 0.05);
        pos.y += (target.y - pos.y) * (0.35 - i * 0.05);
        if (cursorTrailRef.current[i]) {
          cursorTrailRef.current[i].style.transform = `translate(${
            pos.x - 3
          }px, ${pos.y - 3}px)`;
        }
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, []);

  // Set initial states immediately on mount (before loading completes)
  useEffect(() => {
    // Hide all elements immediately so they don't flash
    gsap.set(logoRef.current, { opacity: 0, x: -80 });
    gsap.set(soundControlsRef.current, { opacity: 0, x: -50 });
    gsap.set(cardRef.current, { opacity: 0, scale: 0.9, y: 50 });
    gsap.set(heroTextRef.current, { opacity: 0, y: 30 });
    gsap.set(heroSubRef.current, { opacity: 0, y: 30 });
    gsap.set(taglineRef.current, { opacity: 0, y: 20 });
    gsap.set(leftCardRef.current, { opacity: 0, x: -30, y: 20 });
    gsap.set(rightCardRef.current, { opacity: 0, x: 30, y: 20 });
    gsap.set(leftButtonRef.current, { opacity: 0, scale: 0.8 });
    gsap.set(rightButtonRef.current, { opacity: 0, scale: 0.8 });
    gsap.set(leftButtonGlowRef.current, { opacity: 0 });
    gsap.set(rightButtonGlowRef.current, { opacity: 0 });
    gsap.set(glowOrbRef.current, { opacity: 0, scale: 0.8 });
    gsap.set(auraBurstRef.current, { scale: 0, opacity: 0 });
    orbsRef.current.forEach((orb) => {
      if (orb) gsap.set(orb, { opacity: 0, scale: 0 });
    });
    particlesRef.current.forEach((particle) => {
      if (particle) gsap.set(particle, { opacity: 0 });
    });
  }, []);

  // Loading animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      const loadingTl = gsap.timeline({
        onComplete: () => startRevealAnimation(),
      });
      gsap.to(
        {},
        {
          duration: 2,
          onUpdate: function () {
            setLoadingPercent(Math.round(this.progress() * 100));
          },
        }
      );
      loadingTl
        .to(loadingTextRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power3.out",
        })
        .to(
          loadingProgressRef.current,
          { scaleX: 1, duration: 2, ease: "power2.inOut" },
          0.2
        )
        .to(loadingTextRef.current, { opacity: 0, y: -30, duration: 0.4 }, 2)
        .to(
          loadingRef.current,
          {
            clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)",
            duration: 1,
            ease: "power4.inOut",
          },
          2.2
        );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const startRevealAnimation = () => {
    const masterTl = gsap.timeline();

    // Aura burst
    masterTl.to(
      auraBurstRef.current,
      { scale: 3, opacity: 0.8, duration: 0.1, ease: "none" },
      0
    );
    masterTl.to(
      auraBurstRef.current,
      { scale: 3, opacity: 0, duration: 1.4, ease: "power2.out" },
      0.1
    );

    // Animate elements in using .to() since initial states are already set
    masterTl.to(
      logoRef.current,
      { opacity: 1, x: 0, duration: 1, ease: "power3.out" },
      0.2
    );
    masterTl.to(
      soundControlsRef.current,
      { opacity: 1, x: 0, duration: 0.6, ease: "power3.out" },
      0.5
    );
    masterTl.to(
      cardRef.current,
      { opacity: 1, scale: 1, y: 0, duration: 1.2, ease: "power3.out" },
      0.4
    );
    masterTl.to(
      heroTextRef.current,
      { opacity: 1, y: 0, duration: 1, ease: "power3.out" },
      0.8
    );
    masterTl.to(
      heroSubRef.current,
      { opacity: 1, y: 0, duration: 1, ease: "power3.out" },
      1.0
    );
    masterTl.to(
      taglineRef.current,
      { opacity: 1, y: 0, duration: 1, ease: "power3.out" },
      1.2
    );
    
    // Animate BHK cards
    masterTl.to(
      leftCardRef.current,
      { opacity: 1, x: 0, y: 0, duration: 0.8, ease: "power3.out" },
      1.3
    );
    masterTl.to(
      rightCardRef.current,
      { opacity: 1, x: 0, y: 0, duration: 0.8, ease: "power3.out" },
      1.4
    );
    
    // Animate buttons
    masterTl.to(
      leftButtonRef.current,
      { opacity: 1, scale: 1, duration: 0.6, ease: "elastic.out(1, 0.7)" },
      1.6
    );
    masterTl.to(
      rightButtonRef.current,
      { opacity: 1, scale: 1, duration: 0.6, ease: "elastic.out(1, 0.7)" },
      1.7
    );
    masterTl.to(leftButtonGlowRef.current, { opacity: 0.6, duration: 0.6 }, 1.8);
    masterTl.to(rightButtonGlowRef.current, { opacity: 0.6, duration: 0.6 }, 1.9);
    
    masterTl.to(
      glowOrbRef.current,
      { opacity: 0.4, scale: 1, duration: 2, ease: "power2.out" },
      0.5
    );

    // Orbs and particles
    orbsRef.current.forEach((orb, i) => {
      if (orb) {
        masterTl.to(
          orb,
          {
            opacity: 0.3,
            scale: 1,
            duration: 1.2,
            ease: "elastic.out(1, 0.5)",
          },
          0.6 + i * 0.15
        );
      }
    });

    particlesRef.current.forEach((particle, i) => {
      if (particle) {
        masterTl.to(particle, { opacity: 0.5, duration: 1.5 }, 1 + i * 0.03);
      }
    });

    startContinuousAnimations();
  };

  const startContinuousAnimations = () => {
    // Button glow animations
    gsap.to(leftButtonGlowRef.current, {
      scale: 1.5,
      opacity: 0.3,
      duration: 2,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
    });
    gsap.to(rightButtonGlowRef.current, {
      scale: 1.5,
      opacity: 0.3,
      duration: 2,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
      delay: 0.5,
    });
    
    gsap.to(glowOrbRef.current, {
      scale: 1.2,
      opacity: 0.3,
      duration: 4,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
    });

    orbsRef.current.forEach((orb, i) => {
      if (orb)
        gsap.to(orb, {
          y: "+=" + (20 + i * 10),
          rotation: 360,
          duration: 12 + i * 3,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
        });
    });

    particlesRef.current.forEach((particle) => {
      if (particle) {
        gsap.set(particle, {
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
        });
        gsap.to(particle, {
          y: "-=" + (80 + Math.random() * 100),
          duration: 15 + Math.random() * 10,
          repeat: -1,
          ease: "none",
          onRepeat: () =>
            gsap.set(particle, {
              y: window.innerHeight + 50,
              x: Math.random() * window.innerWidth,
            }),
        });
        gsap.to(particle, {
          opacity: Math.random() * 0.4 + 0.1,
          duration: 3 + Math.random() * 2,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
        });
      }
    });
  };

  const handleButtonEnter = (buttonRef, glowRef) => {
    gsap.to(buttonRef.current, {
      scale: 1.05,
      duration: 0.3,
      ease: "power2.out",
    });
    gsap.to(glowRef.current, { scale: 2, opacity: 0.8, duration: 0.3 });
  };

  const handleButtonLeave = (buttonRef, glowRef) => {
    gsap.to(buttonRef.current, { scale: 1, duration: 0.3, ease: "power2.out" });
    gsap.to(glowRef.current, { scale: 1, opacity: 0.6, duration: 0.3 });
  };

  const handleButtonClick = (bhkType) => {
    const buttonRef = bhkType === '4bhk' ? leftButtonRef : rightButtonRef;
    gsap.to(buttonRef.current, {
      scale: 1.1,
      duration: 0.15,
      ease: "power2.out",
      onComplete: () => {
        onExplore && onExplore(bhkType);
      },
    });
  };

  const addToOrbs = (el) => {
    if (el && !orbsRef.current.includes(el)) orbsRef.current.push(el);
  };
  const addToParticles = (el) => {
    if (el && !particlesRef.current.includes(el)) particlesRef.current.push(el);
  };

  return (
    <div
      ref={containerRef}
      className="h-screen max-h-screen relative overflow-hidden"
      style={{ background: colors.bg, cursor: "none" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Marcellus&display=swap');
        .card-shine { background: linear-gradient(125deg, transparent 30%, rgba(255,255,255,0.05) 45%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 55%, transparent 70%); background-size: 300% 300%; animation: cardShine 6s ease-in-out infinite; }
        @keyframes cardShine { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
        .bhk-card { transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .bhk-card:hover { transform: translateY(-4px); box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2); }
      `}</style>

      {/* Custom Cursor (desktop only) */}
      <div
        ref={cursorRef}
        className="fixed w-12 h-12 rounded-full hidden md:block"
        style={{
          zIndex: 9999,
          border: `2px solid ${colors.textPrimary}`,
          pointerEvents: "none",
          boxShadow: `0 0 20px ${colors.glowPrimary}`,
          top: 0,
          left: 0,
        }}
      />
      <div
        ref={cursorDotRef}
        className="fixed w-3 h-3 rounded-full hidden md:block"
        style={{
          zIndex: 9999,
          pointerEvents: "none",
          backgroundColor: colors.textPrimary,
          boxShadow: `0 0 10px ${colors.textPrimary}`,
          top: 0,
          left: 0,
        }}
      />

      {/* Loading Screen */}
      <div
        ref={loadingRef}
        className="fixed inset-0 flex flex-col items-center justify-center"
        style={{
          zIndex: 100,
          background: colors.bg,
          clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
        }}
      >
        <div className="relative">
          <div
            ref={loadingTextRef}
            className="text-2xl sm:text-3xl md:text-5xl font-light tracking-[0.4em] sm:tracking-[0.6em] uppercase mb-6 sm:mb-8"
            style={{
              fontFamily: "'Cinzel', serif",
              color: colors.textPrimary,
              opacity: 0,
              transform: "translateY(20px)",
            }}
          >
            Rudraksh
          </div>
          <div
            className="relative w-48 sm:w-64 h-1 rounded-full overflow-hidden"
            style={{ backgroundColor: "rgba(245, 240, 235, 0.2)" }}
          >
            <div
              ref={loadingProgressRef}
              className="absolute inset-y-0 left-0 w-full rounded-full origin-left"
              style={{
                transform: "scaleX(0)",
                background: `linear-gradient(90deg, ${colors.textSecondary}, ${colors.textPrimary}, ${colors.textAccent}, ${colors.textPrimary})`,
                boxShadow: `0 0 20px ${colors.textPrimary}`,
              }}
            />
          </div>
          <div
            className="text-center mt-3 sm:mt-4 text-xs sm:text-sm tracking-[0.3em]"
            style={{
              color: colors.textSecondary,
              fontFamily: "'Marcellus', serif",
            }}
          >
            {loadingPercent}%
          </div>
        </div>
      </div>

      {/* Aura Burst Effect */}
      <div
        ref={auraBurstRef}
        className="fixed w-[100px] h-[100px] rounded-full"
        style={{
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%) scale(0)",
          background: `radial-gradient(circle, ${colors.textPrimary} 0%, transparent 70%)`,
          pointerEvents: "none",
          zIndex: 90,
          opacity: 0,
        }}
      />

      {/* Background Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          ref={glowOrbRef}
          className="absolute w-[300px] sm:w-[450px] md:w-[600px] h-[300px] sm:h-[450px] md:h-[600px] rounded-full"
          style={{
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%) scale(0.8)",
            background:
              "radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, rgba(245, 240, 235, 0.05) 40%, transparent 70%)",
            filter: "blur(50px)",
            opacity: 0,
          }}
        />
      </div>

      {/* Floating Orbs */}
      <div
        className="fixed inset-0 overflow-hidden pointer-events-none"
        style={{ zIndex: 2 }}
      >
        {[...Array(4)].map((_, i) => (
          <div
            key={`orb-${i}`}
            ref={addToOrbs}
            className="absolute rounded-full"
            style={{
              width: `${80 + i * 40}px`,
              height: `${80 + i * 40}px`,
              left: `${10 + i * 20}%`,
              top: `${15 + i * 15}%`,
              background: `radial-gradient(circle, rgba(245, 240, 235, ${
                0.06 - i * 0.01
              }) 0%, rgba(255, 255, 255, ${
                0.03 - i * 0.005
              }) 50%, transparent 70%)`,
              filter: "blur(30px)",
              opacity: 0,
              transform: "scale(0)",
            }}
          />
        ))}
      </div>

      {/* Particles */}
      <div
        className="fixed inset-0 overflow-hidden pointer-events-none hidden sm:block"
        style={{ zIndex: 3 }}
      >
        {[...Array(15)].map((_, i) => (
          <div
            key={`p-${i}`}
            ref={addToParticles}
            className="absolute rounded-full"
            style={{
              width: `${2 + Math.random() * 3}px`,
              height: `${2 + Math.random() * 3}px`,
              backgroundColor:
                i % 2 === 0 ? colors.textPrimary : colors.textSecondary,
              opacity: 0,
            }}
          />
        ))}
      </div>

      {/* Main Layout */}
      <div
        className="relative h-full flex flex-col"
        style={{ zIndex: 10 }}
      >
        {/* Header */}
        <header className="flex-shrink-0 flex justify-between items-center px-4 sm:px-8 md:px-16 py-2 sm:py-3 md:py-4">
          <div
            ref={logoRef}
            className="flex items-center gap-2 sm:gap-3 md:gap-4"
            style={{ opacity: 0 }}
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14">
              <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke={colors.textPrimary}
                  strokeWidth="0.5"
                  opacity="0.4"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="22"
                  stroke={colors.textPrimary}
                  strokeWidth="0.3"
                  opacity="0.3"
                />
                <path
                  d="M32 4C32 4 18 14 18 32C18 50 32 60 32 60"
                  stroke={colors.textPrimary}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  d="M32 4C32 4 46 14 46 32C46 50 32 60 32 60"
                  stroke={colors.textPrimary}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  fill="none"
                />
                <circle cx="32" cy="4" r="3" fill={colors.textPrimary} />
                <circle cx="32" cy="60" r="3" fill={colors.textPrimary} />
                <circle
                  cx="32"
                  cy="32"
                  r="4"
                  fill={colors.textAccent}
                  opacity="0.9"
                />
              </svg>
            </div>
            <div className="flex flex-col">
              <span
                className="text-sm sm:text-base md:text-lg lg:text-xl font-medium uppercase tracking-[0.2em] sm:tracking-[0.3em]"
                style={{
                  fontFamily: "'Cinzel', serif",
                  color: colors.textPrimary,
                }}
              >
                Rudraksh
              </span>
              <span
                className="text-[7px] sm:text-[8px] md:text-[9px] lg:text-[10px] uppercase tracking-[0.3em] sm:tracking-[0.4em]"
                style={{
                  fontFamily: "'Marcellus', serif",
                  color: colors.textSecondary,
                }}
              >
                Apartments
              </span>
            </div>
          </div>
        </header>

        {/* Main Content - Card centered here */}
        <main className="flex-1 min-h-0 flex items-center justify-center px-4 sm:px-8 md:px-16">
          {/* THE CARD */}
          <div
            ref={cardRef}
            className="w-full max-w-5xl xl:max-w-6xl rounded-2xl relative"
            style={{
              opacity: 0,
              background: "rgba(125, 102, 88, 0.5)",
              border: "1px solid rgba(245, 240, 235, 0.15)",
              boxShadow: "0 25px 70px rgba(0, 0, 0, 0.15)",
            }}
          >
            {/* Shine effect overlay */}
            <div className="absolute inset-0 card-shine rounded-2xl pointer-events-none" />

            {/* Card Content */}
            <div className="relative px-4 sm:px-8 md:px-12 lg:px-16 py-6 sm:py-8 md:py-10 text-center">
              {/* Top decorative element */}
              <div className="flex justify-center mb-3 sm:mb-4">
                <svg
                  viewBox="0 0 150 40"
                  fill="none"
                  className="w-24 h-6 sm:w-32 sm:h-8 md:w-36 md:h-9"
                >
                  <path
                    d="M0,20 Q37.5,5 75,20 Q112.5,35 150,20"
                    stroke={colors.textPrimary}
                    strokeWidth="0.5"
                    fill="none"
                    opacity="0.4"
                  />
                  <circle
                    cx="75"
                    cy="20"
                    r="4"
                    fill="none"
                    stroke={colors.textPrimary}
                    strokeWidth="0.5"
                    opacity="0.3"
                  />
                  <circle
                    cx="75"
                    cy="20"
                    r="2"
                    fill={colors.textAccent}
                    opacity="0.5"
                  />
                </svg>
              </div>

              {/* Rudraksh Icon */}
              <div className="flex justify-center mb-3 sm:mb-4">
                <svg
                  viewBox="0 0 56 56"
                  fill="none"
                  className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12"
                >
                  <path
                    d="M28 2C28 2 14 12 14 28C14 44 28 54 28 54"
                    stroke={colors.textPrimary}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <path
                    d="M28 2C28 2 42 12 42 28C42 44 28 54 28 54"
                    stroke={colors.textPrimary}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <circle cx="28" cy="2" r="2.5" fill={colors.textPrimary} />
                  <circle cx="28" cy="54" r="2.5" fill={colors.textPrimary} />
                  <circle
                    cx="28"
                    cy="28"
                    r="4"
                    fill={colors.textAccent}
                    opacity="0.9"
                  />
                </svg>
              </div>

              {/* Main Title */}
              <h1
                ref={heroTextRef}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light mb-2 sm:mb-3"
                style={{
                  fontFamily: "'Cinzel', serif",
                  letterSpacing: "0.08em",
                  lineHeight: 1.1,
                  color: colors.textPrimary,
                  opacity: 0,
                }}
              >
                RUDRAKSH
              </h1>

              {/* Apartments Subtitle */}
              <div
                ref={heroSubRef}
                className="flex items-center justify-center gap-3 sm:gap-4 md:gap-6 mb-2 sm:mb-3"
                style={{ opacity: 0 }}
              >
                <span
                  className="w-10 sm:w-14 md:w-20 h-px"
                  style={{
                    background: `linear-gradient(to right, transparent, ${colors.textPrimary})`,
                  }}
                />
                <span
                  className="text-xs sm:text-sm md:text-base lg:text-lg uppercase tracking-[0.25em] sm:tracking-[0.3em] md:tracking-[0.4em]"
                  style={{
                    fontFamily: "'Marcellus', serif",
                    color: colors.textSecondary,
                  }}
                >
                  Apartments
                </span>
                <span
                  className="w-10 sm:w-14 md:w-20 h-px"
                  style={{
                    background: `linear-gradient(to left, transparent, ${colors.textPrimary})`,
                  }}
                />
              </div>

              {/* Tagline */}
              <p
                ref={taglineRef}
                className="text-sm sm:text-base md:text-lg lg:text-xl italic mb-6 sm:mb-8"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  color: colors.textPrimary,
                  fontWeight: 300,
                  opacity: 0,
                }}
              >
                Between stillness & city
              </p>

              {/* Two BHK Options Side by Side */}
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 md:gap-8 justify-center items-stretch">
                
                {/* 4 BHK Card - Left */}
                <div
                  ref={leftCardRef}
                  className="bhk-card flex-1 max-w-xs sm:max-w-sm rounded-xl p-4 sm:p-6 md:p-8"
                  style={{
                    opacity: 0,
                    background: "rgba(245, 240, 235, 0.08)",
                    border: "1px solid rgba(245, 240, 235, 0.2)",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  {/* BHK Title */}
                  <div className="mb-4">
                    <h3
                      className="text-2xl sm:text-3xl md:text-4xl font-light"
                      style={{
                        fontFamily: "'Cinzel', serif",
                        color: colors.textPrimary,
                      }}
                    >
                      4 BHK
                    </h3>
                    <p
                      className="text-[10px] sm:text-xs uppercase tracking-[0.2em] mt-1"
                      style={{
                        fontFamily: "'Marcellus', serif",
                        color: colors.textSecondary,
                      }}
                    >
                      101-801
                    </p>
                  </div>

                  {/* Area Details */}
                  <div className="mb-6">
                    <p
                      className="text-[10px] sm:text-xs uppercase tracking-[0.15em] mb-2"
                      style={{
                        fontFamily: "'Marcellus', serif",
                        color: colors.textSecondary,
                      }}
                    >
                      Area
                    </p>
                    <p
                      className="text-xl sm:text-2xl md:text-3xl font-light"
                      style={{
                        fontFamily: "'Cinzel', serif",
                        color: colors.textPrimary,
                      }}
                    >
                      3912
                      <span
                        className="text-sm sm:text-base ml-1"
                        style={{ color: colors.textSecondary }}
                      >
                        Sq. Ft.
                      </span>
                    </p>
                  </div>

                  {/* Button */}
                  <div className="relative inline-block w-full">
                    <div
                      ref={leftButtonGlowRef}
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: `radial-gradient(circle, ${colors.glowPrimary} 0%, ${colors.glowSecondary} 50%, transparent 70%)`,
                        filter: "blur(20px)",
                        transform: "scale(1.3)",
                        pointerEvents: "none",
                        opacity: 0,
                      }}
                    />
                    <button
                      ref={leftButtonRef}
                      type="button"
                      onClick={() => handleButtonClick('4bhk')}
                      onMouseEnter={() => handleButtonEnter(leftButtonRef, leftButtonGlowRef)}
                      onMouseLeave={() => handleButtonLeave(leftButtonRef, leftButtonGlowRef)}
                      className="relative w-full px-4 sm:px-6 py-3 sm:py-4 rounded-full overflow-hidden group"
                      style={{
                        background: "rgba(245, 240, 235, 0.15)",
                        border: "1px solid rgba(245, 240, 235, 0.3)",
                        backdropFilter: "blur(10px)",
                        boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
                        opacity: 0,
                        cursor: "pointer",
                      }}
                    >
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        style={{
                          background:
                            "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.15) 50%, transparent 60%)",
                        }}
                      />
                      <span
                        className="text-[10px] sm:text-xs uppercase tracking-[0.15em] sm:tracking-[0.2em] relative whitespace-nowrap"
                        style={{
                          fontFamily: "'Marcellus', serif",
                          color: colors.textPrimary,
                        }}
                      >
                        Explore 4 BHK
                      </span>
                    </button>
                  </div>
                </div>

                {/* Divider - visible on larger screens */}
                <div 
                  className="hidden sm:block w-px self-stretch"
                  style={{
                    background: `linear-gradient(to bottom, transparent, ${colors.textPrimary}40, transparent)`,
                  }}
                />

                {/* 3 BHK Card - Right */}
                <div
                  ref={rightCardRef}
                  className="bhk-card flex-1 max-w-xs sm:max-w-sm rounded-xl p-4 sm:p-6 md:p-8"
                  style={{
                    opacity: 0,
                    background: "rgba(245, 240, 235, 0.08)",
                    border: "1px solid rgba(245, 240, 235, 0.2)",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  {/* BHK Title */}
                  <div className="mb-4">
                    <h3
                      className="text-2xl sm:text-3xl md:text-4xl font-light"
                      style={{
                        fontFamily: "'Cinzel', serif",
                        color: colors.textPrimary,
                      }}
                    >
                      3 BHK
                    </h3>
                    <p
                      className="text-[10px] sm:text-xs uppercase tracking-[0.2em] mt-1"
                      style={{
                        fontFamily: "'Marcellus', serif",
                        color: colors.textSecondary,
                      }}
                    >
                      102-802
                    </p>
                  </div>

                  {/* Area Details */}
                  <div className="mb-6">
                    <p
                      className="text-[10px] sm:text-xs uppercase tracking-[0.15em] mb-2"
                      style={{
                        fontFamily: "'Marcellus', serif",
                        color: colors.textSecondary,
                      }}
                    >
                      Area
                    </p>
                    <p
                      className="text-xl sm:text-2xl md:text-3xl font-light"
                      style={{
                        fontFamily: "'Cinzel', serif",
                        color: colors.textPrimary,
                      }}
                    >
                      2856
                      <span
                        className="text-sm sm:text-base ml-1"
                        style={{ color: colors.textSecondary }}
                      >
                        Sq. Ft.
                      </span>
                    </p>
                  </div>

                  {/* Button */}
                  <div className="relative inline-block w-full">
                    <div
                      ref={rightButtonGlowRef}
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: `radial-gradient(circle, ${colors.glowPrimary} 0%, ${colors.glowSecondary} 50%, transparent 70%)`,
                        filter: "blur(20px)",
                        transform: "scale(1.3)",
                        pointerEvents: "none",
                        opacity: 0,
                      }}
                    />
                    <button
                      ref={rightButtonRef}
                      type="button"
                      onClick={() => handleButtonClick('3bhk')}
                      onMouseEnter={() => handleButtonEnter(rightButtonRef, rightButtonGlowRef)}
                      onMouseLeave={() => handleButtonLeave(rightButtonRef, rightButtonGlowRef)}
                      className="relative w-full px-4 sm:px-6 py-3 sm:py-4 rounded-full overflow-hidden group"
                      style={{
                        background: "rgba(245, 240, 235, 0.15)",
                        border: "1px solid rgba(245, 240, 235, 0.3)",
                        backdropFilter: "blur(10px)",
                        boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
                        opacity: 0,
                        cursor: "pointer",
                      }}
                    >
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        style={{
                          background:
                            "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.15) 50%, transparent 60%)",
                        }}
                      />
                      <span
                        className="text-[10px] sm:text-xs uppercase tracking-[0.15em] sm:tracking-[0.2em] relative whitespace-nowrap"
                        style={{
                          fontFamily: "'Marcellus', serif",
                          color: colors.textPrimary,
                        }}
                      >
                        Explore 3 BHK
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Bottom decorative element */}
              <div className="flex justify-center mt-6 sm:mt-8">
                <svg
                  viewBox="0 0 150 30"
                  fill="none"
                  className="w-28 h-6 sm:w-36 sm:h-7 md:w-40 md:h-8"
                >
                  <path
                    d="M0,15 L55,15"
                    stroke={colors.textPrimary}
                    strokeWidth="0.5"
                    opacity="0.3"
                  />
                  <path
                    d="M95,15 L150,15"
                    stroke={colors.textPrimary}
                    strokeWidth="0.5"
                    opacity="0.3"
                  />
                  <polygon
                    points="75,5 85,15 75,25 65,15"
                    stroke={colors.textPrimary}
                    strokeWidth="0.5"
                    fill="none"
                    opacity="0.3"
                  />
                  <circle
                    cx="75"
                    cy="15"
                    r="2"
                    fill={colors.textPrimary}
                    opacity="0.4"
                  />
                </svg>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="flex-shrink-0 flex items-center px-4 sm:px-8 md:px-16 py-2 sm:py-3 md:py-4">
          <div
            ref={soundControlsRef}
            className="flex items-center gap-2 sm:gap-3"
            style={{ opacity: 0 }}
          >
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 flex items-center justify-center rounded-full transition-all duration-300 hover:scale-110 group relative"
              style={{
                backgroundColor: "rgba(245, 240, 235, 0.1)",
                border: "1px solid rgba(245, 240, 235, 0.2)",
                backdropFilter: "blur(10px)",
              }}
            >
              <div
                className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                style={{
                  background: `radial-gradient(circle, ${colors.glowPrimary} 0%, transparent 70%)`,
                }}
              />
              {isMuted ? (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 relative"
                  stroke={colors.textSecondary}
                  strokeWidth="1.5"
                >
                  <path d="M11 5L6 9H2v6h4l5 4V5z" />
                  <line x1="23" y1="9" x2="17" y2="15" />
                  <line x1="17" y1="9" x2="23" y2="15" />
                </svg>
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 relative"
                  stroke={colors.textSecondary}
                  strokeWidth="1.5"
                >
                  <path d="M11 5L6 9H2v6h4l5 4V5z" />
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                </svg>
              )}
            </button>
            <span
              className="text-[7px] sm:text-[8px] md:text-[9px] uppercase tracking-[0.15em] sm:tracking-[0.2em]"
              style={{
                fontFamily: "'Marcellus', serif",
                color: colors.textSecondary,
              }}
            >
              {isMuted ? "Unmute" : "Sound"}
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default HomePage;