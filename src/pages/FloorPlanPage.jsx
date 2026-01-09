import React, { useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

const FloorPlanPage = ({ onClose, onRoomSelect, initialRoom = null }) => {
  const containerRef = useRef(null);
  const logoRef = useRef(null);
  const closeRef = useRef(null);
  const floorPlanRef = useRef(null);
  const carouselRef = useRef(null);
  const carouselItemsRef = useRef([]);
  const soundControlsRef = useRef(null);
  const particlesRef = useRef([]);

  // Mandala refs
  const mandalaCenterRef = useRef(null);
  const mandalaLeftRef = useRef(null);
  const mandalaRightRef = useRef(null);

  const [activeRoom, setActiveRoom] = useState(initialRoom || 'Living');
  const [isMuted, setIsMuted] = useState(false);

  // Color theme matching HomePage
  const colors = {
    bg: "#927867",
    textPrimary: "#f5f0eb",
    textSecondary: "#e8e0d8",
    textAccent: "#E8C4A0",
    glowPrimary: "rgba(245, 240, 235, 0.3)",
    glowSecondary: "rgba(212, 165, 116, 0.25)",
    terracotta: "#c17f59",
    terracottaDark: "#a65d3f",
    terracottaLight: "#d4a574",
  };

  // Room data with descriptions and positions on floor plan (adjusted for compact layout)
  const rooms = [
    { id: 'Arrival', name: 'Arrival Space', description: 'Grand entrance foyer', x: 18, y: 25, image: '/arrival.jpg' },
    { id: 'Living', name: 'Family Lounge', description: 'Spacious living area', x: 45, y: 25, image: '/livingroom.jpg' },
    { id: 'Kitchen', name: 'Heart of the Home', description: 'Modern culinary space', x: 45, y: 65, image: '/kitchen.jpg' },
    { id: 'Bedroom', name: 'Private Retreat', description: 'Master bedroom suite', x: 72, y: 25, image: '/bedroom.jpg' },
    { id: 'Balcony', name: 'Open-Air Escape', description: 'Scenic outdoor space', x: 18, y: 65, image: '/balcony.jpg' },
    { id: 'Kids Bedroom 1', name: 'Kids Room 1', description: 'Playful kids space', x: 88, y: 25, image: '/marzipano/tiles/0-kids_bedroom_final_01/preview.jpg', is360: true },
    { id: 'Kids Bedroom 2', name: 'Kids Room 2', description: 'Cozy kids retreat', x: 88, y: 70, image: '/marzipano/tiles/1-kids_bedroom_final_02/preview.jpg', is360: true },
  ];

  // Room to SVG rect mapping for border animations
  const roomRectIds = {
    'Arrival': 'room-arrival',
    'Living': 'room-living',
    'Kitchen': 'room-kitchen',
    'Bedroom': 'room-bedroom',
    'Balcony': 'room-balcony',
    'Kids Bedroom 1': 'room-kids1',
    'Kids Bedroom 2': 'room-kids2',
  };

  const addToParticles = (el) => {
    if (el && !particlesRef.current.includes(el)) {
      particlesRef.current.push(el);
    }
  };

  const addToCarouselItems = (el) => {
    if (el && !carouselItemsRef.current.includes(el)) {
      carouselItemsRef.current.push(el);
    }
  };

  // Reset carouselItemsRef on mount
  useGSAP(() => {
    carouselItemsRef.current = [];
  }, { scope: containerRef });

  // Set initial states
  useGSAP(() => {
    gsap.set(logoRef.current, { opacity: 0, x: -50 });
    gsap.set(closeRef.current, { opacity: 0, x: 50 });
    gsap.set(floorPlanRef.current, { opacity: 0, scale: 0.9 });
    gsap.set(carouselRef.current, { opacity: 0, y: 30 });
    gsap.set(soundControlsRef.current, { opacity: 0, x: -30 });

    // Set initial states for mandalas
    gsap.set(mandalaCenterRef.current, { opacity: 0, scale: 0.8, rotation: 0 });
    gsap.set(mandalaLeftRef.current, { opacity: 0, rotation: 0 });
    gsap.set(mandalaRightRef.current, { opacity: 0, rotation: 0 });
  }, { scope: containerRef });

  // Main animations
  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' }, delay: 0.2 });

    // Animate mandalas in first
    tl.to(mandalaCenterRef.current, {
      opacity: 1,
      scale: 1,
      duration: 1.5,
      ease: 'power2.out'
    }, 0)
    .to(mandalaLeftRef.current, {
      opacity: 1,
      duration: 1.5,
      ease: 'power2.out'
    }, 0.1)
    .to(mandalaRightRef.current, {
      opacity: 1,
      duration: 1.5,
      ease: 'power2.out'
    }, 0.2)
    .to(floorPlanRef.current, {
      opacity: 1,
      scale: 1,
      duration: 1,
      ease: 'power2.out'
    }, 0.3)
    .to(logoRef.current, {
      opacity: 1,
      x: 0,
      duration: 0.8
    }, '-=0.6')
    .to(closeRef.current, {
      opacity: 1,
      x: 0,
      duration: 0.8
    }, '-=0.6')
    .to(carouselRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power2.out'
    }, '-=0.4')
    .to('.carousel-item', {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.6,
      ease: 'power2.out'
    }, '-=0.3')
    .to(soundControlsRef.current, {
      opacity: 1,
      x: 0,
      duration: 0.5
    }, '-=0.4');

    // Start continuous mandala rotations
    gsap.to(mandalaCenterRef.current, {
      rotation: 360,
      duration: 60,
      repeat: -1,
      ease: 'none'
    });

    gsap.to(mandalaLeftRef.current, {
      rotation: 360,
      duration: 80,
      repeat: -1,
      ease: 'none'
    });

    gsap.to(mandalaRightRef.current, {
      rotation: -360,
      duration: 80,
      repeat: -1,
      ease: 'none'
    });

    // Floating sand particles
    particlesRef.current.forEach((particle) => {
      if (particle) {
        gsap.set(particle, {
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          opacity: 0,
          scale: Math.random() * 0.5 + 0.5,
        });

        gsap.to(particle, {
          x: `+=${100 + Math.random() * 150}`,
          y: `-=${50 + Math.random() * 100}`,
          duration: 10 + Math.random() * 8,
          delay: Math.random() * 6,
          repeat: -1,
          ease: "none",
          onStart: () => {
            gsap.to(particle, {
              opacity: 0.4,
              duration: 2,
              yoyo: true,
              repeat: -1,
              ease: "sine.inOut",
            });
          },
          onRepeat: () => {
            gsap.set(particle, {
              x: Math.random() * window.innerWidth,
              y: window.innerHeight + 20,
            });
          },
        });
      }
    });

  }, { scope: containerRef });

  // Animate room borders when activeRoom changes
  useGSAP(() => {
    // Reset all room borders
    Object.values(roomRectIds).forEach((rectId) => {
      const rect = document.getElementById(rectId);
      if (rect) {
        gsap.to(rect, {
          attr: { 
            'stroke-width': 2,
            stroke: colors.terracotta
          },
          duration: 0.3,
          ease: 'power2.out'
        });
      }
    });

    // Highlight active room
    const activeRectId = roomRectIds[activeRoom];
    if (activeRectId) {
      const activeRect = document.getElementById(activeRectId);
      if (activeRect) {
        gsap.to(activeRect, {
          attr: { 
            'stroke-width': 4,
            stroke: colors.textAccent
          },
          duration: 0.3,
          ease: 'power2.out'
        });
      }
    }
  }, { scope: containerRef, dependencies: [activeRoom] });

  const handleRoomClick = (room) => {
    setActiveRoom(room.id);
    
    // Animate the hotspot
    gsap.to(`.hotspot-${room.id.replace(/\s+/g, '-')}`, {
      scale: 1.3,
      duration: 0.2,
      yoyo: true,
      repeat: 1
    });
  };

  const handleRoomNavigate = (room) => {
    if (onRoomSelect) {
      onRoomSelect(room.id);
    }
  };

  const handleCloseEnter = () => {
    gsap.to(closeRef.current, {
      rotation: 90,
      scale: 1.1,
      backgroundColor: 'rgba(245, 240, 235, 0.3)',
      duration: 0.4,
      ease: 'power2.out'
    });
  };

  const handleCloseLeave = () => {
    gsap.to(closeRef.current, {
      rotation: 0,
      scale: 1,
      backgroundColor: 'rgba(245, 240, 235, 0.15)',
      duration: 0.4,
      ease: 'power2.out'
    });
  };

  const handleCarouselItemEnter = (index) => {
    gsap.to(carouselItemsRef.current[index], {
      scale: 1.05,
      y: -4,
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.25)',
      duration: 0.15,
      ease: 'power2.out'
    });
  };

  const handleCarouselItemLeave = (index) => {
    gsap.to(carouselItemsRef.current[index], {
      scale: 1,
      y: 0,
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.15)',
      duration: 0.15,
      ease: 'power2.out'
    });
  };

  return (
    <div 
      ref={containerRef}
      className="min-h-screen w-full relative overflow-hidden"
      style={{ backgroundColor: colors.bg }}
    >
      {/* Google Fonts & Styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Marcellus&display=swap');
        
        .carousel-container {
          perspective: 1000px;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        
        .carousel-container::-webkit-scrollbar {
          display: none;
        }
        
        .carousel-item {
          transform-style: preserve-3d;
          transition: transform 0.15s ease, box-shadow 0.15s ease;
          opacity: 0;
          transform: translateY(15px) scale(0.95);
        }
        
        .carousel-item:hover {
          transform: translateY(-4px) rotateX(3deg) !important;
        }
        
        .floor-plan-hotspot {
          transition: all 0.3s ease;
        }
        
        .floor-plan-hotspot:hover {
          transform: translate(-50%, -50%) scale(1.2);
        }
        
        .room-label {
          opacity: 0;
          transform: translateY(5px);
          transition: all 0.3s ease;
        }
        
        .floor-plan-hotspot:hover .room-label {
          opacity: 1;
          transform: translateY(0);
        }

        .card-shine { 
          background: linear-gradient(125deg, transparent 30%, rgba(255,255,255,0.05) 45%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 55%, transparent 70%); 
          background-size: 300% 300%; 
          animation: cardShine 6s ease-in-out infinite; 
        }
        @keyframes cardShine { 
          0% { background-position: 200% 0; } 
          100% { background-position: -200% 0; } 
        }

        .mandala-svg { 
          filter: brightness(0) saturate(100%) invert(55%) sepia(30%) saturate(500%) hue-rotate(350deg) brightness(95%) contrast(90%);
        }
      `}</style>

      {/* ===== MANDALAS ===== */}

      {/* Center Mandala - Behind the card */}
      <div
        ref={mandalaCenterRef}
        className="fixed pointer-events-none"
        style={{
          left: "50%",
          top: "52%",
          transform: "translate(-50%, -50%)",
          zIndex: 5,
          opacity: 0,
          width: "min(75vw, 600px)",
          height: "min(75vw, 600px)",
        }}
      >
        <img
          src="/transparent_svg_mandala.svg"
          alt=""
          className="w-full h-full object-contain mandala-svg"
          style={{
            opacity: 0.25,
          }}
        />
      </div>

      {/* Left Edge Mandala - Right half visible */}
      <div
        ref={mandalaLeftRef}
        className="fixed pointer-events-none"
        style={{
          left: "0%",
          top: "50%",
          transform: "translateX(-50%) translateY(-50%)",
          transformOrigin: "center center",
          zIndex: 4,
          opacity: 0,
          width: "min(60vw, 400px)",
          height: "min(60vw, 400px)",
        }}
      >
        <img
          src="/transparent_svg_mandala.svg"
          alt=""
          className="w-full h-full object-contain mandala-svg"
          style={{
            opacity: 0.15,
          }}
        />
      </div>

      {/* Right Edge Mandala - Left half visible */}
      <div
        ref={mandalaRightRef}
        className="fixed pointer-events-none"
        style={{
          left: "100%",
          top: "50%",
          transform: "translateX(-50%) translateY(-50%)",
          transformOrigin: "center center",
          zIndex: 4,
          opacity: 0,
          width: "min(60vw, 400px)",
          height: "min(60vw, 400px)",
        }}
      >
        <img
          src="/transparent_svg_mandala.svg"
          alt=""
          className="w-full h-full object-contain mandala-svg"
          style={{
            opacity: 0.15,
          }}
        />
      </div>

      {/* ===== BACKGROUND LAYERS ===== */}

      {/* Background Glow */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
        <div
          className="absolute w-[300px] sm:w-[450px] md:w-[600px] h-[300px] sm:h-[450px] md:h-[600px] rounded-full"
          style={{
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            background: "radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, rgba(245, 240, 235, 0.05) 40%, transparent 70%)",
            filter: "blur(50px)",
            opacity: 0.4,
          }}
        />
      </div>

      {/* Warm Vignette */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 2,
          background: `radial-gradient(
            ellipse 80% 70% at 50% 50%,
            transparent 40%,
            rgba(100, 80, 65, 0.15) 70%,
            rgba(80, 60, 50, 0.25) 100%
          )`
        }}
      />

      {/* Subtle Pattern Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          zIndex: 3,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23f5f0eb'%3E%3Cpath d='M40 8 L46 20 L40 32 L34 20 Z'/%3E%3Cpath d='M40 48 L46 60 L40 72 L34 60 Z'/%3E%3Cpath d='M8 40 L20 34 L32 40 L20 46 Z'/%3E%3Cpath d='M48 40 L60 34 L72 40 L60 46 Z'/%3E%3Ccircle cx='40' cy='40' r='5'/%3E%3Ccircle cx='40' cy='40' r='12' fill='none' stroke='%23f5f0eb' stroke-width='1'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '80px 80px'
        }}
      />

      {/* ===== PARTICLES ===== */}
      <div 
        className="fixed inset-0 overflow-hidden pointer-events-none" 
        style={{ zIndex: 6 }}
      >
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            ref={addToParticles}
            className="absolute rounded-full"
            style={{ 
              width: `${3 + Math.random() * 3}px`,
              height: `${3 + Math.random() * 3}px`,
              backgroundColor: i % 2 === 0 ? colors.textPrimary : colors.textSecondary
            }}
          />
        ))}
      </div>

      {/* ===== HEADER ===== */}
      <header 
        className="absolute top-0 left-0 right-0 flex justify-between items-center px-6 md:px-10 py-5"
        style={{ zIndex: 20 }}
      >
        {/* Header bottom border */}
        <div 
          className="absolute bottom-0 left-6 right-6 md:left-10 md:right-10 h-px opacity-30"
          style={{
            background: `linear-gradient(90deg, transparent 0%, ${colors.textPrimary} 15%, ${colors.textSecondary} 50%, ${colors.textPrimary} 85%, transparent 100%)`
          }}
        />

        {/* Logo */}
        <div ref={logoRef} className="flex items-center gap-3" style={{ opacity: 0 }}>
          <div 
            className="w-10 h-10 md:w-12 md:h-12" 
            style={{ filter: `drop-shadow(0 2px 8px ${colors.glowPrimary})` }}
          >
            <svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="28" cy="28" r="26" stroke={colors.textPrimary} strokeWidth="1" opacity="0.6"/>
              <circle cx="28" cy="28" r="20" stroke={colors.textPrimary} strokeWidth="0.5" opacity="0.3"/>
              <path d="M28 4C28 4 16 12 16 28C16 44 28 52 28 52" stroke={colors.textPrimary} strokeWidth="2" strokeLinecap="round" fill="none"/>
              <path d="M28 4C28 4 40 12 40 28C40 44 28 52 28 52" stroke={colors.textPrimary} strokeWidth="2" strokeLinecap="round" fill="none"/>
              <path d="M28 10C28 10 21 16 21 28C21 40 28 46 28 46" stroke={colors.textPrimary} strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.5"/>
              <path d="M28 10C28 10 35 16 35 28C35 40 28 46 28 46" stroke={colors.textPrimary} strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.5"/>
              <line x1="28" y1="4" x2="28" y2="52" stroke={colors.textPrimary} strokeWidth="0.75" opacity="0.4"/>
              <circle cx="28" cy="4" r="2.5" fill={colors.textPrimary}/>
              <circle cx="28" cy="52" r="2.5" fill={colors.textPrimary}/>
              <circle cx="28" cy="28" r="3" fill={colors.textAccent} opacity="0.8"/>
            </svg>
          </div>
          <div className="flex flex-col">
            <span 
              className="text-lg md:text-xl font-semibold uppercase" 
              style={{ 
                fontFamily: "'Cinzel', serif", 
                color: colors.textPrimary, 
                letterSpacing: '0.2em',
              }}
            >
              Rudraksh
            </span>
            <span 
              className="text-[9px] md:text-[10px] uppercase" 
              style={{ 
                fontFamily: "'Marcellus', serif", 
                color: colors.textSecondary, 
                letterSpacing: '0.25em' 
              }}
            >
              Apartments
            </span>
          </div>
        </div>

        {/* Close Button */}
        <button
          ref={closeRef}
          onClick={onClose}
          onMouseEnter={handleCloseEnter}
          onMouseLeave={handleCloseLeave}
          className="w-10 h-10 md:w-11 md:h-11 flex items-center justify-center rounded-full cursor-pointer border"
          style={{ 
            backgroundColor: 'rgba(245, 240, 235, 0.15)',
            borderColor: 'rgba(245, 240, 235, 0.3)',
            backdropFilter: 'blur(10px)',
            opacity: 0
          }}
          aria-label="Close"
        >
          <svg 
            viewBox="0 0 24 24" 
            fill="none" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            className="w-4 h-4 md:w-5 md:h-5" 
            style={{ stroke: colors.textPrimary }}
          >
            <line x1="6" y1="6" x2="18" y2="18" />
            <line x1="6" y1="18" x2="18" y2="6" />
          </svg>
        </button>
      </header>

      {/* ===== FLOOR PLAN ===== */}
      <div 
        ref={floorPlanRef}
        className="absolute top-[42%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl xl:max-w-6xl px-4 sm:px-8 md:px-16"
        style={{ zIndex: 10, opacity: 0 }}
      >
        {/* Floor Plan Container - Matching HomePage card style */}
        <div 
          className="relative w-full rounded-2xl overflow-hidden"
          style={{ 
            background: 'rgba(125, 102, 88, 0.35)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            border: '1px solid rgba(245, 240, 235, 0.12)',
            boxShadow: '0 25px 70px rgba(0, 0, 0, 0.15)',
          }}
        >
          {/* Shine effect overlay */}
          <div className="absolute inset-0 card-shine rounded-2xl pointer-events-none" />

          {/* Card Content */}
          <div className="relative px-4 sm:px-6 md:px-10 lg:px-12 py-3 sm:py-4 md:py-5">
            
            {/* Top decorative element */}
            <div className="flex justify-center mb-2">
              <svg viewBox="0 0 150 40" fill="none" className="w-24 h-6 sm:w-32 sm:h-8">
                <path d="M0,20 Q37.5,5 75,20 Q112.5,35 150,20" stroke={colors.textPrimary} strokeWidth="0.5" fill="none" opacity="0.4"/>
                <circle cx="75" cy="20" r="4" fill="none" stroke={colors.textPrimary} strokeWidth="0.5" opacity="0.3"/>
                <circle cx="75" cy="20" r="2" fill={colors.textAccent} opacity="0.5"/>
              </svg>
            </div>

            {/* Floor Plan Title */}
            <div className="text-center mb-2">
              <h2 
                className="text-xl sm:text-2xl md:text-3xl font-light" 
                style={{ 
                  fontFamily: "'Cinzel', serif", 
                  letterSpacing: '0.08em',
                  color: colors.textPrimary,
                }}
              >
                4BHK FLOOR PLAN
              </h2>
              <p 
                className="text-xs sm:text-sm mt-2 italic" 
                style={{ 
                  fontFamily: "'Cormorant Garamond', serif", 
                  color: colors.textSecondary
                }}
              >
                Click on a room to highlight • Double-click to explore
              </p>
            </div>

            {/* SVG Floor Plan */}
            <div className="relative w-full rounded-xl overflow-hidden" style={{ background: 'rgba(250, 246, 240, 0.95)' }}>
              <svg viewBox="0 0 400 200" className="w-full h-auto">
                {/* Background */}
                <rect x="0" y="0" width="400" height="200" fill="#faf6f0" />
                
                {/* Floor plan grid/pattern */}
                <defs>
                  <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e8dcc8" strokeWidth="0.5"/>
                  </pattern>
                </defs>
                <rect x="0" y="0" width="400" height="200" fill="url(#grid)" opacity="0.5"/>
                
                {/* Rooms with IDs for animation - Scaled down heights */}
                {/* Arrival Space */}
                <rect id="room-arrival" x="20" y="15" width="70" height="70" fill="#f5ebe0" stroke={colors.terracotta} strokeWidth="2" rx="3"/>
                <text x="55" y="45" fontSize="8" fill={colors.terracottaDark} textAnchor="middle" style={{ fontFamily: 'Marcellus, serif' }}>Arrival</text>
                <text x="55" y="57" fontSize="6" fill={colors.terracotta} textAnchor="middle">Space</text>
                
                {/* Family Lounge / Living */}
                <rect id="room-living" x="100" y="15" width="100" height="70" fill="#f5ebe0" stroke={colors.terracotta} strokeWidth="2" rx="3"/>
                <text x="150" y="45" fontSize="8" fill={colors.terracottaDark} textAnchor="middle" style={{ fontFamily: 'Marcellus, serif' }}>Family</text>
                <text x="150" y="57" fontSize="6" fill={colors.terracotta} textAnchor="middle">Lounge</text>
                {/* Sofa indicator */}
                <rect x="115" y="62" width="30" height="10" fill="none" stroke={colors.terracottaLight} strokeWidth="1" rx="2"/>
                <rect x="155" y="62" width="30" height="10" fill="none" stroke={colors.terracottaLight} strokeWidth="1" rx="2"/>
                
                {/* Private Retreat / Bedroom */}
                <rect id="room-bedroom" x="210" y="15" width="80" height="70" fill="#f5ebe0" stroke={colors.terracotta} strokeWidth="2" rx="3"/>
                <text x="250" y="45" fontSize="8" fill={colors.terracottaDark} textAnchor="middle" style={{ fontFamily: 'Marcellus, serif' }}>Private</text>
                <text x="250" y="57" fontSize="6" fill={colors.terracotta} textAnchor="middle">Retreat</text>
                {/* Bed indicator */}
                <rect x="225" y="28" width="25" height="35" fill="none" stroke={colors.terracottaLight} strokeWidth="1" rx="2"/>
                
                {/* Kids Bedroom 1 */}
                <rect id="room-kids1" x="300" y="15" width="80" height="70" fill="#f5ebe0" stroke={colors.terracotta} strokeWidth="2" rx="3"/>
                <text x="340" y="42" fontSize="7" fill={colors.terracottaDark} textAnchor="middle" style={{ fontFamily: 'Marcellus, serif' }}>Kids</text>
                <text x="340" y="54" fontSize="6" fill={colors.terracotta} textAnchor="middle">Room 1</text>
                {/* 360 indicator */}
                <circle cx="340" cy="68" r="7" fill="none" stroke={colors.terracotta} strokeWidth="1"/>
                <text x="340" y="71" fontSize="5" fill={colors.terracotta} textAnchor="middle">360°</text>
                
                {/* Open-Air Escape / Balcony */}
                <rect id="room-balcony" x="20" y="95" width="70" height="70" fill="#e8ebe0" stroke={colors.terracotta} strokeWidth="2" rx="3"/>
                <text x="55" y="125" fontSize="8" fill={colors.terracottaDark} textAnchor="middle" style={{ fontFamily: 'Marcellus, serif' }}>Open-Air</text>
                <text x="55" y="137" fontSize="6" fill={colors.terracotta} textAnchor="middle">Escape</text>
                {/* Plants */}
                <circle cx="35" cy="150" r="4" fill="none" stroke={colors.terracottaDark} strokeWidth="1" opacity="0.5"/>
                <circle cx="75" cy="150" r="4" fill="none" stroke={colors.terracottaDark} strokeWidth="1" opacity="0.5"/>
                
                {/* Heart of the Home / Kitchen */}
                <rect id="room-kitchen" x="100" y="95" width="100" height="70" fill="#f5ebe0" stroke={colors.terracotta} strokeWidth="2" rx="3"/>
                <text x="150" y="122" fontSize="8" fill={colors.terracottaDark} textAnchor="middle" style={{ fontFamily: 'Marcellus, serif' }}>Heart of</text>
                <text x="150" y="134" fontSize="6" fill={colors.terracotta} textAnchor="middle">the Home</text>
                {/* Kitchen counter */}
                <rect x="105" y="148" width="90" height="8" fill="none" stroke={colors.terracottaLight} strokeWidth="1" rx="1"/>
                
                {/* Bathing Retreat */}
                <rect x="210" y="95" width="45" height="35" fill="#ebe8e0" stroke={colors.terracotta} strokeWidth="2" rx="3"/>
                <text x="232" y="115" fontSize="6" fill={colors.terracottaDark} textAnchor="middle" style={{ fontFamily: 'Marcellus, serif' }}>Bath</text>
                
                {/* Kids Bedroom 2 */}
                <rect id="room-kids2" x="300" y="95" width="80" height="85" fill="#f5ebe0" stroke={colors.terracotta} strokeWidth="2" rx="3"/>
                <text x="340" y="132" fontSize="7" fill={colors.terracottaDark} textAnchor="middle" style={{ fontFamily: 'Marcellus, serif' }}>Kids</text>
                <text x="340" y="144" fontSize="6" fill={colors.terracotta} textAnchor="middle">Room 2</text>
                {/* 360 indicator */}
                <circle cx="340" cy="160" r="7" fill="none" stroke={colors.terracotta} strokeWidth="1"/>
                <text x="340" y="163" fontSize="5" fill={colors.terracotta} textAnchor="middle">360°</text>
                
                {/* Hallway / corridor */}
                <rect x="210" y="135" width="80" height="45" fill="#faf6f0" stroke={colors.terracotta} strokeWidth="1" rx="2" strokeDasharray="4,2"/>
                
                {/* Doors */}
                <line x1="90" y1="45" x2="100" y2="45" stroke={colors.terracotta} strokeWidth="3"/>
                <line x1="200" y1="45" x2="210" y2="45" stroke={colors.terracotta} strokeWidth="3"/>
                <line x1="290" y1="45" x2="300" y2="45" stroke={colors.terracotta} strokeWidth="3"/>
                <line x1="150" y1="85" x2="150" y2="95" stroke={colors.terracotta} strokeWidth="3"/>
                
                {/* Compass - smaller and repositioned */}
                <g transform="translate(375, 185)">
                  <circle cx="0" cy="0" r="12" fill="rgba(250, 245, 238, 0.9)" stroke={colors.terracotta} strokeWidth="1"/>
                  <text x="0" y="-3" fontSize="7" fill={colors.terracotta} textAnchor="middle" fontWeight="bold">N</text>
                  <path d="M0,-8 L2,4 L0,1 L-2,4 Z" fill={colors.terracotta}/>
                </g>
              </svg>
              
              {/* Interactive Hotspots */}
              {rooms.map((room) => (
                <div
                  key={room.id}
                  className={`floor-plan-hotspot hotspot-${room.id.replace(/\s+/g, '-')} absolute cursor-pointer`}
                  style={{
                    left: `${room.x}%`,
                    top: `${room.y}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                  onClick={() => handleRoomClick(room)}
                  onDoubleClick={() => handleRoomNavigate(room)}
                >
                  <div 
                    className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${
                      activeRoom === room.id 
                        ? 'scale-110' 
                        : 'hover:scale-105'
                    }`}
                    style={{
                      backgroundColor: activeRoom === room.id ? colors.textAccent : 'rgba(255,255,255,0.9)',
                      boxShadow: activeRoom === room.id 
                        ? `0 0 20px ${colors.textAccent}, 0 0 40px rgba(255,255,255,0.4)` 
                        : `0 2px 10px rgba(0,0,0,0.15)`,
                      border: `2px solid ${activeRoom === room.id ? colors.textAccent : colors.terracotta}`
                    }}
                  >
                    <div 
                      className="w-2 h-2 rounded-full" 
                      style={{ backgroundColor: activeRoom === room.id ? colors.terracotta : colors.terracotta }}
                    />
                  </div>
                  
                  {/* Room label tooltip */}
                  <div 
                    className="room-label absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap z-10"
                    style={{
                      background: 'rgba(125, 102, 88, 0.95)',
                      backdropFilter: 'blur(10px)',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                      border: '1px solid rgba(245, 240, 235, 0.2)'
                    }}
                  >
                    <p className="text-xs font-medium" style={{ fontFamily: "'Marcellus', serif", color: colors.textPrimary }}>{room.name}</p>
                    <p className="text-[10px]" style={{ color: colors.textSecondary }}>{room.description}</p>
                    <p className="text-[9px] mt-1" style={{ color: colors.textSecondary, opacity: 0.7 }}>Double-click to view</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom decorative element */}
            <div className="flex justify-center mt-2">
              <svg viewBox="0 0 150 30" fill="none" className="w-28 h-6 sm:w-36 sm:h-7">
                <path d="M0,15 L55,15" stroke={colors.textPrimary} strokeWidth="0.5" opacity="0.3"/>
                <path d="M95,15 L150,15" stroke={colors.textPrimary} strokeWidth="0.5" opacity="0.3"/>
                <polygon points="75,5 85,15 75,25 65,15" stroke={colors.textPrimary} strokeWidth="0.5" fill="none" opacity="0.3"/>
                <circle cx="75" cy="15" r="2" fill={colors.textPrimary} opacity="0.4"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* ===== BOTTOM CAROUSEL ===== */}
      <div 
        className="absolute bottom-0 left-0 right-0 px-4 md:px-10 pb-6"
        style={{ zIndex: 20 }}
      >
        <div className="flex items-end justify-between">
          
          {/* Sound Controls */}
          <div ref={soundControlsRef} className="flex items-center gap-3" style={{ opacity: 0 }}>
            <button 
              onClick={() => setIsMuted(!isMuted)}
              className="w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 hover:scale-110"
              style={{ 
                backgroundColor: 'rgba(245, 240, 235, 0.15)', 
                backdropFilter: 'blur(10px)',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                border: '1px solid rgba(245, 240, 235, 0.2)'
              }}
            >
              {isMuted ? (
                <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke={colors.textSecondary} strokeWidth="2">
                  <path d="M11 5L6 9H2v6h4l5 4V5z" />
                  <line x1="23" y1="9" x2="17" y2="15" />
                  <line x1="17" y1="9" x2="23" y2="15" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke={colors.textSecondary} strokeWidth="2">
                  <path d="M11 5L6 9H2v6h4l5 4V5z" />
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                </svg>
              )}
            </button>
            <span 
              className="text-[8px] uppercase tracking-[0.2em]"
              style={{ fontFamily: "'Marcellus', serif", color: colors.textSecondary }}
            >
              {isMuted ? "Unmute" : "Sound"}
            </span>
          </div>

          {/* Room Carousel */}
          <div 
            ref={carouselRef}
            className="carousel-container flex items-center gap-3 md:gap-4 px-5 py-4 rounded-2xl overflow-x-auto max-w-[75vw] md:max-w-none"
            style={{ 
              background: 'rgba(125, 102, 88, 0.4)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
              border: '1px solid rgba(245, 240, 235, 0.1)',
              opacity: 0
            }}
          >
            {rooms.map((room, index) => (
              <div
                key={room.id}
                ref={addToCarouselItems}
                onClick={() => handleRoomClick(room)}
                onDoubleClick={() => handleRoomNavigate(room)}
                onMouseEnter={() => handleCarouselItemEnter(index)}
                onMouseLeave={() => handleCarouselItemLeave(index)}
                className="carousel-item flex-shrink-0 cursor-pointer rounded-xl overflow-hidden relative"
                style={{
                  width: '110px',
                  height: '75px',
                  boxShadow: activeRoom === room.id 
                    ? `0 6px 20px rgba(0,0,0,0.3), 0 0 0 2px ${colors.textAccent}` 
                    : '0 4px 15px rgba(0,0,0,0.15)',
                  transformStyle: 'preserve-3d',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                }}
              >
                {/* Background Image */}
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-300"
                  style={{ 
                    backgroundImage: `url(${room.image})`,
                    transform: activeRoom === room.id ? 'scale(1.1)' : 'scale(1)'
                  }}
                />
                {/* Overlay */}
                <div 
                  className="absolute inset-0 transition-all duration-300"
                  style={{
                    background: activeRoom === room.id 
                      ? 'linear-gradient(to top, rgba(245, 240, 235, 0.9) 0%, rgba(245, 240, 235, 0.3) 50%, transparent 100%)' 
                      : 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)'
                  }}
                />
                {/* Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-end p-2">
                  {/* 360 indicator */}
                  {room.is360 && (
                    <div 
                      className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center"
                      style={{ 
                        backgroundColor: 'rgba(245, 240, 235, 0.9)',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
                      }}
                    >
                      <svg viewBox="0 0 24 24" fill="none" className="w-3 h-3" stroke={colors.terracotta} strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M2 12h20" />
                      </svg>
                    </div>
                  )}
                  <span 
                    className="text-[10px] md:text-[11px] font-medium text-center leading-tight"
                    style={{ 
                      fontFamily: "'Marcellus', serif",
                      textShadow: activeRoom === room.id ? 'none' : '0 1px 3px rgba(0,0,0,0.4)',
                      color: activeRoom === room.id ? colors.terracottaDark : colors.textPrimary
                    }}
                  >
                    {room.id}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Placeholder for symmetry */}
          <div className="w-10" />
        </div>
      </div>

      {/* Corner accents */}
      <div 
        className="absolute top-20 left-6 w-16 h-16 pointer-events-none opacity-20" 
        style={{ zIndex: 10 }}
      >
        <svg viewBox="0 0 60 60" fill="none">
          <path d="M0,60 L0,20 Q0,0 20,0 L60,0" stroke={colors.textPrimary} strokeWidth="1.5" fill="none"/>
          <circle cx="8" cy="8" r="3" fill={colors.textSecondary}/>
        </svg>
      </div>
      <div 
        className="absolute top-20 right-6 w-16 h-16 pointer-events-none opacity-20" 
        style={{ zIndex: 10 }}
      >
        <svg viewBox="0 0 60 60" fill="none">
          <path d="M60,60 L60,20 Q60,0 40,0 L0,0" stroke={colors.textPrimary} strokeWidth="1.5" fill="none"/>
          <circle cx="52" cy="8" r="3" fill={colors.textSecondary}/>
        </svg>
      </div>

      {/* Bottom decorative line */}
      <div 
        className="absolute bottom-0 left-0 right-0 pointer-events-none" 
        style={{ zIndex: 15 }}
      >
        <div 
          className="h-px mx-6 md:mx-10 opacity-20"
          style={{
            background: `linear-gradient(90deg, transparent 0%, ${colors.textPrimary} 20%, ${colors.textSecondary} 50%, ${colors.textPrimary} 80%, transparent 100%)`
          }}
        />
      </div>
    </div>
  );
};

export default FloorPlanPage;