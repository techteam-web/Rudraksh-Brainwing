import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import PanoramaViewer from "../components/PanoramaViewer";

const MainPage = ({ onClose, onFloorPlanClick, initialRoom }) => {
  const containerRef = useRef(null);
  const cursorRef = useRef(null);
  const cursorDotRef = useRef(null);
  const cursorTrailRef = useRef([]);
  const logoRef = useRef(null);
  const closeRef = useRef(null);
  const imageRef = useRef(null);
  const overlayRef = useRef(null);
  const navRef = useRef(null);
  const navItemsRef = useRef([]);
  const miniMapRef = useRef(null);
  const soundControlsRef = useRef(null);
  const particlesRef = useRef([]);
  const orbsRef = useRef([]);
  const geometricRef = useRef([]);
  const borderLinesRef = useRef([]);
  const roomLabelRef = useRef(null);
  const indicatorRef = useRef(null);
  const ambientLightRef = useRef(null);
  const glowOrbRef = useRef(null);
  const loadingRef = useRef(null);
  const loadingProgressRef = useRef(null);

  const [activeRoom, setActiveRoom] = useState(initialRoom || "Living");
  const [isMuted, setIsMuted] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Match HomePage colors - warm taupe theme
  const colors = {
    bg: '#927867',
    bgLight: '#a08879',
    bgDark: '#7d6658',
    bgDeep: '#6b5848',
    textPrimary: '#f5f0eb',
    textSecondary: '#e8e0d8',
    textMuted: '#d4cac0',
    textAccent: '#ffffff',
    gold: '#d4a574',
    goldLight: '#e8c9a0',
    rose: '#c4a092',
    cardBg: 'rgba(125, 102, 88, 0.6)',
    cardBorder: 'rgba(245, 240, 235, 0.2)',
    glowPrimary: 'rgba(245, 240, 235, 0.3)',
    glowSecondary: 'rgba(212, 165, 116, 0.25)',
    glowTertiary: 'rgba(255, 255, 255, 0.15)',
  };

  const rooms = [
    { id: "Arrival", image: "/arrival.jpg" },
    { id: "Living", image: "/livingroom.jpg" },
    { id: "Kitchen", image: "/kitchen.jpg" },
    { id: "Bedroom", image: "/bedroom.jpg" },
    { id: "Balcony", image: "/balcony.jpg" },
    { id: "Kids Bedroom 1", image: "/marzipano/tiles/0-kids_bedroom_final_01/preview.jpg", is360: true },
    { id: "Kids Bedroom 2", image: "/marzipano/tiles/1-kids_bedroom_final_02/preview.jpg", is360: true },
  ];

  const roomImages = {
    Arrival: "/arrival.jpg",
    Living: "/livingroom.jpg",
    Kitchen: "/kitchen.jpg",
    Bedroom: "/bedroom.jpg",
    Balcony: "/balcony.jpg",
  };

  const panoramaRooms = {
    "Kids Bedroom 1": "kids-bedroom-1",
    "Kids Bedroom 2": "kids-bedroom-2",
  };

  const isPanorama = (roomId) => roomId in panoramaRooms;

  const roomHighlights = {
    Arrival: { x: 17, y: 23 },
    Living: { x: 44, y: 23 },
    Kitchen: { x: 44, y: 57 },
    Bedroom: { x: 68, y: 23 },
    Balcony: { x: 17, y: 57 },
    "Kids Bedroom 1": { x: 88, y: 23 },
    "Kids Bedroom 2": { x: 88, y: 65 },
  };

  // Cursor trail setup - matching HomePage
  useEffect(() => {
    const trail = [];
    for (let i = 0; i < 5; i++) {
      const dot = document.createElement('div');
      dot.style.cssText = 'position:fixed;width:'+(6-i)+'px;height:'+(6-i)+'px;background:'+colors.textPrimary+';border-radius:50%;pointer-events:none;z-index:9998;opacity:'+(0.4-i*0.07)+';will-change:transform;transform:translate(-50%,-50%);';
      document.body.appendChild(dot);
      trail.push(dot);
    }
    cursorTrailRef.current = trail;
    return () => trail.forEach(dot => dot.remove());
  }, []);

  // Optimized cursor movement - matching HomePage
  useEffect(() => {
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let dotX = 0, dotY = 0;
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
        cursorRef.current.style.transform = `translate(${cursorX - 24}px, ${cursorY - 24}px)`;
      }
      if (cursorDotRef.current) {
        cursorDotRef.current.style.transform = `translate(${dotX - 6}px, ${dotY - 6}px)`;
      }

      trailPositions.forEach((pos, i) => {
        const target = i === 0 ? { x: mouseX, y: mouseY } : trailPositions[i-1];
        pos.x += (target.x - pos.x) * (0.35 - i * 0.05);
        pos.y += (target.y - pos.y) * (0.35 - i * 0.05);
        if (cursorTrailRef.current[i]) {
          cursorTrailRef.current[i].style.transform = `translate(${pos.x - 3}px, ${pos.y - 3}px)`;
        }
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const loadingTl = gsap.timeline({
        onComplete: () => {
          setIsLoaded(true);
          startRevealAnimation();
        }
      });
      loadingTl.to(loadingProgressRef.current, { width: '100%', duration: 1.5, ease: 'power2.inOut' })
        .to(loadingRef.current, { yPercent: -100, duration: 1, ease: 'power4.inOut' });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const startRevealAnimation = () => {
    const ctx = gsap.context(() => {
      navItemsRef.current = [];
      const masterTl = gsap.timeline();

      // Image reveal - starts from opacity 0
      masterTl.fromTo(imageRef.current, { scale: 1.1, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.5, ease: 'power3.out' });
      masterTl.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 1 }, '-=1');
      masterTl.to(glowOrbRef.current, { opacity: 0.4, scale: 1, duration: 1.5 }, '-=1');
      masterTl.fromTo(borderLinesRef.current, { scaleX: 0 }, { scaleX: 1, duration: 1, stagger: 0.1, ease: 'power3.inOut' }, '-=1');
      masterTl.fromTo(logoRef.current, { opacity: 0, x: -50 }, { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' }, '-=0.6');
      masterTl.fromTo(closeRef.current, { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(2)' }, '-=0.4');
      masterTl.fromTo(roomLabelRef.current, { opacity: 0 }, { opacity: 0.06, duration: 1 }, '-=0.6');
      if (indicatorRef.current) {
        masterTl.fromTo(indicatorRef.current, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.5 }, '-=0.4');
      }
      masterTl.fromTo(navRef.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.4');
      masterTl.fromTo('.carousel-item', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.05, ease: 'power2.out' }, '-=0.3');
      masterTl.fromTo(miniMapRef.current, { opacity: 0, x: 40 }, { opacity: 1, x: 0, duration: 0.6, ease: 'power3.out' }, '-=0.5');
      masterTl.fromTo(soundControlsRef.current, { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.5, ease: 'power3.out' }, '-=0.4');
      masterTl.fromTo(orbsRef.current, { opacity: 0, scale: 0 }, { opacity: 0.3, scale: 1, duration: 1, stagger: 0.1 }, '-=0.8');
      masterTl.fromTo(geometricRef.current, { opacity: 0, rotation: -90, scale: 0 }, { opacity: 0.15, rotation: 0, scale: 1, duration: 1, stagger: 0.1 }, '-=1');
      masterTl.fromTo(particlesRef.current, { opacity: 0 }, { opacity: 0.5, duration: 1, stagger: 0.02 }, '-=0.8');

      // Continuous animations - simplified
      orbsRef.current.forEach((orb, i) => {
        if (orb) gsap.to(orb, { y: `+=${15 + i * 8}`, duration: 8 + i * 2, yoyo: true, repeat: -1, ease: 'sine.inOut' });
      });
      geometricRef.current.forEach((geo, i) => {
        if (geo) gsap.to(geo, { rotation: i % 2 === 0 ? 360 : -360, duration: 60 + i * 15, repeat: -1, ease: 'none' });
      });
      particlesRef.current.forEach((particle) => {
        if (particle) {
          gsap.set(particle, { x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight });
          gsap.to(particle, { y: `-=${60 + Math.random() * 100}`, duration: 15 + Math.random() * 10, repeat: -1, ease: 'none', onRepeat: () => gsap.set(particle, { y: window.innerHeight + 30, x: Math.random() * window.innerWidth }) });
        }
      });
      gsap.to(glowOrbRef.current, { scale: 1.1, opacity: 0.3, duration: 4, yoyo: true, repeat: -1, ease: 'sine.inOut' });
    }, containerRef);
  };

  // Simplified room change - no heavy transition overlay
  const handleRoomChange = (room) => {
    if (room === activeRoom) return;
    
    // Simple fade transition
    gsap.to(imageRef.current, { 
      opacity: 0, 
      duration: 0.2, 
      ease: 'power2.in',
      onComplete: () => {
        setActiveRoom(room);
        gsap.to(imageRef.current, { opacity: 1, duration: 0.3, ease: 'power2.out' });
      }
    });
    
    // Update room label
    gsap.to(roomLabelRef.current, { opacity: 0, duration: 0.15, onComplete: () => {
      gsap.to(roomLabelRef.current, { opacity: 0.06, duration: 0.3 });
    }});
    
    // Update minimap highlight
    const highlight = roomHighlights[room];
    if (highlight) gsap.to(".minimap-highlight", { left: highlight.x + "%", top: highlight.y + "%", duration: 0.4, ease: "power2.out" });
  };

  const handleCloseEnter = () => {
    gsap.to(closeRef.current, { rotation: 90, scale: 1.1, backgroundColor: 'rgba(245,240,235,0.2)', duration: 0.3 });
  };
  const handleCloseLeave = () => {
    gsap.to(closeRef.current, { rotation: 0, scale: 1, backgroundColor: 'rgba(245,240,235,0.1)', duration: 0.3 });
  };
  const handleCarouselItemEnter = (index) => {
    gsap.to(navItemsRef.current[index], { scale: 1.05, y: -4, duration: 0.2 });
  };
  const handleCarouselItemLeave = (index) => {
    gsap.to(navItemsRef.current[index], { scale: 1, y: 0, duration: 0.2 });
  };
  const handleMiniMapEnter = () => {
    gsap.to(miniMapRef.current, { scale: 1.02, duration: 0.3 });
  };
  const handleMiniMapLeave = () => {
    gsap.to(miniMapRef.current, { scale: 1, duration: 0.3 });
  };

  const addToNavItems = (el) => { if (el && !navItemsRef.current.includes(el)) navItemsRef.current.push(el); };
  const addToParticles = (el) => { if (el && !particlesRef.current.includes(el)) particlesRef.current.push(el); };
  const addToOrbs = (el) => { if (el && !orbsRef.current.includes(el)) orbsRef.current.push(el); };
  const addToGeometric = (el) => { if (el && !geometricRef.current.includes(el)) geometricRef.current.push(el); };
  const addToBorderLines = (el) => { if (el && !borderLinesRef.current.includes(el)) borderLinesRef.current.push(el); };

  const cssStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Marcellus&display=swap');
    .carousel-container { scrollbar-width: none; -ms-overflow-style: none; }
    .carousel-container::-webkit-scrollbar { display: none; }
    .carousel-item { opacity: 0; transform: translateY(20px); }
    .mandala-pattern { background-image: url("data:image/svg+xml,%3Csvg width='200' height='200' viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23f5f0eb' stroke-width='0.5' opacity='0.08'%3E%3Ccircle cx='100' cy='100' r='40'/%3E%3Ccircle cx='100' cy='100' r='60'/%3E%3Ccircle cx='100' cy='100' r='80'/%3E%3Cpath d='M100 20 Q120 100 100 180 Q80 100 100 20'/%3E%3Cpath d='M20 100 Q100 80 180 100 Q100 120 20 100'/%3E%3C/g%3E%3C/svg%3E"); background-size: 200px 200px; }
    .arch-pattern { background-image: url("data:image/svg+xml,%3Csvg width='100' height='150' viewBox='0 0 100 150' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 0 Q0 50 0 100 L0 150 L100 150 L100 100 Q100 50 50 0Z' fill='none' stroke='%23f5f0eb' stroke-width='1' opacity='0.05'/%3E%3C/svg%3E"); background-size: 100px 150px; }
  `;

  return (
    <div ref={containerRef} className="min-h-screen w-full relative overflow-hidden" style={{ background: colors.bg, cursor: 'none' }}>
      <style>{cssStyles}</style>

      {/* Custom Cursor - matching HomePage */}
      <div ref={cursorRef} className="fixed w-12 h-12 rounded-full hidden md:block" style={{ zIndex: 9999, border: '2px solid '+colors.textPrimary, pointerEvents: 'none', boxShadow: '0 0 20px '+colors.glowPrimary, willChange: 'transform', top: 0, left: 0 }} />
      <div ref={cursorDotRef} className="fixed w-3 h-3 rounded-full hidden md:block" style={{ zIndex: 9999, pointerEvents: 'none', backgroundColor: colors.textPrimary, boxShadow: '0 0 10px '+colors.textPrimary, willChange: 'transform', top: 0, left: 0 }} />

      {/* Loading Screen - covers everything including the image */}
      <div ref={loadingRef} className="fixed inset-0 flex flex-col items-center justify-center" style={{ zIndex: 100, background: colors.bg }}>
        <div className="text-xl md:text-2xl font-light tracking-[0.4em] uppercase mb-6" style={{ fontFamily: "'Cinzel', serif", color: colors.textPrimary }}>{activeRoom}</div>
        <div className="w-32 h-px relative overflow-hidden" style={{ backgroundColor: 'rgba(245, 240, 235, 0.2)' }}>
          <div ref={loadingProgressRef} className="absolute inset-y-0 left-0 w-0" style={{ background: 'linear-gradient(90deg, '+colors.textSecondary+', '+colors.textPrimary+', '+colors.textAccent+')' }} />
        </div>
      </div>

      {/* Patterns - matching HomePage */}
      <div className="absolute inset-0 mandala-pattern opacity-30" style={{ zIndex: 0, pointerEvents: 'none' }} />
      <div className="fixed left-0 top-0 w-16 sm:w-24 md:w-32 h-full arch-pattern" style={{ zIndex: 1, pointerEvents: 'none' }} />
      <div className="fixed right-0 top-0 w-16 sm:w-24 md:w-32 h-full arch-pattern" style={{ zIndex: 1, pointerEvents: 'none', transform: 'scaleX(-1)' }} />

      {/* Background Image - STARTS HIDDEN (opacity: 0) to prevent glitch */}
      <div ref={imageRef} className="absolute inset-0" style={{ zIndex: 2, opacity: 0 }}>
        {isPanorama(activeRoom) ? (
          <PanoramaViewer key={activeRoom} sceneId={panoramaRooms[activeRoom]} onHotspotClick={(targetRoom) => handleRoomChange(targetRoom)} />
        ) : roomImages[activeRoom] ? (
          <img src={roomImages[activeRoom]} alt={activeRoom + " view"} className="w-full h-full object-cover" style={{ filter: 'brightness(0.8) saturate(0.95)' }} />
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: colors.bg }}><span style={{ color: colors.textSecondary, opacity: 0.5 }}>Loading...</span></div>
        )}
      </div>

      {/* Gradient Overlay - STARTS HIDDEN */}
      <div ref={overlayRef} className="absolute inset-0 pointer-events-none" style={{ zIndex: 3, opacity: 0, background: 'linear-gradient(180deg, rgba(146, 120, 103, 0.6) 0%, transparent 25%, transparent 75%, rgba(146, 120, 103, 0.7) 100%), linear-gradient(90deg, rgba(146, 120, 103, 0.4) 0%, transparent 20%, transparent 80%, rgba(146, 120, 103, 0.4) 100%)' }} />

      {/* Ambient Light */}
      <div ref={ambientLightRef} className="absolute w-[400px] sm:w-[500px] md:w-[600px] h-[400px] sm:h-[500px] md:h-[600px] rounded-full pointer-events-none" style={{ zIndex: 4, left: '50%', top: '50%', transform: 'translate(-50%, -50%)', background: 'radial-gradient(circle, rgba(245, 240, 235, 0.08) 0%, transparent 70%)', filter: 'blur(60px)' }} />
      <div ref={glowOrbRef} className="absolute w-[300px] sm:w-[400px] md:w-[500px] h-[300px] sm:h-[400px] md:h-[500px] rounded-full opacity-0 pointer-events-none" style={{ zIndex: 4, left: '50%', top: '50%', transform: 'translate(-50%, -50%) scale(0.8)', background: 'radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%)', filter: 'blur(50px)' }} />

      {/* Floating Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 5 }}>
        {[...Array(4)].map((_, i) => (
          <div key={`orb-${i}`} ref={addToOrbs} className="absolute rounded-full opacity-0" style={{ width: `${100 + i * 50}px`, height: `${100 + i * 50}px`, left: `${15 + i * 22}%`, top: `${20 + i * 18}%`, background: `radial-gradient(circle, rgba(245, 240, 235, ${0.05 - i * 0.01}) 0%, transparent 70%)`, filter: 'blur(30px)', willChange: 'transform' }} />
        ))}
      </div>

      {/* Geometric Decorations */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden hidden md:block" style={{ zIndex: 5 }}>
        <div ref={addToGeometric} className="absolute -top-16 -left-16 w-64 h-64 opacity-0">
          <svg viewBox="0 0 250 250" fill="none"><circle cx="125" cy="125" r="110" stroke={colors.textPrimary} strokeWidth="0.5" opacity="0.2"/><circle cx="125" cy="125" r="80" stroke={colors.textPrimary} strokeWidth="0.3" opacity="0.15"/><circle cx="125" cy="125" r="50" stroke={colors.textPrimary} strokeWidth="0.3" opacity="0.1"/></svg>
        </div>
        <div ref={addToGeometric} className="absolute -bottom-20 -right-20 w-80 h-80 opacity-0">
          <svg viewBox="0 0 300 300" fill="none"><polygon points="150,20 280,150 150,280 20,150" stroke={colors.textPrimary} strokeWidth="0.5" fill="none" opacity="0.15"/><polygon points="150,50 250,150 150,250 50,150" stroke={colors.textPrimary} strokeWidth="0.3" fill="none" opacity="0.1"/></svg>
        </div>
      </div>

      {/* Floating Particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none hidden sm:block" style={{ zIndex: 6 }}>
        {[...Array(15)].map((_, i) => (
          <div key={i} ref={addToParticles} className="absolute rounded-full opacity-0" style={{ width: `${2 + Math.random() * 3}px`, height: `${2 + Math.random() * 3}px`, backgroundColor: i % 2 === 0 ? colors.textPrimary : colors.textSecondary, willChange: 'transform, opacity' }} />
        ))}
      </div>

      {/* Room Label Watermark */}
      <div ref={roomLabelRef} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-0" style={{ zIndex: 7 }}>
        <span className="text-[40px] sm:text-[60px] md:text-[100px] lg:text-[140px] font-bold uppercase whitespace-nowrap" style={{ fontFamily: "'Cinzel', serif", letterSpacing: "0.15em", color: colors.textPrimary, opacity: 0.08 }}>{activeRoom}</span>
      </div>

      {/* Border Lines */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 8 }}>
        <div ref={addToBorderLines} className="absolute top-16 sm:top-20 left-4 right-4 sm:left-8 sm:right-8 md:left-16 md:right-16 h-px origin-left" style={{ background: 'linear-gradient(90deg, transparent, '+colors.textSecondary+', '+colors.textPrimary+', '+colors.textSecondary+', transparent)', transform: 'scaleX(0)' }} />
        <div ref={addToBorderLines} className="absolute bottom-16 sm:bottom-20 left-4 right-4 sm:left-8 sm:right-8 md:left-16 md:right-16 h-px origin-right" style={{ background: 'linear-gradient(90deg, transparent, '+colors.textSecondary+', '+colors.textPrimary+', '+colors.textSecondary+', transparent)', transform: 'scaleX(0)' }} />
      </div>

      {/* 360 Indicator */}
      {isPanorama(activeRoom) && (
        <div ref={indicatorRef} className="absolute top-24 sm:top-28 left-1/2 transform -translate-x-1/2 flex items-center gap-3 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full opacity-0" style={{ zIndex: 20, background: colors.cardBg, backdropFilter: 'blur(20px)', border: `1px solid ${colors.cardBorder}` }}>
          <div className="relative">
            <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 sm:w-5 sm:h-5" stroke={colors.textPrimary} strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /><path d="M2 12h20" /></svg>
          </div>
          <span className="text-[10px] sm:text-xs uppercase tracking-[0.2em]" style={{ fontFamily: "'Marcellus', serif", color: colors.textPrimary }}>Drag to explore 360°</span>
        </div>
      )}

      {/* Header */}
      <header className="absolute top-0 left-0 right-0 flex justify-between items-center px-4 sm:px-8 md:px-16 py-4 sm:py-6" style={{ zIndex: 20 }}>
        <div className="absolute bottom-0 left-4 right-4 sm:left-8 sm:right-8 md:left-16 md:right-16 h-px" style={{ background: 'linear-gradient(90deg, transparent, '+colors.textSecondary+', transparent)' }} />
        <div ref={logoRef} className="flex items-center gap-2 sm:gap-3 md:gap-4 opacity-0">
          <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 relative">
            <svg viewBox="0 0 64 64" fill="none" className="w-full h-full relative"><circle cx="32" cy="32" r="28" stroke={colors.textPrimary} strokeWidth="0.5" opacity="0.4"/><circle cx="32" cy="32" r="22" stroke={colors.textPrimary} strokeWidth="0.3" opacity="0.3"/><path d="M32 4C32 4 18 14 18 32C18 50 32 60 32 60" stroke={colors.textPrimary} strokeWidth="1.5" strokeLinecap="round" fill="none"/><path d="M32 4C32 4 46 14 46 32C46 50 32 60 32 60" stroke={colors.textPrimary} strokeWidth="1.5" strokeLinecap="round" fill="none"/><circle cx="32" cy="4" r="3" fill={colors.textPrimary}/><circle cx="32" cy="60" r="3" fill={colors.textPrimary}/><circle cx="32" cy="32" r="4" fill={colors.textAccent} opacity="0.9"/></svg>
          </div>
          <div className="flex flex-col">
            <span className="text-base sm:text-lg md:text-xl font-medium uppercase tracking-[0.2em] sm:tracking-[0.25em]" style={{ fontFamily: "'Cinzel', serif", color: colors.textPrimary }}>Rudraksh</span>
            <span className="text-[8px] sm:text-[9px] md:text-[10px] uppercase tracking-[0.25em] sm:tracking-[0.3em]" style={{ fontFamily: "'Marcellus', serif", color: colors.textSecondary }}>Apartments</span>
          </div>
        </div>
        <button ref={closeRef} onClick={onClose} onMouseEnter={handleCloseEnter} onMouseLeave={handleCloseLeave} className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 flex items-center justify-center rounded-full opacity-0" style={{ backgroundColor: 'rgba(245,240,235,0.1)', border: `1px solid ${colors.cardBorder}`, backdropFilter: 'blur(10px)' }} aria-label="Close">
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" className="w-4 h-4 sm:w-5 sm:h-5" style={{ stroke: colors.textSecondary }}><line x1="6" y1="6" x2="18" y2="18" /><line x1="6" y1="18" x2="18" y2="6" /></svg>
        </button>
      </header>

      {/* Bottom Controls */}
      <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-8 md:px-16 pb-4 sm:pb-6 md:pb-8" style={{ zIndex: 20 }}>
        <div className="flex items-end justify-between gap-4">
          {/* Sound Controls - Fixed width to prevent layout shift */}
          <div ref={soundControlsRef} className="flex items-center gap-2 sm:gap-3 opacity-0" style={{ minWidth: '80px' }}>
            <button onClick={() => setIsMuted(!isMuted)} className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 flex items-center justify-center rounded-full transition-all duration-300 hover:scale-110 group" style={{ background: colors.cardBg, border: `1px solid ${colors.cardBorder}`, backdropFilter: 'blur(10px)' }}>
              {isMuted ? (
                <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 sm:w-5 sm:h-5" stroke={colors.textSecondary} strokeWidth="1.5"><path d="M11 5L6 9H2v6h4l5 4V5z" /><line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" /></svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 sm:w-5 sm:h-5" stroke={colors.textSecondary} strokeWidth="1.5"><path d="M11 5L6 9H2v6h4l5 4V5z" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" /></svg>
              )}
            </button>
            <span className="text-[8px] sm:text-[10px] uppercase tracking-[0.15em] sm:tracking-[0.2em] hidden sm:block" style={{ fontFamily: "'Marcellus', serif", color: colors.textSecondary }}>{isMuted ? 'Unmute' : 'Sound'}</span>
          </div>

          {/* Room Carousel */}
          <div ref={navRef} className="carousel-container flex items-center gap-2 sm:gap-3 md:gap-4 px-3 sm:px-4 md:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl overflow-x-auto max-w-[60vw] sm:max-w-[65vw] md:max-w-none opacity-0" style={{ background: colors.cardBg, backdropFilter: 'blur(20px)', border: `1px solid ${colors.cardBorder}` }}>
            {rooms.map((room, index) => (
              <div key={room.id} ref={addToNavItems} onClick={() => handleRoomChange(room.id)} onMouseEnter={() => handleCarouselItemEnter(index)} onMouseLeave={() => handleCarouselItemLeave(index)} className="carousel-item flex-shrink-0 rounded-lg sm:rounded-xl overflow-hidden relative cursor-pointer" style={{ width: '90px', height: '60px', border: activeRoom === room.id ? `2px solid ${colors.textPrimary}` : `1px solid ${colors.cardBorder}`, transition: 'border 0.2s ease' }}>
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500" style={{ backgroundImage: `url(${room.image})`, transform: activeRoom === room.id ? 'scale(1.1)' : 'scale(1)', filter: activeRoom === room.id ? 'brightness(0.9)' : 'brightness(0.6)' }} />
                <div className="absolute inset-0 transition-all duration-200" style={{ background: activeRoom === room.id ? 'linear-gradient(to top, rgba(245, 240, 235, 0.3) 0%, transparent 60%)' : 'linear-gradient(to top, rgba(107, 88, 72, 0.8) 0%, transparent 60%)' }} />
                <div className="absolute inset-0 flex flex-col items-center justify-end p-2">
                  {room.is360 && <div className="absolute top-1.5 right-1.5 w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center" style={{ background: colors.textPrimary }}><span className="text-[6px] sm:text-[7px] font-bold" style={{ color: colors.bgDark }}>360</span></div>}
                  <span className="text-[9px] sm:text-[10px] md:text-[11px] font-medium text-center leading-tight" style={{ fontFamily: "'Marcellus', serif", color: activeRoom === room.id ? colors.textAccent : colors.textSecondary }}>{room.id}</span>
                </div>
                {activeRoom === room.id && <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full" style={{ backgroundColor: colors.textAccent }} />}
              </div>
            ))}
          </div>

          {/* Mini Map */}
          <div ref={miniMapRef} onClick={onFloorPlanClick} onMouseEnter={handleMiniMapEnter} onMouseLeave={handleMiniMapLeave} className="hidden md:block relative w-40 lg:w-44 h-28 lg:h-32 rounded-xl overflow-hidden opacity-0 cursor-pointer" style={{ background: colors.cardBg, backdropFilter: 'blur(20px)', border: `1px solid ${colors.cardBorder}` }}>
            <div className="absolute inset-0 hover:bg-white/5 transition-all duration-300 z-10 flex items-center justify-center"><span className="opacity-0 hover:opacity-100 text-xs font-medium tracking-[0.15em] uppercase transition-opacity duration-300" style={{ fontFamily: "'Marcellus', serif", color: colors.textPrimary }}>Floor Plan</span></div>
            <svg viewBox="0 0 160 110" className="w-full h-full">
              <rect x="0" y="0" width="160" height="110" fill="transparent" />
              <rect x="8" y="8" width="30" height="35" fill="none" stroke={colors.textPrimary} strokeWidth="1" rx="2" opacity="0.4"/>
              <rect x="42" y="8" width="35" height="35" fill="none" stroke={colors.textPrimary} strokeWidth="1" rx="2" opacity="0.4"/>
              <rect x="81" y="8" width="30" height="35" fill="none" stroke={colors.textPrimary} strokeWidth="1" rx="2" opacity="0.4"/>
              <rect x="115" y="8" width="38" height="35" fill="none" stroke={colors.textPrimary} strokeWidth="1" rx="2" opacity="0.4"/>
              <rect x="8" y="47" width="30" height="35" fill="none" stroke={colors.textPrimary} strokeWidth="1" rx="2" opacity="0.4"/>
              <rect x="42" y="47" width="35" height="35" fill="none" stroke={colors.textPrimary} strokeWidth="1" rx="2" opacity="0.4"/>
              <rect x="115" y="47" width="38" height="55" fill="none" stroke={colors.textPrimary} strokeWidth="1" rx="2" opacity="0.4"/>
              <text x="23" y="28" fontSize="5" fill={colors.textSecondary} textAnchor="middle" style={{ fontFamily: "'Marcellus', serif" }}>Arrival</text>
              <text x="59" y="28" fontSize="5" fill={colors.textSecondary} textAnchor="middle" style={{ fontFamily: "'Marcellus', serif" }}>Living</text>
              <text x="96" y="28" fontSize="5" fill={colors.textSecondary} textAnchor="middle" style={{ fontFamily: "'Marcellus', serif" }}>Bedroom</text>
              <text x="134" y="23" fontSize="4" fill={colors.textSecondary} textAnchor="middle" style={{ fontFamily: "'Marcellus', serif" }}>Kids 1</text>
              <text x="23" y="68" fontSize="5" fill={colors.textSecondary} textAnchor="middle" style={{ fontFamily: "'Marcellus', serif" }}>Balcony</text>
              <text x="59" y="68" fontSize="5" fill={colors.textSecondary} textAnchor="middle" style={{ fontFamily: "'Marcellus', serif" }}>Kitchen</text>
              <text x="134" y="78" fontSize="4" fill={colors.textSecondary} textAnchor="middle" style={{ fontFamily: "'Marcellus', serif" }}>Kids 2</text>
            </svg>
            <div className="minimap-highlight absolute w-3 h-3 lg:w-4 lg:h-4 rounded-full" style={{ background: `radial-gradient(circle, ${colors.textPrimary} 0%, rgba(245, 240, 235, 0.5) 70%)`, boxShadow: `0 0 15px ${colors.glowPrimary}`, left: (roomHighlights[activeRoom]?.x || 50) + "%", top: (roomHighlights[activeRoom]?.y || 50) + "%", transform: "translate(-50%, -50%)", transition: "left 0.4s ease, top 0.4s ease" }} />
          </div>
        </div>
      </div>

      {/* Corner Decorations */}
      {[
        { pos: 'top-20 sm:top-24 left-4 sm:left-8', path: 'M0,48 L0,16 Q0,0 16,0 L48,0', cx: 6, cy: 6 },
        { pos: 'top-20 sm:top-24 right-4 sm:right-8', path: 'M48,48 L48,16 Q48,0 32,0 L0,0', cx: 42, cy: 6 },
        { pos: 'bottom-20 sm:bottom-24 left-4 sm:left-8', path: 'M0,0 L0,32 Q0,48 16,48 L48,48', cx: 6, cy: 42 },
        { pos: 'bottom-20 sm:bottom-24 right-4 sm:right-8', path: 'M48,0 L48,32 Q48,48 32,48 L0,48', cx: 42, cy: 42 }
      ].map((corner, i) => (
        <div key={i} className={`fixed ${corner.pos} w-10 h-10 sm:w-12 sm:h-12 pointer-events-none opacity-20`} style={{ zIndex: 10 }}>
          <svg viewBox="0 0 48 48" fill="none"><path d={corner.path} stroke={colors.textPrimary} strokeWidth="1" fill="none"/><circle cx={corner.cx} cy={corner.cy} r="2" fill={colors.textSecondary}/></svg>
        </div>
      ))}

      {/* Bottom Line */}
      <div className="absolute bottom-0 left-0 right-0 h-px pointer-events-none" style={{ zIndex: 15 }}><div className="h-full mx-4 sm:mx-8 md:mx-16" style={{ background: `linear-gradient(90deg, transparent, ${colors.textSecondary}, ${colors.textPrimary}, ${colors.textSecondary}, transparent)`, opacity: 0.2 }} /></div>
    </div>
  );
};

export default MainPage;