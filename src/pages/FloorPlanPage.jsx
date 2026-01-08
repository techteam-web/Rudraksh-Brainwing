import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

const FloorPlanPage = ({ onClose, onRoomSelect, initialRoom = null }) => {
  const containerRef = useRef(null);
  const logoRef = useRef(null);
  const closeRef = useRef(null);
  const floorPlanRef = useRef(null);
  const carouselRef = useRef(null);
  const carouselItemsRef = useRef([]);
  const soundControlsRef = useRef(null);
  const particlesRef = useRef([]);

  const [activeRoom, setActiveRoom] = useState(initialRoom || 'Living');
  const [isMuted, setIsMuted] = useState(false);

  // Room data with descriptions and positions on floor plan
  const rooms = [
    { id: 'Arrival', name: 'Arrival Space', description: 'Grand entrance foyer', x: 18, y: 22, image: '/arrival.jpg' },
    { id: 'Living', name: 'Family Lounge', description: 'Spacious living area', x: 45, y: 28, image: '/livingroom.jpg' },
    { id: 'Kitchen', name: 'Heart of the Home', description: 'Modern culinary space', x: 45, y: 58, image: '/kitchen.jpg' },
    { id: 'Bedroom', name: 'Private Retreat', description: 'Master bedroom suite', x: 72, y: 28, image: '/bedroom.jpg' },
    { id: 'Balcony', name: 'Open-Air Escape', description: 'Scenic outdoor space', x: 18, y: 58, image: '/balcony.jpg' },
    { id: 'Kids Bedroom 1', name: 'Kids Room 1', description: 'Playful kids space', x: 88, y: 22, image: '/marzipano/tiles/0-kids_bedroom_final_01/preview.jpg', is360: true },
    { id: 'Kids Bedroom 2', name: 'Kids Room 2', description: 'Cozy kids retreat', x: 88, y: 65, image: '/marzipano/tiles/1-kids_bedroom_final_02/preview.jpg', is360: true },
  ];

  const addToParticles = (el) => {
    if (el && !particlesRef.current.includes(el)) {
      particlesRef.current.push(el);
    }
  };

  useEffect(() => {
    // Reset carouselItemsRef on mount
    carouselItemsRef.current = [];
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(logoRef.current, { opacity: 0, x: -50 });
      gsap.set(closeRef.current, { opacity: 0, x: 50 });
      gsap.set(floorPlanRef.current, { opacity: 0, scale: 0.9 });
      gsap.set(carouselRef.current, { opacity: 0, y: 30 });
      gsap.set(soundControlsRef.current, { opacity: 0, x: -30 });

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' }, delay: 0.2 });

      tl.to(floorPlanRef.current, {
        opacity: 1,
        scale: 1,
        duration: 1,
        ease: 'power2.out'
      })
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

      // Floating sand particles
      particlesRef.current.forEach((particle, i) => {
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

    }, containerRef);

    return () => ctx.revert();
  }, []);

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
      backgroundColor: '#c17f59',
      duration: 0.4,
      ease: 'power2.out'
    });
  };

  const handleCloseLeave = () => {
    gsap.to(closeRef.current, {
      rotation: 0,
      scale: 1,
      backgroundColor: 'rgba(255, 255, 255, 0.3)',
      duration: 0.4,
      ease: 'power2.out'
    });
  };

  const handleCarouselItemEnter = (index) => {
    gsap.to(carouselItemsRef.current[index], {
      scale: 1.05,
      y: -4,
      boxShadow: '0 10px 25px rgba(193, 127, 89, 0.25)',
      duration: 0.15,
      ease: 'power2.out'
    });
  };

  const handleCarouselItemLeave = (index) => {
    gsap.to(carouselItemsRef.current[index], {
      scale: 1,
      y: 0,
      boxShadow: '0 4px 15px rgba(193, 127, 89, 0.12)',
      duration: 0.15,
      ease: 'power2.out'
    });
  };

  const addToCarouselItems = (el) => {
    if (el && !carouselItemsRef.current.includes(el)) {
      carouselItemsRef.current.push(el);
    }
  };

  return (
    <div 
      ref={containerRef}
      className="min-h-screen w-full relative overflow-hidden"
      style={{ backgroundColor: '#f0e4d6' }}
    >
      {/* Google Fonts */}
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
      `}</style>

      {/* ============================================
          LAYER 1: Background Gradient (z-index: 1)
          ============================================ */}
      <div 
        className="absolute inset-0"
        style={{
          zIndex: 1,
          background: `
            radial-gradient(ellipse 120% 80% at 50% 20%, rgba(232, 196, 160, 0.4) 0%, transparent 50%),
            radial-gradient(ellipse 100% 100% at 100% 0%, rgba(193, 127, 89, 0.15) 0%, transparent 40%),
            radial-gradient(ellipse 80% 100% at 0% 100%, rgba(212, 165, 116, 0.12) 0%, transparent 40%),
            radial-gradient(ellipse 60% 50% at 50% 100%, rgba(166, 93, 63, 0.1) 0%, transparent 50%),
            linear-gradient(165deg, #f0e4d6 0%, #e5d5c0 25%, #dcc9ae 50%, #e2cdb2 75%, #d8c4a5 100%)
          `
        }}
      />

      {/* ============================================
          LAYER 2: Warm Vignette (z-index: 2)
          ============================================ */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 2,
          background: `radial-gradient(
            ellipse 80% 70% at 50% 50%,
            transparent 40%,
            rgba(212, 180, 140, 0.15) 70%,
            rgba(193, 127, 89, 0.12) 85%,
            rgba(166, 93, 63, 0.18) 100%
          )`
        }}
      />

      {/* ============================================
          LAYER 3: Decorative Patterns (z-index: 3)
          ============================================ */}

      {/* Rajasthani Pattern Overlay - Subtle */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          zIndex: 3,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23a65d3f'%3E%3Cpath d='M40 8 L46 20 L40 32 L34 20 Z'/%3E%3Cpath d='M40 48 L46 60 L40 72 L34 60 Z'/%3E%3Cpath d='M8 40 L20 34 L32 40 L20 46 Z'/%3E%3Cpath d='M48 40 L60 34 L72 40 L60 46 Z'/%3E%3Ccircle cx='40' cy='40' r='5'/%3E%3Ccircle cx='40' cy='40' r='12' fill='none' stroke='%23a65d3f' stroke-width='1'/%3E%3Ccircle cx='40' cy='40' r='18' fill='none' stroke='%23a65d3f' stroke-width='0.5' opacity='0.5'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '80px 80px'
        }}
      />

      {/* Mandala Pattern Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          zIndex: 3,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23c17f59' stroke-width='1'%3E%3Ccircle cx='100' cy='100' r='40'/%3E%3Ccircle cx='100' cy='100' r='60'/%3E%3Ccircle cx='100' cy='100' r='80'/%3E%3Cpath d='M100 20 Q120 100 100 180 Q80 100 100 20'/%3E%3Cpath d='M20 100 Q100 80 180 100 Q100 120 20 100'/%3E%3Cpath d='M35 35 Q100 70 165 35 Q130 100 165 165 Q100 130 35 165 Q70 100 35 35'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px'
        }}
      />

      {/* Noise texture overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{
          zIndex: 3,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
        }}
      />

      {/* Rajasthani Arch Patterns - Left */}
      <div 
        className="fixed left-0 top-0 w-32 h-full pointer-events-none opacity-[0.06]"
        style={{
          zIndex: 3,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='150' viewBox='0 0 100 150' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 0 Q0 50 0 100 L0 150 L100 150 L100 100 Q100 50 50 0Z' fill='none' stroke='%23c17f59' stroke-width='2'/%3E%3Cpath d='M50 20 Q15 60 15 100 L15 130 L85 130 L85 100 Q85 60 50 20Z' fill='none' stroke='%23c17f59' stroke-width='1'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat-y',
          backgroundSize: '100px 150px'
        }}
      />

      {/* Rajasthani Arch Patterns - Right */}
      <div 
        className="fixed right-0 top-0 w-32 h-full pointer-events-none opacity-[0.06]"
        style={{
          zIndex: 3,
          transform: 'scaleX(-1)',
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='150' viewBox='0 0 100 150' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 0 Q0 50 0 100 L0 150 L100 150 L100 100 Q100 50 50 0Z' fill='none' stroke='%23c17f59' stroke-width='2'/%3E%3Cpath d='M50 20 Q15 60 15 100 L15 130 L85 130 L85 100 Q85 60 50 20Z' fill='none' stroke='%23c17f59' stroke-width='1'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat-y',
          backgroundSize: '100px 150px'
        }}
      />

      {/* ============================================
          LAYER 4: Sand Particles (z-index: 4)
          ============================================ */}
      <div 
        className="fixed inset-0 overflow-hidden pointer-events-none" 
        style={{ zIndex: 4 }}
      >
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            ref={addToParticles}
            className="absolute rounded-full"
            style={{ 
              width: `${3 + Math.random() * 3}px`,
              height: `${3 + Math.random() * 3}px`,
              backgroundColor: i % 2 === 0 ? '#c17f59' : '#d4a574'
            }}
          />
        ))}
      </div>

      {/* ============================================
          LAYER 9: Premium Top Navbar Gradient (z-index: 9)
          ============================================ */}
      <div
        className="absolute top-0 left-0 right-0 pointer-events-none"
        style={{
          zIndex: 9,
          height: "180px",
          background: `
            linear-gradient(
              to bottom,
              rgba(227, 206, 183, 1) 0%,
              rgba(227, 206, 183, 0.98) 8%,
              rgba(229, 209, 187, 0.94) 18%,
              rgba(231, 212, 191, 0.85) 28%,
              rgba(233, 215, 195, 0.72) 38%,
              rgba(235, 218, 199, 0.56) 48%,
              rgba(237, 221, 203, 0.38) 58%,
              rgba(239, 224, 207, 0.22) 68%,
              rgba(241, 227, 211, 0.1) 80%,
              rgba(243, 230, 215, 0.03) 92%,
              transparent 100%
            )
          `,
        }}
      />

      {/* ============================================
          LAYER 10+: UI Elements
          ============================================ */}

      {/* Header */}
      <header 
        className="absolute top-0 left-0 right-0 flex justify-between items-center px-6 md:px-10 py-5"
        style={{ zIndex: 20 }}
      >
        {/* Header bottom border */}
        <div 
          className="absolute bottom-0 left-6 right-6 md:left-10 md:right-10 h-px opacity-40"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, #c17f59 15%, #a65d3f 50%, #c17f59 85%, transparent 100%)'
          }}
        />

        {/* Logo */}
        <div ref={logoRef} className="flex items-center gap-3">
          <div 
            className="w-10 h-10 md:w-12 md:h-12" 
            style={{ filter: 'drop-shadow(0 2px 8px rgba(193, 127, 89, 0.3))' }}
          >
            <svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="28" cy="28" r="26" stroke="#c17f59" strokeWidth="1" opacity="0.6"/>
              <circle cx="28" cy="28" r="20" stroke="#c17f59" strokeWidth="0.5" opacity="0.3"/>
              <path d="M28 4C28 4 16 12 16 28C16 44 28 52 28 52" stroke="#d4a574" strokeWidth="2" strokeLinecap="round" fill="none"/>
              <path d="M28 4C28 4 40 12 40 28C40 44 28 52 28 52" stroke="#d4a574" strokeWidth="2" strokeLinecap="round" fill="none"/>
              <path d="M28 10C28 10 21 16 21 28C21 40 28 46 28 46" stroke="#d4a574" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.5"/>
              <path d="M28 10C28 10 35 16 35 28C35 40 28 46 28 46" stroke="#d4a574" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.5"/>
              <line x1="28" y1="4" x2="28" y2="52" stroke="#d4a574" strokeWidth="0.75" opacity="0.4"/>
              <circle cx="28" cy="4" r="2.5" fill="#c17f59"/>
              <circle cx="28" cy="52" r="2.5" fill="#c17f59"/>
              <circle cx="28" cy="28" r="3" fill="#d4a574" opacity="0.8"/>
            </svg>
          </div>
          <div className="flex flex-col">
            <span 
              className="text-lg md:text-xl font-semibold uppercase" 
              style={{ 
                fontFamily: "'Cinzel', serif", 
                color: '#a65d3f', 
                letterSpacing: '0.2em',
                textShadow: '0 1px 2px rgba(255,255,255,0.5)'
              }}
            >
              Rudraksh
            </span>
            <span 
              className="text-[9px] md:text-[10px] uppercase" 
              style={{ 
                fontFamily: "'Marcellus', serif", 
                color: '#c17f59', 
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
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
            borderColor: '#c17f59'
          }}
          aria-label="Close"
        >
          <svg 
            viewBox="0 0 24 24" 
            fill="none" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            className="w-4 h-4 md:w-5 md:h-5" 
            style={{ stroke: '#a65d3f' }}
          >
            <line x1="6" y1="6" x2="18" y2="18" />
            <line x1="6" y1="18" x2="18" y2="6" />
          </svg>
        </button>
      </header>

      {/* Floor Plan */}
      <div 
        ref={floorPlanRef}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90vw] md:w-[70vw] lg:w-[60vw] max-w-4xl"
        style={{ zIndex: 10, marginTop: '-30px' }}
      >
        {/* Floor Plan Container */}
        <div 
          className="relative w-full rounded-2xl overflow-hidden"
          style={{ 
            background: `
              radial-gradient(ellipse 80% 60% at 50% 40%, rgba(255, 252, 248, 0.95) 0%, transparent 70%),
              linear-gradient(155deg, rgba(250, 245, 238, 0.98) 0%, rgba(245, 235, 224, 0.96) 50%, rgba(240, 228, 214, 0.94) 100%)
            `,
            boxShadow: `
              0 0 0 1px rgba(193, 127, 89, 0.2),
              0 4px 15px rgba(193, 127, 89, 0.1),
              0 15px 40px rgba(166, 93, 63, 0.15),
              0 30px 80px rgba(74, 55, 40, 0.2)
            `
          }}
        >
          <svg viewBox="0 0 400 280" className="w-full h-auto">
            {/* Background */}
            <rect x="0" y="0" width="400" height="280" fill="#faf6f0" />
            
            {/* Floor plan grid/pattern */}
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e8dcc8" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect x="0" y="0" width="400" height="280" fill="url(#grid)" opacity="0.5"/>
            
            {/* Rooms */}
            {/* Arrival Space */}
            <rect x="20" y="20" width="70" height="80" fill="#f5ebe0" stroke="#c17f59" strokeWidth="2" rx="3"/>
            <text x="55" y="55" fontSize="8" fill="#a65d3f" textAnchor="middle" style={{ fontFamily: 'Marcellus, serif' }}>Arrival</text>
            <text x="55" y="67" fontSize="6" fill="#c17f59" textAnchor="middle">Space</text>
            
            {/* Family Lounge / Living */}
            <rect x="100" y="20" width="100" height="80" fill="#f5ebe0" stroke="#c17f59" strokeWidth="2" rx="3"/>
            <text x="150" y="55" fontSize="8" fill="#a65d3f" textAnchor="middle" style={{ fontFamily: 'Marcellus, serif' }}>Family</text>
            <text x="150" y="67" fontSize="6" fill="#c17f59" textAnchor="middle">Lounge</text>
            {/* Sofa indicator */}
            <rect x="115" y="70" width="30" height="12" fill="none" stroke="#d4a574" strokeWidth="1" rx="2"/>
            <rect x="155" y="70" width="30" height="12" fill="none" stroke="#d4a574" strokeWidth="1" rx="2"/>
            
            {/* Private Retreat / Bedroom */}
            <rect x="210" y="20" width="80" height="80" fill="#f5ebe0" stroke="#c17f59" strokeWidth="2" rx="3"/>
            <text x="250" y="55" fontSize="8" fill="#a65d3f" textAnchor="middle" style={{ fontFamily: 'Marcellus, serif' }}>Private</text>
            <text x="250" y="67" fontSize="6" fill="#c17f59" textAnchor="middle">Retreat</text>
            {/* Bed indicator */}
            <rect x="225" y="35" width="25" height="40" fill="none" stroke="#d4a574" strokeWidth="1" rx="2"/>
            
            {/* Kids Bedroom 1 */}
            <rect x="300" y="20" width="80" height="80" fill="#f5ebe0" stroke="#c17f59" strokeWidth="2" rx="3"/>
            <text x="340" y="50" fontSize="7" fill="#a65d3f" textAnchor="middle" style={{ fontFamily: 'Marcellus, serif' }}>Kids</text>
            <text x="340" y="62" fontSize="6" fill="#c17f59" textAnchor="middle">Room 1</text>
            {/* 360 indicator */}
            <circle cx="340" cy="78" r="8" fill="none" stroke="#c17f59" strokeWidth="1"/>
            <text x="340" y="81" fontSize="5" fill="#c17f59" textAnchor="middle">360°</text>
            
            {/* Open-Air Escape / Balcony */}
            <rect x="20" y="110" width="70" height="80" fill="#e8ebe0" stroke="#c17f59" strokeWidth="2" rx="3"/>
            <text x="55" y="145" fontSize="8" fill="#a65d3f" textAnchor="middle" style={{ fontFamily: 'Marcellus, serif' }}>Open-Air</text>
            <text x="55" y="157" fontSize="6" fill="#c17f59" textAnchor="middle">Escape</text>
            {/* Plants */}
            <circle cx="35" cy="170" r="5" fill="none" stroke="#a65d3f" strokeWidth="1" opacity="0.5"/>
            <circle cx="75" cy="170" r="5" fill="none" stroke="#a65d3f" strokeWidth="1" opacity="0.5"/>
            
            {/* Heart of the Home / Kitchen */}
            <rect x="100" y="110" width="100" height="80" fill="#f5ebe0" stroke="#c17f59" strokeWidth="2" rx="3"/>
            <text x="150" y="140" fontSize="8" fill="#a65d3f" textAnchor="middle" style={{ fontFamily: 'Marcellus, serif' }}>Heart of</text>
            <text x="150" y="152" fontSize="6" fill="#c17f59" textAnchor="middle">the Home</text>
            {/* Kitchen counter */}
            <rect x="105" y="165" width="90" height="8" fill="none" stroke="#d4a574" strokeWidth="1" rx="1"/>
            
            {/* Bathing Retreat */}
            <rect x="210" y="110" width="45" height="40" fill="#ebe8e0" stroke="#c17f59" strokeWidth="2" rx="3"/>
            <text x="232" y="132" fontSize="6" fill="#a65d3f" textAnchor="middle" style={{ fontFamily: 'Marcellus, serif' }}>Bath</text>
            
            {/* Kids Bedroom 2 */}
            <rect x="300" y="110" width="80" height="100" fill="#f5ebe0" stroke="#c17f59" strokeWidth="2" rx="3"/>
            <text x="340" y="155" fontSize="7" fill="#a65d3f" textAnchor="middle" style={{ fontFamily: 'Marcellus, serif' }}>Kids</text>
            <text x="340" y="167" fontSize="6" fill="#c17f59" textAnchor="middle">Room 2</text>
            {/* 360 indicator */}
            <circle cx="340" cy="183" r="8" fill="none" stroke="#c17f59" strokeWidth="1"/>
            <text x="340" y="186" fontSize="5" fill="#c17f59" textAnchor="middle">360°</text>
            
            {/* Hallway / corridor */}
            <rect x="210" y="155" width="80" height="55" fill="#faf6f0" stroke="#c17f59" strokeWidth="1" rx="2" strokeDasharray="4,2"/>
            
            {/* Doors */}
            <line x1="90" y1="50" x2="100" y2="50" stroke="#c17f59" strokeWidth="3"/>
            <line x1="200" y1="50" x2="210" y2="50" stroke="#c17f59" strokeWidth="3"/>
            <line x1="290" y1="50" x2="300" y2="50" stroke="#c17f59" strokeWidth="3"/>
            <line x1="150" y1="100" x2="150" y2="110" stroke="#c17f59" strokeWidth="3"/>
            
            {/* Compass */}
            <g transform="translate(370, 250)">
              <circle cx="0" cy="0" r="15" fill="rgba(250, 245, 238, 0.9)" stroke="#c17f59" strokeWidth="1"/>
              <text x="0" y="-5" fontSize="8" fill="#c17f59" textAnchor="middle" fontWeight="bold">N</text>
              <path d="M0,-10 L3,5 L0,2 L-3,5 Z" fill="#c17f59"/>
            </g>
            
            {/* Scale */}
            <g transform="translate(20, 260)">
              <line x1="0" y1="0" x2="50" y2="0" stroke="#a65d3f" strokeWidth="1"/>
              <line x1="0" y1="-3" x2="0" y2="3" stroke="#a65d3f" strokeWidth="1"/>
              <line x1="50" y1="-3" x2="50" y2="3" stroke="#a65d3f" strokeWidth="1"/>
              <text x="25" y="12" fontSize="6" fill="#a65d3f" textAnchor="middle">5m</text>
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
                    ? 'bg-[#c17f59] scale-110' 
                    : 'bg-white/90 hover:bg-[#c17f59]/80'
                }`}
                style={{
                  boxShadow: activeRoom === room.id 
                    ? '0 0 20px rgba(193, 127, 89, 0.6)' 
                    : '0 2px 10px rgba(166, 93, 63, 0.25)',
                  border: '2px solid #faf5ef'
                }}
              >
                <div className={`w-2 h-2 rounded-full ${activeRoom === room.id ? 'bg-white' : 'bg-[#c17f59]'}`} />
              </div>
              
              {/* Room label tooltip */}
              <div 
                className="room-label absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap z-10"
                style={{
                  background: 'linear-gradient(155deg, rgba(250, 245, 238, 0.98) 0%, rgba(245, 235, 224, 0.96) 100%)',
                  boxShadow: '0 4px 15px rgba(166, 93, 63, 0.2)',
                  border: '1px solid rgba(193, 127, 89, 0.2)'
                }}
              >
                <p className="text-xs font-medium" style={{ fontFamily: "'Marcellus', serif", color: '#a65d3f' }}>{room.name}</p>
                <p className="text-[10px]" style={{ color: '#c17f59' }}>{room.description}</p>
                <p className="text-[9px] mt-1" style={{ color: '#d4a574' }}>Double-click to view</p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Floor Plan Title */}
        <div className="text-center mt-6">
          <h2 
            className="text-xl md:text-2xl font-medium" 
            style={{ 
              fontFamily: "'Cinzel', serif", 
              letterSpacing: '0.1em',
              color: '#a65d3f',
              textShadow: '0 1px 2px rgba(255,255,255,0.5)'
            }}
          >
            4BHK Floor Plan
          </h2>
          <p 
            className="text-sm mt-1" 
            style={{ 
              fontFamily: "'Cormorant Garamond', serif", 
              fontStyle: 'italic',
              color: '#c17f59'
            }}
          >
            Click on a room to highlight • Double-click to explore
          </p>
        </div>
      </div>

      {/* Bottom Carousel Navigation */}
      <div 
        className="absolute bottom-0 left-0 right-0 px-4 md:px-10 pb-6"
        style={{ zIndex: 20 }}
      >
        <div className="flex items-end justify-between">
          
          {/* Sound Controls */}
          <div ref={soundControlsRef} className="flex items-center gap-3">
            <button 
              onClick={() => setIsMuted(!isMuted)}
              className="w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 hover:scale-110"
              style={{ 
                backgroundColor: 'rgba(250, 245, 238, 0.85)', 
                backdropFilter: 'blur(10px)',
                boxShadow: '0 4px 15px rgba(166, 93, 63, 0.15)',
                border: '1px solid rgba(193, 127, 89, 0.2)'
              }}
            >
              {isMuted ? (
                <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="#a65d3f" strokeWidth="2">
                  <path d="M11 5L6 9H2v6h4l5 4V5z" />
                  <line x1="23" y1="9" x2="17" y2="15" />
                  <line x1="17" y1="9" x2="23" y2="15" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="#a65d3f" strokeWidth="2">
                  <path d="M11 5L6 9H2v6h4l5 4V5z" />
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                </svg>
              )}
            </button>
          </div>

          {/* Room Carousel - Matching MainPage style */}
          <div 
            ref={carouselRef}
            className="carousel-container flex items-center gap-3 md:gap-4 px-5 py-4 rounded-2xl overflow-x-auto max-w-[75vw] md:max-w-none"
            style={{ 
              background: `
                radial-gradient(ellipse 80% 60% at 50% 40%, rgba(255, 252, 248, 0.95) 0%, transparent 70%),
                linear-gradient(155deg, rgba(250, 245, 238, 0.92) 0%, rgba(245, 235, 224, 0.9) 50%, rgba(240, 228, 214, 0.88) 100%)
              `,
              backdropFilter: 'blur(12px)',
              boxShadow: `
                0 0 0 1px rgba(193, 127, 89, 0.15),
                0 4px 15px rgba(193, 127, 89, 0.1),
                0 10px 30px rgba(166, 93, 63, 0.12)
              `
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
                className={`carousel-item flex-shrink-0 cursor-pointer rounded-xl overflow-hidden relative`}
                style={{
                  width: '110px',
                  height: '75px',
                  boxShadow: activeRoom === room.id 
                    ? '0 6px 20px rgba(193, 127, 89, 0.3), 0 0 0 2px #c17f59' 
                    : '0 4px 15px rgba(193, 127, 89, 0.12)',
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
                      ? 'linear-gradient(to top, rgba(193, 127, 89, 0.85) 0%, rgba(193, 127, 89, 0.3) 50%, rgba(212, 165, 116, 0.1) 100%)' 
                      : 'linear-gradient(to top, rgba(74, 55, 40, 0.7) 0%, rgba(74, 55, 40, 0.3) 50%, rgba(212, 165, 116, 0.05) 100%)'
                  }}
                />
                {/* Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-end p-2">
                  {/* 360 indicator */}
                  {room.is360 && (
                    <div 
                      className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center"
                      style={{ 
                        backgroundColor: 'rgba(250, 245, 238, 0.9)',
                        boxShadow: '0 2px 6px rgba(166, 93, 63, 0.2)'
                      }}
                    >
                      <svg viewBox="0 0 24 24" fill="none" className="w-3 h-3" stroke="#c17f59" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M2 12h20" />
                      </svg>
                    </div>
                  )}
                  <span 
                    className="text-[10px] md:text-[11px] font-medium text-center leading-tight"
                    style={{ 
                      fontFamily: "'Marcellus', serif",
                      textShadow: '0 1px 3px rgba(0,0,0,0.4)',
                      color: '#faf6f0'
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

      {/* Corner accents - Warm tones */}
      <div 
        className="absolute top-20 left-6 w-16 h-16 pointer-events-none opacity-30" 
        style={{ zIndex: 10 }}
      >
        <svg viewBox="0 0 60 60" fill="none">
          <path d="M0,60 L0,20 Q0,0 20,0 L60,0" stroke="#c17f59" strokeWidth="1.5" fill="none"/>
          <circle cx="8" cy="8" r="3" fill="#d4a574"/>
        </svg>
      </div>
      <div 
        className="absolute top-20 right-6 w-16 h-16 pointer-events-none opacity-30" 
        style={{ zIndex: 10 }}
      >
        <svg viewBox="0 0 60 60" fill="none">
          <path d="M60,60 L60,20 Q60,0 40,0 L0,0" stroke="#c17f59" strokeWidth="1.5" fill="none"/>
          <circle cx="52" cy="8" r="3" fill="#d4a574"/>
        </svg>
      </div>

      {/* Bottom decorative line */}
      <div 
        className="absolute bottom-0 left-0 right-0 pointer-events-none" 
        style={{ zIndex: 15 }}
      >
        <div 
          className="h-px mx-6 md:mx-10 opacity-25"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, #c17f59 20%, #d4a574 50%, #c17f59 80%, transparent 100%)'
          }}
        />
      </div>
    </div>
  );
};

export default FloorPlanPage;