import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import PanoramaViewer from "../components/PanoramaViewer";

const MainPage = ({ onClose, onFloorPlanClick, initialRoom }) => {
  const containerRef = useRef(null);
  const headerRef = useRef(null);
  const logoRef = useRef(null);
  const closeRef = useRef(null);
  const imageRef = useRef(null);
  const overlayRef = useRef(null);
  const navRef = useRef(null);
  const navItemsRef = useRef([]);
  const miniMapRef = useRef(null);
  const soundControlsRef = useRef(null);
  const vignetteRef = useRef(null);
  const particlesRef = useRef([]);

  // --- NEW: Refs for Arrows ---
  const leftArrowRef = useRef(null);
  const rightArrowRef = useRef(null);

  // --- NEW: Ref for Mobile Floor Plan Button ---
  const mobileFloorPlanRef = useRef(null);

  const [activeRoom, setActiveRoom] = useState(initialRoom || "Living");
  const [isMuted, setIsMuted] = useState(false);

  const rooms = [
    { id: "Arrival", image: "/arrival.jpg" },
    { id: "Living", image: "/livingroom.jpg" },
    { id: "Kitchen", image: "/kitchen.jpg" },
    { id: "Bedroom", image: "/bedroom.jpg" },
    { id: "Balcony", image: "/balcony.jpg" },
    {
      id: "Kids Bedroom 1",
      image: "/marzipano/tiles/0-kids_bedroom_final_01/preview.jpg",
      is360: true,
    },
    {
      id: "Kids Bedroom 2",
      image: "/marzipano/tiles/1-kids_bedroom_final_02/preview.jpg",
      is360: true,
    },
  ];

  // Room images mapping (for static images)
  const roomImages = {
    Arrival: "/arrival.jpg",
    Living: "/livingroom.jpg",
    Kitchen: "/kitchen.jpg",
    Bedroom: "/bedroom.jpg",
    Balcony: "/balcony.jpg",
  };

  // 360 panorama rooms mapping
  const panoramaRooms = {
    "Kids Bedroom 1": "kids-bedroom-1",
    "Kids Bedroom 2": "kids-bedroom-2",
  };

  // Check if current room is a panorama
  const isPanorama = (roomId) => roomId in panoramaRooms;

  // Room descriptions for the mini-map highlight
  const roomHighlights = {
    Arrival: { x: 14, y: 23 },
    Living: { x: 37, y: 23 },
    Kitchen: { x: 37, y: 59 },
    Bedroom: { x: 60, y: 23 },
    Balcony: { x: 14, y: 59 },
    "Kids Bedroom 1": { x: 84, y: 24 },
    "Kids Bedroom 2": { x: 84, y: 68 },
  };

  const addToParticles = (el) => {
    if (el && !particlesRef.current.includes(el)) {
      particlesRef.current.push(el);
    }
  };

  // --- NEW: Navigation Logic ---
  const handleNextRoom = () => {
    const currentIndex = rooms.findIndex((r) => r.id === activeRoom);
    const nextIndex = (currentIndex + 1) % rooms.length;
    handleRoomChange(rooms[nextIndex].id);
    
    // Micro-interaction click pulse
    if (rightArrowRef.current) {
        gsap.fromTo(rightArrowRef.current, { scale: 0.9 }, { scale: 1, duration: 0.3, ease: "back.out(3)" });
    }
  };

  const handlePrevRoom = () => {
    const currentIndex = rooms.findIndex((r) => r.id === activeRoom);
    const prevIndex = (currentIndex - 1 + rooms.length) % rooms.length;
    handleRoomChange(rooms[prevIndex].id);

    // Micro-interaction click pulse
    if (leftArrowRef.current) {
        gsap.fromTo(leftArrowRef.current, { scale: 0.9 }, { scale: 1, duration: 0.3, ease: "back.out(3)" });
    }
  };

  // --- NEW: Arrow Hover Animation ---
  const handleArrowHover = (ref, isEnter) => {
    if (ref.current) {
        gsap.to(ref.current, {
            scale: isEnter ? 1.15 : 1,
            backgroundColor: isEnter ? "rgba(255, 255, 255, 0.5)" : "rgba(255, 255, 255, 0.3)",
            boxShadow: isEnter ? "0 0 15px rgba(193, 127, 89, 0.4)" : "none",
            duration: 0.3,
            ease: "power2.out"
        });
    }
  };

  useEffect(() => {
    // Reset navItemsRef on mount
    navItemsRef.current = [];
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // Set initial states for non-carousel elements
      if (logoRef.current) gsap.set(logoRef.current, { opacity: 0, x: -50 });
      if (closeRef.current) gsap.set(closeRef.current, { opacity: 0, x: 50 });
      if (imageRef.current) gsap.set(imageRef.current, { scale: 1.2, opacity: 0 });
      if (overlayRef.current) gsap.set(overlayRef.current, { opacity: 0 });
      if (vignetteRef.current) gsap.set(vignetteRef.current, { opacity: 0 });
      if (navRef.current) gsap.set(navRef.current, { opacity: 0, y: 30 });
      if (miniMapRef.current) gsap.set(miniMapRef.current, { opacity: 0, x: 50, scale: 0.8 });
      if (soundControlsRef.current) gsap.set(soundControlsRef.current, { opacity: 0, x: -30 });
      
      // --- NEW: Arrow Initial States ---
      if (leftArrowRef.current) gsap.set(leftArrowRef.current, { opacity: 0, x: -20 });
      if (rightArrowRef.current) gsap.set(rightArrowRef.current, { opacity: 0, x: 20 });

      // --- NEW: Mobile Floor Plan Button Initial State ---
      if (mobileFloorPlanRef.current) gsap.set(mobileFloorPlanRef.current, { opacity: 0, y: 20, scale: 0.9 });

      // Master entrance timeline
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        delay: 0.3,
      });

      // Cinematic image reveal
      if (imageRef.current) {
        tl.to(imageRef.current, {
          scale: 1,
          opacity: 1,
          duration: 1.8,
          ease: "power2.out",
        });
      }

      if (overlayRef.current) tl.to(overlayRef.current, { opacity: 1, duration: 1.2 }, "-=1.4");
      if (vignetteRef.current) tl.to(vignetteRef.current, { opacity: 1, duration: 1 }, "-=1");
      if (logoRef.current) tl.to(logoRef.current, { opacity: 1, x: 0, duration: 0.8 }, "-=0.8");
      if (closeRef.current) tl.to(closeRef.current, { opacity: 1, x: 0, duration: 0.8 }, "-=0.6");
      if (navRef.current) tl.to(navRef.current, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, "-=0.4");
      
      // --- NEW: Animate Arrows In ---
      if (leftArrowRef.current) tl.to(leftArrowRef.current, { opacity: 1, x: 0, duration: 0.6 }, "-=0.4");
      if (rightArrowRef.current) tl.to(rightArrowRef.current, { opacity: 1, x: 0, duration: 0.6 }, "-=0.6");

      tl.to(".carousel-item", {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        ease: "power2.out",
      }, "-=0.3");

      if (miniMapRef.current) tl.to(miniMapRef.current, { opacity: 1, x: 0, scale: 1, duration: 0.6, ease: "back.out(1.4)" }, "-=0.4");
      if (soundControlsRef.current) tl.to(soundControlsRef.current, { opacity: 1, x: 0, duration: 0.5 }, "-=0.4");

      // --- NEW: Animate Mobile Floor Plan Button In ---
      if (mobileFloorPlanRef.current) tl.to(mobileFloorPlanRef.current, { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "back.out(1.4)" }, "-=0.3");

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
              if (particle) gsap.to(particle, { opacity: 0.4, duration: 2, yoyo: true, repeat: -1, ease: "sine.inOut" });
            },
            onRepeat: () => {
              if (particle) gsap.set(particle, { x: Math.random() * window.innerWidth, y: window.innerHeight + 20 });
            },
          });
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleRoomChange = (room) => {
    if (room === activeRoom) return;

    if (imageRef.current) {
        gsap.timeline()
        .to(imageRef.current, {
            opacity: 0.3,
            scale: 1.05,
            duration: 0.4,
            ease: "power2.in",
        })
        .call(() => setActiveRoom(room))
        .to(imageRef.current, {
            opacity: 1,
            scale: 1,
            duration: 0.6,
            ease: "power2.out",
        });
    } else {
        setActiveRoom(room);
    }

    const highlight = roomHighlights[room];
    if (highlight && containerRef.current) {
        // Safe query selector
        const dot = containerRef.current.querySelector(".minimap-highlight");
        if (dot) {
            gsap.to(dot, {
                left: highlight.x + "%",
                top: highlight.y + "%",
                duration: 0.5,
                ease: "power2.inOut",
            });
        }
    }
  };

  const handleCloseEnter = () => {
    if (closeRef.current) {
        gsap.to(closeRef.current, {
        rotation: 90,
        scale: 1.1,
        backgroundColor: "#c17f59",
        duration: 0.4,
        ease: "power2.out",
        });
    }
  };

  const handleCloseLeave = () => {
    if (closeRef.current) {
        gsap.to(closeRef.current, {
        rotation: 0,
        scale: 1,
        backgroundColor: "rgba(255, 255, 255, 0.3)",
        duration: 0.4,
        ease: "power2.out",
        });
    }
  };

  const handleCarouselItemEnter = (index) => {
    const item = navItemsRef.current[index];
    if (item) {
        gsap.to(item, {
        scale: 1.05,
        y: -4,
        boxShadow: "0 10px 25px rgba(193, 127, 89, 0.25)",
        duration: 0.15,
        ease: "power2.out",
        });
    }
  };

  const handleCarouselItemLeave = (index) => {
    const item = navItemsRef.current[index];
    if (item) {
        gsap.to(item, {
        scale: 1,
        y: 0,
        boxShadow: "0 4px 15px rgba(193, 127, 89, 0.12)",
        duration: 0.15,
        ease: "power2.out",
        });
    }
  };

  const addToNavItems = (el) => {
    if (el && !navItemsRef.current.includes(el)) {
      navItemsRef.current.push(el);
    }
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen w-full relative overflow-hidden"
      style={{ backgroundColor: "#f0e4d6" }}
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
          opacity: 0;
          transform: translateY(15px) scale(0.95);
        }
        
        .carousel-item:hover {
          transform: translateY(-4px) rotateX(3deg) !important;
        }
      `}</style>

      {/* ============================================
          LAYER 1: Background Image (z-index: 1)
          ============================================ */}
      <div ref={imageRef} className="absolute inset-0" style={{ zIndex: 1 }}>
        {isPanorama(activeRoom) ? (
          <PanoramaViewer
            key={activeRoom}
            sceneId={panoramaRooms[activeRoom]}
            onHotspotClick={(targetRoom) => handleRoomChange(targetRoom)}
          />
        ) : roomImages[activeRoom] ? (
          <img
            src={roomImages[activeRoom]}
            alt={activeRoom + " view"}
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ backgroundColor: "#f0e4d6" }}
          >
            <span style={{ color: "#a65d3f", opacity: 0.5 }}>Loading...</span>
          </div>
        )}
      </div>

      {/* ============================================
          LAYER 2: Warm Gradient Overlay (z-index: 2)
          ============================================ */}
      {/* <div
        ref={overlayRef}
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 2,
          background: isPanorama(activeRoom)
            ? `linear-gradient(180deg, rgba(240, 228, 214, 0.35) 0%, transparent 20%, transparent 80%, rgba(212, 165, 116, 0.45) 100%),
               linear-gradient(90deg, rgba(193, 127, 89, 0.25) 0%, transparent 25%, transparent 75%, rgba(193, 127, 89, 0.25) 100%)`
            : `linear-gradient(180deg, rgba(240, 228, 214, 0.45) 0%, transparent 30%, transparent 65%, rgba(212, 165, 116, 0.55) 100%),
               linear-gradient(90deg, rgba(193, 127, 89, 0.3) 0%, transparent 25%, transparent 75%, rgba(193, 127, 89, 0.3) 100%)`,
        }}
      /> */}

      {/* ============================================
          LAYER 3: Warm Vignette (z-index: 3)
          ============================================ */}
      <div
        ref={vignetteRef}
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 3,
          background: isPanorama(activeRoom)
            ? `radial-gradient(ellipse 85% 75% at 50% 50%, transparent 40%, rgba(212, 180, 140, 0.2) 65%, rgba(193, 127, 89, 0.35) 85%, rgba(166, 93, 63, 0.45) 100%)`
            : `radial-gradient(ellipse 80% 70% at 50% 50%, transparent 35%, rgba(212, 180, 140, 0.25) 60%, rgba(193, 127, 89, 0.4) 80%, rgba(166, 93, 63, 0.5) 100%)`,
        }}
      />

      {/* ============================================
          LAYER 4: Decorative Patterns (z-index: 4)
          ============================================ */}

      <div
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          zIndex: 4,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23c17f59' stroke-width='1'%3E%3Ccircle cx='100' cy='100' r='40'/%3E%3Ccircle cx='100' cy='100' r='60'/%3E%3Ccircle cx='100' cy='100' r='80'/%3E%3Cpath d='M100 20 Q120 100 100 180 Q80 100 100 20'/%3E%3Cpath d='M20 100 Q100 80 180 100 Q100 120 20 100'/%3E%3Cpath d='M35 35 Q100 70 165 35 Q130 100 165 165 Q100 130 35 165 Q70 100 35 35'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: "200px 200px",
        }}
      />

      <div
        className="fixed left-0 top-0 w-32 h-full pointer-events-none opacity-[0.05]"
        style={{
          zIndex: 4,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='150' viewBox='0 0 100 150' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 0 Q0 50 0 100 L0 150 L100 150 L100 100 Q100 50 50 0Z' fill='none' stroke='%23c17f59' stroke-width='2'/%3E%3Cpath d='M50 20 Q15 60 15 100 L15 130 L85 130 L85 100 Q85 60 50 20Z' fill='none' stroke='%23c17f59' stroke-width='1'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat-y",
          backgroundSize: "100px 150px",
        }}
      />

      <div
        className="fixed right-0 top-0 w-32 h-full pointer-events-none opacity-[0.05]"
        style={{
          zIndex: 4,
          transform: "scaleX(-1)",
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='150' viewBox='0 0 100 150' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 0 Q0 50 0 100 L0 150 L100 150 L100 100 Q100 50 50 0Z' fill='none' stroke='%23c17f59' stroke-width='2'/%3E%3Cpath d='M50 20 Q15 60 15 100 L15 130 L85 130 L85 100 Q85 60 50 20Z' fill='none' stroke='%23c17f59' stroke-width='1'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat-y",
          backgroundSize: "100px 150px",
        }}
      />

      {/* ============================================
          LAYER 5: Sand Particles (z-index: 5)
          ============================================ */}
      <div
        className="fixed inset-0 overflow-hidden pointer-events-none"
        style={{ zIndex: 5 }}
      >
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            ref={addToParticles}
            className="absolute rounded-full"
            style={{
              width: `${3 + Math.random() * 3}px`,
              height: `${3 + Math.random() * 3}px`,
              backgroundColor: i % 2 === 0 ? "#c17f59" : "#d4a574",
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
          LAYER 10: ALL UI ELEMENTS (z-index: 10+)
          ============================================ */}

      {/* 360 Indicator */}
      {isPanorama(activeRoom) && (
        <div
          className="absolute top-24 left-1/2 transform -translate-x-1/2 flex items-center gap-2 px-4 py-2 rounded-full"
          style={{
            zIndex: 20,
            backgroundColor: "rgba(250, 245, 238, 0.85)",
            backdropFilter: "blur(10px)",
            boxShadow: "0 4px 15px rgba(166, 93, 63, 0.15)",
            border: "1px solid rgba(193, 127, 89, 0.2)",
          }}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="w-5 h-5"
            stroke="#a65d3f"
            strokeWidth="1.5"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            <path d="M2 12h20" />
          </svg>
          <span
            className="text-xs uppercase tracking-wider"
            style={{ fontFamily: "'Marcellus', serif", color: "#a65d3f" }}
          >
            Drag to explore 360°
          </span>
        </div>
      )}

      {/* --- NEW: Left Arrow (Hidden on SM and up) --- */}
      <button
        ref={leftArrowRef}
        onClick={handlePrevRoom}
        onMouseEnter={() => handleArrowHover(leftArrowRef, true)}
        onMouseLeave={() => handleArrowHover(leftArrowRef, false)}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full flex items-center justify-center sm:hidden border border-[#c17f59] bg-white/30 backdrop-blur-md"
        aria-label="Previous Room"
        style={{
            backgroundColor: "rgba(255, 255, 255, 0.3)",
            borderColor: "#c17f59",
        }}
      >
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6" style={{ stroke: "#a65d3f" }}>
            <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      {/* --- NEW: Right Arrow (Hidden on SM and up) --- */}
      <button
        ref={rightArrowRef}
        onClick={handleNextRoom}
        onMouseEnter={() => handleArrowHover(rightArrowRef, true)}
        onMouseLeave={() => handleArrowHover(rightArrowRef, false)}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full flex items-center justify-center sm:hidden border border-[#c17f59] bg-white/30 backdrop-blur-md"
        aria-label="Next Room"
        style={{
            backgroundColor: "rgba(255, 255, 255, 0.3)",
            borderColor: "#c17f59",
        }}
      >
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6" style={{ stroke: "#a65d3f" }}>
            <path d="M9 18l6-6-6-6" />
        </svg>
      </button>

      {/* Header */}
      <header
        className="absolute top-0 left-0 right-0 flex justify-between items-center px-6 md:px-10 py-5"
        style={{ zIndex: 20 }}
      >
        {/* Header bottom border */}
        <div
          className="absolute bottom-0 left-6 right-6 md:left-10 md:right-10 h-px opacity-40"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, #c17f59 15%, #a65d3f 50%, #c17f59 85%, transparent 100%)",
          }}
        />

        {/* Logo */}
        <div ref={logoRef} className="flex items-center gap-3">
          <div
            className="w-10 h-10 md:w-12 md:h-12"
            style={{ filter: "drop-shadow(0 2px 8px rgba(193, 127, 89, 0.3))" }}
          >
            <svg
              viewBox="0 0 56 56"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="28"
                cy="28"
                r="26"
                stroke="#c17f59"
                strokeWidth="1"
                opacity="0.6"
              />
              <circle
                cx="28"
                cy="28"
                r="20"
                stroke="#c17f59"
                strokeWidth="0.5"
                opacity="0.3"
              />
              <path
                d="M28 4C28 4 16 12 16 28C16 44 28 52 28 52"
                stroke="#d4a574"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M28 4C28 4 40 12 40 28C40 44 28 52 28 52"
                stroke="#d4a574"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M28 10C28 10 21 16 21 28C21 40 28 46 28 46"
                stroke="#d4a574"
                strokeWidth="1"
                strokeLinecap="round"
                fill="none"
                opacity="0.5"
              />
              <path
                d="M28 10C28 10 35 16 35 28C35 40 28 46 28 46"
                stroke="#d4a574"
                strokeWidth="1"
                strokeLinecap="round"
                fill="none"
                opacity="0.5"
              />
              <line
                x1="28"
                y1="4"
                x2="28"
                y2="52"
                stroke="#d4a574"
                strokeWidth="0.75"
                opacity="0.4"
              />
              <circle cx="28" cy="4" r="2.5" fill="#c17f59" />
              <circle cx="28" cy="52" r="2.5" fill="#c17f59" />
              <circle cx="28" cy="28" r="3" fill="#d4a574" opacity="0.8" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span
              className="text-lg md:text-xl font-semibold uppercase"
              style={{
                fontFamily: "'Cinzel', serif",
                color: "#a65d3f",
                letterSpacing: "0.2em",
                textShadow: "0 1px 2px rgba(255,255,255,0.5)",
              }}
            >
              Rudraksh
            </span>
            <span
              className="text-[9px] md:text-[10px] uppercase"
              style={{
                fontFamily: "'Marcellus', serif",
                color: "#c17f59",
                letterSpacing: "0.25em",
              }}
            >
              Apartments
            </span>
          </div>
        </div>

        {/* Close Button - Matching HomePage style */}
        <button
          ref={closeRef}
          onClick={onClose}
          onMouseEnter={handleCloseEnter}
          onMouseLeave={handleCloseLeave}
          className="w-10 h-10 md:w-11 md:h-11 flex items-center justify-center rounded-full cursor-pointer border"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.3)",
            borderColor: "#c17f59",
          }}
          aria-label="Close"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            strokeWidth="1.5"
            strokeLinecap="round"
            className="w-4 h-4 md:w-5 md:h-5"
            style={{ stroke: "#a65d3f" }}
          >
            <line x1="6" y1="6" x2="18" y2="18" />
            <line x1="6" y1="18" x2="18" y2="6" />
          </svg>
        </button>
      </header>

      {/* Bottom Controls */}
      <div
        className="absolute bottom-0 left-0 right-0 px-6 md:px-10 pb-6"
        style={{ zIndex: 20 }}
      >
        <div className="flex items-end justify-between gap-7">
          {/* Sound Controls */}
          <div ref={soundControlsRef} className="flex items-center gap-3">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 hover:scale-110"
              style={{
                backgroundColor: "rgba(250, 245, 238, 0.85)",
                backdropFilter: "blur(10px)",
                boxShadow: "0 4px 15px rgba(166, 93, 63, 0.15)",
                border: "1px solid rgba(193, 127, 89, 0.2)",
              }}
            >
              {isMuted ? (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="w-5 h-5"
                  stroke="#a65d3f"
                  strokeWidth="2"
                >
                  <path d="M11 5L6 9H2v6h4l5 4V5z" />
                  <line x1="23" y1="9" x2="17" y2="15" />
                  <line x1="17" y1="9" x2="23" y2="15" />
                </svg>
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="w-5 h-5"
                  stroke="#a65d3f"
                  strokeWidth="2"
                >
                  <path d="M11 5L6 9H2v6h4l5 4V5z" />
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                </svg>
              )}
            </button>
          </div>

          {/* Room Carousel Navigation - HIDDEN ON SMALL SCREENS */}
          <div
            ref={navRef}
            className="carousel-container hidden sm:flex items-center gap-3 md:gap-4 px-5 py-4 rounded-2xl overflow-x-auto max-w-[70vw] md:max-w-none"
            style={{
              background: `
                radial-gradient(ellipse 80% 60% at 50% 40%, rgba(255, 252, 248, 0.95) 0%, transparent 70%),
                linear-gradient(155deg, rgba(250, 245, 238, 0.92) 0%, rgba(245, 235, 224, 0.9) 50%, rgba(240, 228, 214, 0.88) 100%)
              `,
              backdropFilter: "blur(12px)",
              boxShadow: `
                0 0 0 1px rgba(193, 127, 89, 0.15),
                0 4px 15px rgba(193, 127, 89, 0.1),
                0 10px 30px rgba(166, 93, 63, 0.12)
              `,
            }}
          >
            {rooms.map((room, index) => (
              <div
                key={room.id}
                ref={addToNavItems}
                onClick={() => handleRoomChange(room.id)}
                onMouseEnter={() => handleCarouselItemEnter(index)}
                onMouseLeave={() => handleCarouselItemLeave(index)}
                className={`carousel-item flex-shrink-0 cursor-pointer rounded-xl overflow-hidden relative`}
                style={{
                  width: "110px",
                  height: "75px",
                  boxShadow:
                    activeRoom === room.id
                      ? "0 6px 20px rgba(193, 127, 89, 0.3), 0 0 0 2px #c17f59"
                      : "0 4px 15px rgba(193, 127, 89, 0.12)",
                  transformStyle: "preserve-3d",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                }}
              >
                {/* Background Image */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500"
                  style={{
                    backgroundImage: `url(${room.image})`,
                    transform:
                      activeRoom === room.id ? "scale(1.15)" : "scale(1)",
                  }}
                />
                {/* Overlay - Soft warm tones */}
                <div
                  className="absolute inset-0 transition-all duration-300"
                  style={{
                    background:
                      activeRoom === room.id
                        ? "linear-gradient(to top, rgba(193, 127, 89, 0.85) 0%, rgba(193, 127, 89, 0.3) 50%, rgba(212, 165, 116, 0.1) 100%)"
                        : "linear-gradient(to top, rgba(74, 55, 40, 0.7) 0%, rgba(74, 55, 40, 0.3) 50%, rgba(212, 165, 116, 0.05) 100%)",
                  }}
                />
                {/* Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-end p-2">
                  {/* 360 indicator */}
                  {room.is360 && (
                    <div
                      className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center"
                      style={{
                        backgroundColor: "rgba(250, 245, 238, 0.9)",
                        boxShadow: "0 2px 6px rgba(166, 93, 63, 0.2)",
                      }}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        className="w-3 h-3"
                        stroke="#c17f59"
                        strokeWidth="2"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <path d="M2 12h20" />
                      </svg>
                    </div>
                  )}
                  <span
                    className="text-[10px] md:text-[11px] font-medium text-center leading-tight"
                    style={{
                      fontFamily: "'Marcellus', serif",
                      textShadow: "0 1px 3px rgba(0,0,0,0.4)",
                      color: "#faf6f0",
                    }}
                  >
                    {room.id}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile Floor Plan Button - Visible only on small screens (below md breakpoint) */}
          <button
            ref={mobileFloorPlanRef}
            onClick={onFloorPlanClick}
            className="md:hidden flex items-center gap-2 px-4 py-3 rounded-xl transition-all duration-300 hover:scale-105 active:scale-95"
            style={{
              background: `
                radial-gradient(ellipse 70% 50% at 50% 40%, rgba(255, 252, 248, 0.6) 0%, transparent 60%),
                linear-gradient(155deg, #faf5ef 0%, #f5ebe0 50%, #efe3d5 100%)
              `,
              boxShadow: `
                0 0 0 1px rgba(193, 127, 89, 0.2),
                0 4px 15px rgba(193, 127, 89, 0.12),
                0 10px 25px rgba(166, 93, 63, 0.15)
              `,
            }}
            aria-label="View Floor Plan"
          >
            {/* Floor Plan Icon - Grid/Layout style */}
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="w-5 h-5"
              stroke="#a65d3f"
              strokeWidth="1.5"
            >
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
            <span
              className="text-xs font-medium whitespace-nowrap"
              style={{
                fontFamily: "'Marcellus', serif",
                color: "#a65d3f",
                letterSpacing: "0.05em",
              }}
            >
              Floor Plan
            </span>
          </button>

          {/* Mini Map - Soft Warm Theme - Hidden on mobile (below md breakpoint) */}
          <div
            ref={miniMapRef}
            onClick={onFloorPlanClick}
            className="hidden md:block relative w-40 h-28 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 group"
            style={{
              background: `
                radial-gradient(ellipse 70% 50% at 50% 40%, rgba(255, 252, 248, 0.6) 0%, transparent 60%),
                linear-gradient(155deg, #faf5ef 0%, #f5ebe0 50%, #efe3d5 100%)
              `,
              boxShadow: `
                0 0 0 1px rgba(193, 127, 89, 0.2),
                0 4px 15px rgba(193, 127, 89, 0.12),
                0 10px 25px rgba(166, 93, 63, 0.15)
              `,
            }}
          >
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-[#c17f59]/0 group-hover:bg-[#c17f59]/10 transition-all duration-300 z-10 flex items-center justify-center pointer-events-none">
              <span
                className="opacity-0 group-hover:opacity-100 text-xs font-medium transition-opacity duration-300"
                style={{ fontFamily: "'Marcellus', serif", color: "#a65d3f" }}
              >
                View Floor Plan
              </span>
            </div>
            <svg viewBox="0 0 160 110" className="w-full h-full">
              <rect x="0" y="0" width="160" height="110" fill="transparent" />
              <rect
                x="8"
                y="8"
                width="30"
                height="35"
                fill="none"
                stroke="#c17f59"
                strokeWidth="1.5"
                rx="2"
                opacity="0.7"
              />
              <rect
                x="42"
                y="8"
                width="35"
                height="35"
                fill="none"
                stroke="#c17f59"
                strokeWidth="1.5"
                rx="2"
                opacity="0.7"
              />
              <rect
                x="81"
                y="8"
                width="30"
                height="35"
                fill="none"
                stroke="#c17f59"
                strokeWidth="1.5"
                rx="2"
                opacity="0.7"
              />
              <rect
                x="115"
                y="8"
                width="38"
                height="35"
                fill="none"
                stroke="#c17f59"
                strokeWidth="1.5"
                rx="2"
                opacity="0.7"
              />
              <rect
                x="8"
                y="47"
                width="30"
                height="35"
                fill="none"
                stroke="#c17f59"
                strokeWidth="1.5"
                rx="2"
                opacity="0.7"
              />
              <rect
                x="42"
                y="47"
                width="35"
                height="35"
                fill="none"
                stroke="#c17f59"
                strokeWidth="1.5"
                rx="2"
                opacity="0.7"
              />
              <rect
                x="115"
                y="47"
                width="38"
                height="55"
                fill="none"
                stroke="#c17f59"
                strokeWidth="1.5"
                rx="2"
                opacity="0.7"
              />

              <text
                x="23"
                y="28"
                fontSize="5"
                fill="#a65d3f"
                textAnchor="middle"
                opacity="0.8"
                style={{ fontFamily: "'Marcellus', serif" }}
              >
                Arrival
              </text>
              <text
                x="59"
                y="28"
                fontSize="5"
                fill="#a65d3f"
                textAnchor="middle"
                opacity="0.8"
                style={{ fontFamily: "'Marcellus', serif" }}
              >
                Living
              </text>
              <text
                x="96"
                y="28"
                fontSize="5"
                fill="#a65d3f"
                textAnchor="middle"
                opacity="0.8"
                style={{ fontFamily: "'Marcellus', serif" }}
              >
                Bedroom
              </text>
              <text
                x="134"
                y="23"
                fontSize="4"
                fill="#a65d3f"
                textAnchor="middle"
                opacity="0.8"
                style={{ fontFamily: "'Marcellus', serif" }}
              >
                Kids Bed 1
              </text>
              <text
                x="23"
                y="68"
                fontSize="5"
                fill="#a65d3f"
                textAnchor="middle"
                opacity="0.8"
                style={{ fontFamily: "'Marcellus', serif" }}
              >
                Balcony
              </text>
              <text
                x="59"
                y="68"
                fontSize="5"
                fill="#a65d3f"
                textAnchor="middle"
                opacity="0.8"
                style={{ fontFamily: "'Marcellus', serif" }}
              >
                Kitchen
              </text>
              <text
                x="134"
                y="78"
                fontSize="4"
                fill="#a65d3f"
                textAnchor="middle"
                opacity="0.8"
                style={{ fontFamily: "'Marcellus', serif" }}
              >
                Kids Bed 2
              </text>
            </svg>

            <div
              className="minimap-highlight absolute w-4 h-4 rounded-full border-2"
              style={{
                backgroundColor: "#c17f59",
                borderColor: "#faf5ef",
                boxShadow: "0 0 10px rgba(193, 127, 89, 0.6)",
                left: (roomHighlights[activeRoom]?.x || 50) + "%",
                top: (roomHighlights[activeRoom]?.y || 50) + "%",
                transform: "translate(-50%, -50%)",
                transition: "left 0.5s ease, top 0.5s ease",
              }}
            />
          </div>
        </div>
      </div>

      {/* Corner accents - Warm tones */}
      <div
        className="absolute top-20 left-6 w-16 h-16 pointer-events-none opacity-30"
        style={{ zIndex: 10 }}
      >
        <svg viewBox="0 0 60 60" fill="none">
          <path
            d="M0,60 L0,20 Q0,0 20,0 L60,0"
            stroke="#c17f59"
            strokeWidth="1.5"
            fill="none"
          />
          <circle cx="8" cy="8" r="3" fill="#d4a574" />
        </svg>
      </div>
      <div
        className="absolute top-20 right-6 w-16 h-16 pointer-events-none opacity-30"
        style={{ zIndex: 10 }}
      >
        <svg viewBox="0 0 60 60" fill="none">
          <path
            d="M60,60 L60,20 Q60,0 40,0 L0,0"
            stroke="#c17f59"
            strokeWidth="1.5"
            fill="none"
          />
          <circle cx="52" cy="8" r="3" fill="#d4a574" />
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
            background:
              "linear-gradient(90deg, transparent 0%, #c17f59 20%, #d4a574 50%, #c17f59 80%, transparent 100%)",
          }}
        />
      </div>
    </div>
  );
};

export default MainPage;