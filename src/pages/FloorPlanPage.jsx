import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

const FloorPlanPage = ({ onClose, onRoomSelect }) => {
  const containerRef = useRef(null);
  const cursorRef = useRef(null);
  const cursorDotRef = useRef(null);
  const cursorTrailRef = useRef([]);
  const logoRef = useRef(null);
  const closeRef = useRef(null);
  const floorPlanRef = useRef(null);
  const floorPlanContainerRef = useRef(null);
  const floorPlanGlowRef = useRef(null);
  const carouselRef = useRef(null);
  const carouselItemsRef = useRef([]);
  const soundControlsRef = useRef(null);
  const particlesRef = useRef([]);
  const orbsRef = useRef([]);
  const geometricRef = useRef([]);
  const borderLinesRef = useRef([]);
  const roomHotspotsRef = useRef([]);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const loadingRef = useRef(null);
  const loadingProgressRef = useRef(null);
  const loadingTextRef = useRef(null);
  const ambientLightRef = useRef(null);
  const glowOrbRef = useRef(null);
  const compassRef = useRef(null);
  const legendRef = useRef(null);
  const statsRef = useRef([]);

  const [activeRoom, setActiveRoom] = useState('Living');
  const [isMuted, setIsMuted] = useState(false);
  const [hoveredRoom, setHoveredRoom] = useState(null);

  // Match HomePage colors exactly - warm taupe theme
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
    { id: 'Arrival', name: 'Arrival Space', description: 'Grand entrance foyer', x: 15, y: 22, sqft: '180', image: '/arrival.jpg' },
    { id: 'Living', name: 'Family Lounge', description: 'Spacious living area', x: 37, y: 28, sqft: '650', image: '/livingroom.jpg' },
    { id: 'Kitchen', name: 'Culinary Heart', description: 'Modern kitchen space', x: 37, y: 62, sqft: '320', image: '/kitchen.jpg' },
    { id: 'Bedroom', name: 'Private Retreat', description: 'Master bedroom suite', x: 62, y: 28, sqft: '480', image: '/bedroom.jpg' },
    { id: 'Balcony', name: 'Open-Air Escape', description: 'Scenic outdoor space', x: 15, y: 62, sqft: '220', image: '/balcony.jpg' },
    { id: 'Kids Bedroom 1', name: 'Kids Haven 1', description: '360° immersive space', x: 85, y: 22, sqft: '280', image: '/marzipano/tiles/0-kids_bedroom_final_01/preview.jpg', is360: true },
    { id: 'Kids Bedroom 2', name: 'Kids Haven 2', description: '360° cozy retreat', x: 85, y: 68, sqft: '260', image: '/marzipano/tiles/1-kids_bedroom_final_02/preview.jpg', is360: true },
  ];

  // Cursor trail setup - matching HomePage
  useEffect(() => {
    const trail = [];
    for (let i = 0; i < 5; i++) {
      const dot = document.createElement('div');
      dot.style.cssText = `position:fixed;width:${6-i}px;height:${6-i}px;background:${colors.textPrimary};border-radius:50%;pointer-events:none;z-index:9998;opacity:${0.4-i*0.07};will-change:transform;transform:translate(-50%,-50%);`;
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
      
      if (ambientLightRef.current) {
        gsap.to(ambientLightRef.current, {
          x: (e.clientX - window.innerWidth / 2) * 0.3,
          y: (e.clientY - window.innerHeight / 2) * 0.3,
          duration: 1.5,
          ease: 'power2.out'
        });
      }
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

  // Loading and reveal animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      const loadingTl = gsap.timeline({
        onComplete: () => startRevealAnimation()
      });

      loadingTl
        .to(loadingTextRef.current, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' })
        .to(loadingProgressRef.current, { width: '100%', duration: 1.2, ease: 'power2.inOut' })
        .to(loadingTextRef.current, { opacity: 0, y: -20, duration: 0.3 })
        .to(loadingRef.current, { yPercent: -100, duration: 0.8, ease: 'power4.inOut' });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const startRevealAnimation = () => {
    const masterTl = gsap.timeline();

    // Border lines
    masterTl.fromTo(borderLinesRef.current, { scaleX: 0 }, { scaleX: 1, duration: 1, stagger: 0.1, ease: 'power3.inOut' }, 0);

    // Logo
    masterTl.fromTo(logoRef.current, { opacity: 0, x: -50 }, { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' }, 0.2);

    // Close button
    masterTl.fromTo(closeRef.current, { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(2)' }, 0.3);

    // Title
    masterTl.fromTo(titleRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, 0.4);

    // Subtitle
    masterTl.fromTo(subtitleRef.current, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, 0.6);

    // Floor plan container
    masterTl.fromTo(floorPlanContainerRef.current, { opacity: 0, scale: 0.9, y: 30 }, { opacity: 1, scale: 1, y: 0, duration: 1.2, ease: 'power3.out' }, 0.5);

    // Floor plan glow
    masterTl.to(floorPlanGlowRef.current, { opacity: 0.5, duration: 1 }, 0.8);

    // Room hotspots
    masterTl.fromTo(roomHotspotsRef.current, { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: 0.5, stagger: 0.08, ease: 'back.out(2)' }, 1);

    // Compass
    masterTl.fromTo(compassRef.current, { opacity: 0, rotation: -90, scale: 0 }, { opacity: 1, rotation: 0, scale: 1, duration: 0.8, ease: 'back.out(1.7)' }, 1.2);

    // Legend
    masterTl.fromTo(legendRef.current, { opacity: 0, x: 30 }, { opacity: 1, x: 0, duration: 0.6, ease: 'power3.out' }, 1.3);

    // Stats
    masterTl.fromTo(statsRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power3.out' }, 1.4);

    // Carousel
    masterTl.fromTo(carouselRef.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, 1.2);

    // Carousel items
    masterTl.fromTo('.carousel-item', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.05, ease: 'power2.out' }, 1.4);

    // Sound controls
    masterTl.fromTo(soundControlsRef.current, { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.5, ease: 'power3.out' }, 1.5);

    // Background effects
    masterTl.to(glowOrbRef.current, { opacity: 0.4, scale: 1, duration: 1.5, ease: 'power2.out' }, 0.5);
    masterTl.fromTo(orbsRef.current, { opacity: 0, scale: 0 }, { opacity: 0.3, scale: 1, duration: 1, stagger: 0.1 }, 0.8);
    masterTl.fromTo(geometricRef.current, { opacity: 0, rotation: -90, scale: 0 }, { opacity: 0.15, rotation: 0, scale: 1, duration: 1, stagger: 0.15 }, 0.6);
    masterTl.fromTo(particlesRef.current, { opacity: 0 }, { opacity: 0.5, duration: 1, stagger: 0.02 }, 1);

    // Continuous animations
    gsap.to(glowOrbRef.current, { scale: 1.1, opacity: 0.3, duration: 4, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 2 });

    orbsRef.current.forEach((orb, i) => {
      if (orb) gsap.to(orb, { y: `+=${15 + i * 8}`, duration: 8 + i * 2, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 2 });
    });

    geometricRef.current.forEach((geo, i) => {
      if (geo) gsap.to(geo, { rotation: i % 2 === 0 ? 360 : -360, duration: 60 + i * 15, repeat: -1, ease: 'none', delay: 2 });
    });

    particlesRef.current.forEach((particle) => {
      if (particle) {
        gsap.set(particle, { x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight });
        gsap.to(particle, {
          y: `-=${60 + Math.random() * 100}`,
          duration: 15 + Math.random() * 10,
          repeat: -1,
          ease: 'none',
          delay: 2,
          onRepeat: () => gsap.set(particle, { y: window.innerHeight + 30, x: Math.random() * window.innerWidth })
        });
      }
    });

    // Compass rotation
    gsap.to(compassRef.current?.querySelector('.compass-needle'), {
      rotation: 5,
      duration: 3,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut',
      delay: 2
    });
  };

  const handleRoomClick = (room) => {
    setActiveRoom(room.id);
    const hotspot = roomHotspotsRef.current.find(h => h?.dataset?.room === room.id);
    if (hotspot) {
      gsap.fromTo(hotspot.querySelector('.hotspot-ring'), { scale: 1, opacity: 0.8 }, { scale: 2, opacity: 0, duration: 0.6, ease: 'power2.out' });
    }
  };

  const handleRoomNavigate = (room) => {
    if (onRoomSelect) {
      gsap.to(containerRef.current, {
        opacity: 0,
        scale: 0.95,
        duration: 0.4,
        ease: 'power3.in',
        onComplete: () => onRoomSelect(room.id)
      });
    }
  };

  const handleCloseEnter = () => {
    gsap.to(closeRef.current, { rotation: 90, scale: 1.1, backgroundColor: 'rgba(245, 240, 235, 0.2)', duration: 0.3 });
  };

  const handleCloseLeave = () => {
    gsap.to(closeRef.current, { rotation: 0, scale: 1, backgroundColor: 'rgba(245, 240, 235, 0.1)', duration: 0.3 });
  };

  const handleCarouselItemEnter = (index) => {
    gsap.to(carouselItemsRef.current[index], { scale: 1.05, y: -4, duration: 0.2 });
  };

  const handleCarouselItemLeave = (index) => {
    gsap.to(carouselItemsRef.current[index], { scale: 1, y: 0, duration: 0.2 });
  };

  const handleHotspotEnter = (room) => {
    setHoveredRoom(room.id);
  };

  const handleHotspotLeave = () => {
    setHoveredRoom(null);
  };

  const addToParticles = (el) => { if (el && !particlesRef.current.includes(el)) particlesRef.current.push(el); };
  const addToOrbs = (el) => { if (el && !orbsRef.current.includes(el)) orbsRef.current.push(el); };
  const addToGeometric = (el) => { if (el && !geometricRef.current.includes(el)) geometricRef.current.push(el); };
  const addToBorderLines = (el) => { if (el && !borderLinesRef.current.includes(el)) borderLinesRef.current.push(el); };
  const addToHotspots = (el) => { if (el && !roomHotspotsRef.current.includes(el)) roomHotspotsRef.current.push(el); };
  const addToCarouselItems = (el) => { if (el && !carouselItemsRef.current.includes(el)) carouselItemsRef.current.push(el); };
  const addToStats = (el) => { if (el && !statsRef.current.includes(el)) statsRef.current.push(el); };

  const cssStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Marcellus&display=swap');
    
    .card-shine { 
      background: linear-gradient(125deg, transparent 30%, rgba(255,255,255,0.05) 45%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 55%, transparent 70%); 
      background-size: 300% 300%; 
      animation: cardShine 6s ease-in-out infinite; 
    }
    @keyframes cardShine { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
    
    .mandala-pattern { background-image: url("data:image/svg+xml,%3Csvg width='200' height='200' viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23f5f0eb' stroke-width='0.5' opacity='0.08'%3E%3Ccircle cx='100' cy='100' r='40'/%3E%3Ccircle cx='100' cy='100' r='60'/%3E%3Ccircle cx='100' cy='100' r='80'/%3E%3Cpath d='M100 20 Q120 100 100 180 Q80 100 100 20'/%3E%3Cpath d='M20 100 Q100 80 180 100 Q100 120 20 100'/%3E%3C/g%3E%3C/svg%3E"); background-size: 200px 200px; }
    
    .arch-pattern { background-image: url("data:image/svg+xml,%3Csvg width='100' height='150' viewBox='0 0 100 150' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 0 Q0 50 0 100 L0 150 L100 150 L100 100 Q100 50 50 0Z' fill='none' stroke='%23f5f0eb' stroke-width='1' opacity='0.05'/%3E%3C/svg%3E"); background-size: 100px 150px; }
    
    .floor-plan-glow { filter: drop-shadow(0 0 30px rgba(245, 240, 235, 0.2)); }
    
    .hotspot-pulse { animation: hotspotPulse 2s ease-in-out infinite; }
    @keyframes hotspotPulse { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.1); opacity: 0.8; } }
    
    .carousel-item { opacity: 0; transform: translateY(20px); }
    
    .room-tooltip { opacity: 0; transform: translateY(10px) scale(0.9); transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); pointer-events: none; }
    .room-tooltip.visible { opacity: 1; transform: translateY(0) scale(1); }
  `;

  return (
    <div ref={containerRef} className="h-screen max-h-screen w-full relative overflow-hidden" style={{ background: colors.bg, cursor: 'none' }}>
      <style>{cssStyles}</style>

      {/* Custom Cursor - matching HomePage */}
      <div ref={cursorRef} className="fixed w-12 h-12 rounded-full hidden md:block" style={{ zIndex: 9999, border: `2px solid ${colors.textPrimary}`, pointerEvents: 'none', boxShadow: `0 0 20px ${colors.glowPrimary}`, willChange: 'transform', top: 0, left: 0 }} />
      <div ref={cursorDotRef} className="fixed w-3 h-3 rounded-full hidden md:block" style={{ zIndex: 9999, pointerEvents: 'none', backgroundColor: colors.textPrimary, boxShadow: `0 0 10px ${colors.textPrimary}`, willChange: 'transform', top: 0, left: 0 }} />

      {/* Loading Screen */}
      <div ref={loadingRef} className="fixed inset-0 flex flex-col items-center justify-center" style={{ zIndex: 100, background: colors.bg }}>
        <div ref={loadingTextRef} className="text-xl sm:text-2xl md:text-3xl font-light tracking-[0.4em] uppercase mb-6" style={{ fontFamily: "'Cinzel', serif", color: colors.textPrimary, opacity: 0, transform: 'translateY(10px)' }}>
          Floor Plan
        </div>
        <div className="w-32 sm:w-48 h-px relative overflow-hidden" style={{ backgroundColor: 'rgba(245, 240, 235, 0.2)' }}>
          <div ref={loadingProgressRef} className="absolute inset-y-0 left-0 w-0" style={{ background: `linear-gradient(90deg, ${colors.textSecondary}, ${colors.textPrimary}, ${colors.textAccent})` }} />
        </div>
      </div>

      {/* Patterns - matching HomePage */}
      <div className="absolute inset-0 mandala-pattern opacity-30" style={{ zIndex: 0, pointerEvents: 'none' }} />
      <div className="fixed left-0 top-0 w-16 sm:w-24 md:w-32 h-full arch-pattern" style={{ zIndex: 1, pointerEvents: 'none' }} />
      <div className="fixed right-0 top-0 w-16 sm:w-24 md:w-32 h-full arch-pattern" style={{ zIndex: 1, pointerEvents: 'none', transform: 'scaleX(-1)' }} />

      {/* Ambient Light - matching HomePage */}
      <div ref={ambientLightRef} className="absolute w-[400px] sm:w-[500px] md:w-[600px] h-[400px] sm:h-[500px] md:h-[600px] rounded-full pointer-events-none" style={{ zIndex: 2, left: '50%', top: '50%', transform: 'translate(-50%, -50%)', background: 'radial-gradient(circle, rgba(245, 240, 235, 0.08) 0%, transparent 70%)', filter: 'blur(60px)' }} />
      <div ref={glowOrbRef} className="absolute w-[300px] sm:w-[400px] md:w-[500px] h-[300px] sm:h-[400px] md:h-[500px] rounded-full opacity-0 pointer-events-none" style={{ zIndex: 2, left: '50%', top: '50%', transform: 'translate(-50%, -50%) scale(0.8)', background: 'radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%)', filter: 'blur(50px)' }} />

      {/* Floating Orbs - matching HomePage */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 3 }}>
        {[...Array(4)].map((_, i) => (
          <div key={`orb-${i}`} ref={addToOrbs} className="absolute rounded-full opacity-0" style={{ width: `${100 + i * 50}px`, height: `${100 + i * 50}px`, left: `${15 + i * 22}%`, top: `${20 + i * 18}%`, background: `radial-gradient(circle, rgba(245, 240, 235, ${0.05 - i * 0.01}) 0%, transparent 70%)`, filter: 'blur(30px)', willChange: 'transform' }} />
        ))}
      </div>

      {/* Geometric Decorations - matching HomePage */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none hidden md:block" style={{ zIndex: 3 }}>
        <div ref={addToGeometric} className="absolute -top-16 -left-16 w-64 h-64 opacity-0">
          <svg viewBox="0 0 250 250" fill="none">
            <circle cx="125" cy="125" r="110" stroke={colors.textPrimary} strokeWidth="0.5" opacity="0.2" />
            <circle cx="125" cy="125" r="80" stroke={colors.textPrimary} strokeWidth="0.3" opacity="0.15" />
            <circle cx="125" cy="125" r="50" stroke={colors.textPrimary} strokeWidth="0.3" opacity="0.1" />
          </svg>
        </div>
        <div ref={addToGeometric} className="absolute -bottom-20 -right-20 w-80 h-80 opacity-0">
          <svg viewBox="0 0 300 300" fill="none">
            <polygon points="150,20 280,150 150,280 20,150" stroke={colors.textPrimary} strokeWidth="0.5" fill="none" opacity="0.15" />
            <polygon points="150,50 250,150 150,250 50,150" stroke={colors.textPrimary} strokeWidth="0.3" fill="none" opacity="0.1" />
          </svg>
        </div>
      </div>

      {/* Floating Particles - matching HomePage */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none hidden sm:block" style={{ zIndex: 4 }}>
        {[...Array(15)].map((_, i) => (
          <div key={`p-${i}`} ref={addToParticles} className="absolute rounded-full opacity-0" style={{ width: `${2 + Math.random() * 3}px`, height: `${2 + Math.random() * 3}px`, backgroundColor: i % 2 === 0 ? colors.textPrimary : colors.textSecondary, willChange: 'transform, opacity' }} />
        ))}
      </div>

      {/* Border Lines - matching HomePage */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 5 }}>
        <div ref={addToBorderLines} className="absolute top-16 sm:top-20 left-4 right-4 sm:left-8 sm:right-8 md:left-16 md:right-16 h-px origin-left" style={{ background: `linear-gradient(90deg, transparent, ${colors.textSecondary}, ${colors.textPrimary}, ${colors.textSecondary}, transparent)`, transform: 'scaleX(0)' }} />
        <div ref={addToBorderLines} className="absolute bottom-16 sm:bottom-20 left-4 right-4 sm:left-8 sm:right-8 md:left-16 md:right-16 h-px origin-right" style={{ background: `linear-gradient(90deg, transparent, ${colors.textSecondary}, ${colors.textPrimary}, ${colors.textSecondary}, transparent)`, transform: 'scaleX(0)' }} />
      </div>

      {/* Main Layout - Flex column for proper structure */}
      <div className="relative h-full flex flex-col" style={{ zIndex: 10 }}>
        
        {/* Header */}
        <header className="flex-shrink-0 flex justify-between items-center px-4 sm:px-8 md:px-16 py-3 sm:py-4 md:py-6">
          <div ref={logoRef} className="flex items-center gap-2 sm:gap-3 md:gap-4 opacity-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14">
              <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
                <circle cx="32" cy="32" r="28" stroke={colors.textPrimary} strokeWidth="0.5" opacity="0.4" />
                <circle cx="32" cy="32" r="22" stroke={colors.textPrimary} strokeWidth="0.3" opacity="0.3" />
                <path d="M32 4C32 4 18 14 18 32C18 50 32 60 32 60" stroke={colors.textPrimary} strokeWidth="1.5" strokeLinecap="round" fill="none" />
                <path d="M32 4C32 4 46 14 46 32C46 50 32 60 32 60" stroke={colors.textPrimary} strokeWidth="1.5" strokeLinecap="round" fill="none" />
                <circle cx="32" cy="4" r="3" fill={colors.textPrimary} />
                <circle cx="32" cy="60" r="3" fill={colors.textPrimary} />
                <circle cx="32" cy="32" r="4" fill={colors.textAccent} opacity="0.9" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-base sm:text-lg md:text-xl font-medium uppercase tracking-[0.2em] sm:tracking-[0.25em]" style={{ fontFamily: "'Cinzel', serif", color: colors.textPrimary }}>
                Rudraksh
              </span>
              <span className="text-[8px] sm:text-[9px] md:text-[10px] uppercase tracking-[0.25em] sm:tracking-[0.3em]" style={{ fontFamily: "'Marcellus', serif", color: colors.textSecondary }}>
                Apartments
              </span>
            </div>
          </div>

          <button ref={closeRef} onClick={onClose} onMouseEnter={handleCloseEnter} onMouseLeave={handleCloseLeave} className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 flex items-center justify-center rounded-full opacity-0" style={{ backgroundColor: 'rgba(245, 240, 235, 0.1)', border: `1px solid ${colors.cardBorder}`, backdropFilter: 'blur(10px)' }}>
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" className="w-4 h-4 sm:w-5 sm:h-5" style={{ stroke: colors.textSecondary }}>
              <line x1="6" y1="6" x2="18" y2="18" />
              <line x1="6" y1="18" x2="18" y2="6" />
            </svg>
          </button>
        </header>

        {/* Title Section - Part of flex flow, not absolute */}
        <div className="flex-shrink-0 text-center px-4 py-2 sm:py-3">
          <h1 ref={titleRef} className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light opacity-0" style={{ fontFamily: "'Cinzel', serif", letterSpacing: '0.1em', color: colors.textPrimary }}>
            4BHK Floor Plan
          </h1>
          <p ref={subtitleRef} className="text-xs sm:text-sm md:text-base mt-1 sm:mt-2 italic opacity-0" style={{ fontFamily: "'Cormorant Garamond', serif", color: colors.textSecondary }}>
            2,800 sq. ft. of thoughtfully designed living space
          </p>
        </div>

        {/* Main Content - Floor Plan centered */}
        <main className="flex-1 min-h-0 flex items-center justify-center px-4 sm:px-8 md:px-16 py-2">
          <div ref={floorPlanContainerRef} className="relative w-full max-w-4xl opacity-0">
            {/* Glow behind floor plan */}
            <div ref={floorPlanGlowRef} className="absolute -inset-4 sm:-inset-6 md:-inset-8 rounded-2xl opacity-0 pointer-events-none" style={{ background: `radial-gradient(ellipse at center, ${colors.glowPrimary} 0%, transparent 70%)`, filter: 'blur(30px)' }} />

            {/* Floor Plan Card */}
            <div className="relative rounded-xl sm:rounded-2xl overflow-hidden" style={{ background: colors.cardBg, border: `1px solid ${colors.cardBorder}`, backdropFilter: 'blur(20px)', boxShadow: '0 25px 60px rgba(0, 0, 0, 0.2)' }}>
              <div className="absolute inset-0 card-shine rounded-xl sm:rounded-2xl pointer-events-none" />

              {/* SVG Floor Plan */}
              <div ref={floorPlanRef} className="relative p-3 sm:p-4 md:p-6 lg:p-8">
                <svg viewBox="0 0 500 320" className="w-full h-auto floor-plan-glow">
                  {/* Background pattern */}
                  <defs>
                    <pattern id="grid-pattern" width="25" height="25" patternUnits="userSpaceOnUse">
                      <path d="M 25 0 L 0 0 0 25" fill="none" stroke={colors.textPrimary} strokeWidth="0.3" opacity="0.1"/>
                    </pattern>
                    <linearGradient id="room-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="rgba(245, 240, 235, 0.1)" />
                      <stop offset="100%" stopColor="rgba(245, 240, 235, 0.05)" />
                    </linearGradient>
                    <filter id="room-glow">
                      <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                      <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>

                  <rect x="0" y="0" width="500" height="320" fill="url(#grid-pattern)" />

                  {/* Outer boundary */}
                  <rect x="20" y="20" width="460" height="280" fill="none" stroke={colors.textPrimary} strokeWidth="1.5" rx="4" opacity="0.3"/>

                  {/* Rooms */}
                  {/* Arrival Space */}
                  <g className="room-group">
                    <rect x="30" y="30" width="80" height="100" fill="url(#room-gradient)" stroke={colors.textPrimary} strokeWidth="1" rx="3" filter="url(#room-glow)" opacity="0.8"/>
                    <text x="70" y="70" fontSize="10" fill={colors.textPrimary} textAnchor="middle" style={{ fontFamily: 'Cinzel, serif' }}>Arrival</text>
                    <text x="70" y="85" fontSize="8" fill={colors.textSecondary} textAnchor="middle">Space</text>
                    <text x="70" y="115" fontSize="7" fill={colors.textMuted} textAnchor="middle">180 sq.ft</text>
                  </g>

                  {/* Living Room */}
                  <g className="room-group">
                    <rect x="120" y="30" width="130" height="100" fill="url(#room-gradient)" stroke={colors.textPrimary} strokeWidth="1" rx="3" filter="url(#room-glow)" opacity="0.8"/>
                    <text x="185" y="65" fontSize="11" fill={colors.textPrimary} textAnchor="middle" style={{ fontFamily: 'Cinzel, serif' }}>Family</text>
                    <text x="185" y="82" fontSize="9" fill={colors.textSecondary} textAnchor="middle">Lounge</text>
                    <text x="185" y="115" fontSize="7" fill={colors.textMuted} textAnchor="middle">650 sq.ft</text>
                    <rect x="135" y="95" width="40" height="15" fill="none" stroke={colors.textMuted} strokeWidth="0.5" rx="2" opacity="0.4"/>
                    <rect x="185" y="95" width="40" height="15" fill="none" stroke={colors.textMuted} strokeWidth="0.5" rx="2" opacity="0.4"/>
                  </g>

                  {/* Bedroom */}
                  <g className="room-group">
                    <rect x="260" y="30" width="100" height="100" fill="url(#room-gradient)" stroke={colors.textPrimary} strokeWidth="1" rx="3" filter="url(#room-glow)" opacity="0.8"/>
                    <text x="310" y="65" fontSize="10" fill={colors.textPrimary} textAnchor="middle" style={{ fontFamily: 'Cinzel, serif' }}>Private</text>
                    <text x="310" y="82" fontSize="9" fill={colors.textSecondary} textAnchor="middle">Retreat</text>
                    <text x="310" y="115" fontSize="7" fill={colors.textMuted} textAnchor="middle">480 sq.ft</text>
                    <rect x="275" y="45" width="30" height="50" fill="none" stroke={colors.textMuted} strokeWidth="0.5" rx="2" opacity="0.4"/>
                  </g>

                  {/* Kids Bedroom 1 */}
                  <g className="room-group">
                    <rect x="370" y="30" width="100" height="100" fill="url(#room-gradient)" stroke={colors.textPrimary} strokeWidth="1" rx="3" filter="url(#room-glow)" opacity="0.8"/>
                    <text x="420" y="60" fontSize="9" fill={colors.textPrimary} textAnchor="middle" style={{ fontFamily: 'Cinzel, serif' }}>Kids</text>
                    <text x="420" y="75" fontSize="8" fill={colors.textSecondary} textAnchor="middle">Haven 1</text>
                    <text x="420" y="95" fontSize="7" fill={colors.textMuted} textAnchor="middle">280 sq.ft</text>
                    <circle cx="420" cy="115" r="10" fill="rgba(245, 240, 235, 0.2)" stroke={colors.textPrimary} strokeWidth="1"/>
                    <text x="420" y="118" fontSize="6" fill={colors.textPrimary} textAnchor="middle" fontWeight="bold">360°</text>
                  </g>

                  {/* Balcony */}
                  <g className="room-group">
                    <rect x="30" y="140" width="80" height="90" fill="rgba(245, 240, 235, 0.05)" stroke={colors.textPrimary} strokeWidth="1" rx="3" strokeDasharray="4,2" opacity="0.8"/>
                    <text x="70" y="175" fontSize="9" fill={colors.textPrimary} textAnchor="middle" style={{ fontFamily: 'Cinzel, serif' }}>Open-Air</text>
                    <text x="70" y="190" fontSize="8" fill={colors.textSecondary} textAnchor="middle">Escape</text>
                    <text x="70" y="215" fontSize="7" fill={colors.textMuted} textAnchor="middle">220 sq.ft</text>
                    <circle cx="45" cy="205" r="6" fill="none" stroke={colors.textMuted} strokeWidth="0.5" opacity="0.4"/>
                    <circle cx="95" cy="205" r="6" fill="none" stroke={colors.textMuted} strokeWidth="0.5" opacity="0.4"/>
                  </g>

                  {/* Kitchen */}
                  <g className="room-group">
                    <rect x="120" y="140" width="130" height="90" fill="url(#room-gradient)" stroke={colors.textPrimary} strokeWidth="1" rx="3" filter="url(#room-glow)" opacity="0.8"/>
                    <text x="185" y="170" fontSize="10" fill={colors.textPrimary} textAnchor="middle" style={{ fontFamily: 'Cinzel, serif' }}>Culinary</text>
                    <text x="185" y="187" fontSize="9" fill={colors.textSecondary} textAnchor="middle">Heart</text>
                    <text x="185" y="215" fontSize="7" fill={colors.textMuted} textAnchor="middle">320 sq.ft</text>
                    <rect x="130" y="200" width="110" height="10" fill="none" stroke={colors.textMuted} strokeWidth="0.5" rx="1" opacity="0.4"/>
                  </g>

                  {/* Bathroom */}
                  <g className="room-group">
                    <rect x="260" y="140" width="60" height="50" fill="rgba(245, 240, 235, 0.03)" stroke={colors.textPrimary} strokeWidth="0.5" rx="3" opacity="0.6"/>
                    <text x="290" y="168" fontSize="8" fill={colors.textSecondary} textAnchor="middle">Bath</text>
                  </g>

                  {/* Hallway */}
                  <rect x="260" y="195" width="100" height="35" fill="rgba(245, 240, 235, 0.02)" stroke={colors.textPrimary} strokeWidth="0.5" rx="2" strokeDasharray="3,3" opacity="0.4"/>

                  {/* Kids Bedroom 2 */}
                  <g className="room-group">
                    <rect x="370" y="140" width="100" height="130" fill="url(#room-gradient)" stroke={colors.textPrimary} strokeWidth="1" rx="3" filter="url(#room-glow)" opacity="0.8"/>
                    <text x="420" y="190" fontSize="9" fill={colors.textPrimary} textAnchor="middle" style={{ fontFamily: 'Cinzel, serif' }}>Kids</text>
                    <text x="420" y="205" fontSize="8" fill={colors.textSecondary} textAnchor="middle">Haven 2</text>
                    <text x="420" y="225" fontSize="7" fill={colors.textMuted} textAnchor="middle">260 sq.ft</text>
                    <circle cx="420" cy="245" r="10" fill="rgba(245, 240, 235, 0.2)" stroke={colors.textPrimary} strokeWidth="1"/>
                    <text x="420" y="248" fontSize="6" fill={colors.textPrimary} textAnchor="middle" fontWeight="bold">360°</text>
                  </g>

                  {/* Door indicators */}
                  <line x1="110" y1="70" x2="120" y2="70" stroke={colors.textPrimary} strokeWidth="3" strokeLinecap="round" opacity="0.6"/>
                  <line x1="250" y1="70" x2="260" y2="70" stroke={colors.textPrimary} strokeWidth="3" strokeLinecap="round" opacity="0.6"/>
                  <line x1="360" y1="70" x2="370" y2="70" stroke={colors.textPrimary} strokeWidth="3" strokeLinecap="round" opacity="0.6"/>
                  <line x1="185" y1="130" x2="185" y2="140" stroke={colors.textPrimary} strokeWidth="3" strokeLinecap="round" opacity="0.6"/>

                  {/* Scale bar */}
                  <g transform="translate(30, 290)">
                    <line x1="0" y1="0" x2="60" y2="0" stroke={colors.textMuted} strokeWidth="1"/>
                    <line x1="0" y1="-4" x2="0" y2="4" stroke={colors.textMuted} strokeWidth="1"/>
                    <line x1="60" y1="-4" x2="60" y2="4" stroke={colors.textMuted} strokeWidth="1"/>
                    <text x="30" y="15" fontSize="8" fill={colors.textMuted} textAnchor="middle" style={{ fontFamily: 'Marcellus, serif' }}>5 meters</text>
                  </g>
                </svg>

                {/* Interactive Hotspots */}
                {rooms.map((room) => (
                  <div
                    key={room.id}
                    ref={addToHotspots}
                    data-room={room.id}
                    className="absolute cursor-pointer group"
                    style={{ left: `${room.x}%`, top: `${room.y}%`, transform: 'translate(-50%, -50%)' }}
                    onClick={() => handleRoomClick(room)}
                    onDoubleClick={() => handleRoomNavigate(room)}
                    onMouseEnter={() => handleHotspotEnter(room)}
                    onMouseLeave={handleHotspotLeave}
                  >
                    <div className="hotspot-ring absolute inset-0 w-8 h-8 sm:w-10 sm:h-10 -ml-4 -mt-4 sm:-ml-5 sm:-mt-5 rounded-full" style={{ border: `2px solid ${colors.textPrimary}`, opacity: activeRoom === room.id ? 0.5 : 0 }} />
                    
                    <div className={`relative w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all duration-300 ${activeRoom === room.id ? 'scale-125' : 'scale-100 group-hover:scale-110'}`} style={{ background: activeRoom === room.id ? colors.textPrimary : colors.cardBg, border: `2px solid ${activeRoom === room.id ? colors.textAccent : colors.textPrimary}`, boxShadow: activeRoom === room.id ? `0 0 20px ${colors.glowPrimary}` : '0 4px 15px rgba(0, 0, 0, 0.2)' }}>
                      <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${activeRoom === room.id ? 'bg-[#927867]' : 'bg-white'}`} style={{ backgroundColor: activeRoom === room.id ? colors.bg : colors.textPrimary }} />
                      {room.is360 && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 rounded-full flex items-center justify-center" style={{ background: colors.textPrimary, fontSize: '5px', color: colors.bg, fontWeight: 'bold' }}>
                          <span className="text-[5px] sm:text-[6px]">360</span>
                        </div>
                      )}
                    </div>

                    <div className={`room-tooltip absolute top-full left-1/2 -translate-x-1/2 mt-2 sm:mt-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl whitespace-nowrap ${hoveredRoom === room.id ? 'visible' : ''}`} style={{ background: colors.cardBg, border: `1px solid ${colors.cardBorder}`, boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)', backdropFilter: 'blur(10px)', zIndex: 50 }}>
                      <p className="text-xs sm:text-sm font-medium" style={{ fontFamily: "'Cinzel', serif", color: colors.textPrimary }}>{room.name}</p>
                      <p className="text-[10px] sm:text-xs mt-1" style={{ color: colors.textSecondary, fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic' }}>{room.description}</p>
                      <p className="text-[9px] sm:text-[10px] mt-1 sm:mt-2" style={{ color: colors.textMuted }}>{room.sqft} sq.ft • Double-click to explore</p>
                    </div>
                  </div>
                ))}

                {/* Compass */}
                <div ref={compassRef} className="absolute top-2 right-2 sm:top-4 sm:right-4 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 opacity-0">
                  <svg viewBox="0 0 60 60" fill="none">
                    <circle cx="30" cy="30" r="28" fill={colors.cardBg} stroke={colors.textPrimary} strokeWidth="1" opacity="0.8"/>
                    <circle cx="30" cy="30" r="22" fill="none" stroke={colors.textPrimary} strokeWidth="0.5" opacity="0.3"/>
                    <g className="compass-needle">
                      <path d="M30,10 L34,30 L30,25 L26,30 Z" fill={colors.textPrimary}/>
                      <path d="M30,50 L34,30 L30,35 L26,30 Z" fill={colors.textMuted}/>
                    </g>
                    <text x="30" y="8" fontSize="8" fill={colors.textPrimary} textAnchor="middle" fontWeight="bold">N</text>
                    <text x="30" y="57" fontSize="6" fill={colors.textMuted} textAnchor="middle">S</text>
                    <text x="6" y="33" fontSize="6" fill={colors.textMuted} textAnchor="middle">W</text>
                    <text x="54" y="33" fontSize="6" fill={colors.textMuted} textAnchor="middle">E</text>
                  </svg>
                </div>
              </div>
            </div>

            {/* Legend - hidden on small screens */}
            <div ref={legendRef} className="absolute -right-4 top-1/2 -translate-y-1/2 translate-x-full hidden xl:flex flex-col gap-2 sm:gap-3 px-3 sm:px-4 py-3 sm:py-4 rounded-lg sm:rounded-xl opacity-0" style={{ background: colors.cardBg, border: `1px solid ${colors.cardBorder}`, backdropFilter: 'blur(10px)' }}>
              <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] mb-1 sm:mb-2" style={{ color: colors.textMuted, fontFamily: "'Marcellus', serif" }}>Legend</p>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full" style={{ background: colors.textPrimary }} />
                <span className="text-[9px] sm:text-[10px]" style={{ color: colors.textSecondary }}>Living Space</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border border-dashed" style={{ borderColor: colors.textPrimary }} />
                <span className="text-[9px] sm:text-[10px]" style={{ color: colors.textSecondary }}>Outdoor</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full flex items-center justify-center" style={{ background: colors.textPrimary, fontSize: '4px', color: colors.bg }}>360</div>
                <span className="text-[9px] sm:text-[10px]" style={{ color: colors.textSecondary }}>360° View</span>
              </div>
            </div>

            {/* Stats Row */}
            <div className="flex justify-center gap-4 sm:gap-8 md:gap-12 lg:gap-16 mt-3 sm:mt-4 md:mt-6">
              {[{ value: '4', label: 'Bedrooms' }, { value: '2,800', label: 'Sq. Ft.' }, { value: '3', label: 'Bathrooms' }, { value: '2', label: '360° Rooms' }].map((stat, i) => (
                <div key={i} ref={addToStats} className="text-center opacity-0">
                  <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-light" style={{ fontFamily: "'Cinzel', serif", color: colors.textPrimary }}>{stat.value}</div>
                  <div className="text-[7px] sm:text-[8px] md:text-[9px] uppercase tracking-[0.15em] sm:tracking-[0.2em] mt-0.5 sm:mt-1" style={{ fontFamily: "'Marcellus', serif", color: colors.textMuted }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </main>

        {/* Footer with controls */}
        <footer className="flex-shrink-0 flex items-end justify-between px-4 sm:px-8 md:px-16 py-3 sm:py-4 md:py-6 gap-4">
          {/* Sound Controls */}
          <div ref={soundControlsRef} className="flex items-center gap-2 sm:gap-3 opacity-0">
            <button onClick={() => setIsMuted(!isMuted)} className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 flex items-center justify-center rounded-full transition-all duration-300 hover:scale-110 group" style={{ background: colors.cardBg, border: `1px solid ${colors.cardBorder}`, backdropFilter: 'blur(10px)' }}>
              {isMuted ? (
                <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 sm:w-5 sm:h-5" stroke={colors.textSecondary} strokeWidth="1.5">
                  <path d="M11 5L6 9H2v6h4l5 4V5z" />
                  <line x1="23" y1="9" x2="17" y2="15" />
                  <line x1="17" y1="9" x2="23" y2="15" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 sm:w-5 sm:h-5" stroke={colors.textSecondary} strokeWidth="1.5">
                  <path d="M11 5L6 9H2v6h4l5 4V5z" />
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                </svg>
              )}
            </button>
            <span className="text-[8px] sm:text-[9px] md:text-[10px] uppercase tracking-[0.15em] sm:tracking-[0.2em] hidden sm:block" style={{ fontFamily: "'Marcellus', serif", color: colors.textSecondary }}>{isMuted ? 'Unmute' : 'Sound'}</span>
          </div>

          {/* Room Carousel */}
          <div ref={carouselRef} className="flex items-center gap-2 sm:gap-3 md:gap-4 px-3 sm:px-4 md:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl overflow-x-auto max-w-[55vw] sm:max-w-[60vw] md:max-w-none opacity-0" style={{ background: colors.cardBg, backdropFilter: 'blur(20px)', border: `1px solid ${colors.cardBorder}` }}>
            <div className="absolute inset-0 card-shine rounded-xl sm:rounded-2xl pointer-events-none" />
            {rooms.map((room, index) => (
              <div
                key={room.id}
                ref={addToCarouselItems}
                onClick={() => handleRoomClick(room)}
                onDoubleClick={() => handleRoomNavigate(room)}
                onMouseEnter={() => handleCarouselItemEnter(index)}
                onMouseLeave={() => handleCarouselItemLeave(index)}
                className="carousel-item flex-shrink-0 cursor-pointer rounded-lg sm:rounded-xl overflow-hidden relative"
                style={{ width: '80px', height: '55px', border: activeRoom === room.id ? `2px solid ${colors.textPrimary}` : `1px solid ${colors.cardBorder}`, transition: 'border 0.2s ease' }}
              >
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500" style={{ backgroundImage: `url(${room.image})`, transform: activeRoom === room.id ? 'scale(1.1)' : 'scale(1)', filter: activeRoom === room.id ? 'brightness(0.9)' : 'brightness(0.6)' }} />
                <div className="absolute inset-0 transition-all duration-200" style={{ background: activeRoom === room.id ? `linear-gradient(to top, rgba(245, 240, 235, 0.3) 0%, transparent 60%)` : `linear-gradient(to top, rgba(107, 88, 72, 0.8) 0%, transparent 60%)` }} />
                <div className="absolute inset-0 flex flex-col items-center justify-end p-1.5 sm:p-2">
                  {room.is360 && (
                    <div className="absolute top-1 right-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center" style={{ background: colors.textPrimary }}>
                      <span className="text-[5px] sm:text-[6px] font-bold" style={{ color: colors.bg }}>360</span>
                    </div>
                  )}
                  <span className="text-[8px] sm:text-[9px] md:text-[10px] font-medium text-center leading-tight" style={{ fontFamily: "'Marcellus', serif", color: activeRoom === room.id ? colors.textAccent : colors.textSecondary }}>{room.id}</span>
                </div>
                {activeRoom === room.id && <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full" style={{ backgroundColor: colors.textAccent }} />}
              </div>
            ))}
          </div>

          {/* Placeholder for symmetry on larger screens */}
          <div className="w-10 sm:w-12 hidden md:block" />
        </footer>
      </div>

      {/* Corner Decorations - matching HomePage */}
      {[
        { pos: 'top-20 sm:top-24 left-4 sm:left-8', path: 'M0,48 L0,16 Q0,0 16,0 L48,0', cx: 6, cy: 6 },
        { pos: 'top-20 sm:top-24 right-4 sm:right-8', path: 'M48,48 L48,16 Q48,0 32,0 L0,0', cx: 42, cy: 6 },
        { pos: 'bottom-20 sm:bottom-24 left-4 sm:left-8', path: 'M0,0 L0,32 Q0,48 16,48 L48,48', cx: 6, cy: 42 },
        { pos: 'bottom-20 sm:bottom-24 right-4 sm:right-8', path: 'M48,0 L48,32 Q48,48 32,48 L0,48', cx: 42, cy: 42 }
      ].map((corner, i) => (
        <div key={i} className={`fixed ${corner.pos} w-10 h-10 sm:w-12 sm:h-12 pointer-events-none opacity-20`} style={{ zIndex: 6 }}>
          <svg viewBox="0 0 48 48" fill="none">
            <path d={corner.path} stroke={colors.textPrimary} strokeWidth="1" fill="none" />
            <circle cx={corner.cx} cy={corner.cy} r="2" fill={colors.textSecondary} />
          </svg>
        </div>
      ))}

      {/* Bottom Line - matching HomePage */}
      <div className="absolute bottom-0 left-0 right-0 h-px pointer-events-none" style={{ zIndex: 15 }}>
        <div className="h-full mx-4 sm:mx-8 md:mx-16" style={{ background: `linear-gradient(90deg, transparent, ${colors.textSecondary}, ${colors.textPrimary}, ${colors.textSecondary}, transparent)`, opacity: 0.2 }} />
      </div>
    </div>
  );
};

export default FloorPlanPage;