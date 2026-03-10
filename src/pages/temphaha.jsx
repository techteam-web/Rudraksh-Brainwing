import React, { useRef, useState, useCallback, useMemo } from "react";
import { gsap, useGSAP } from "/gsap.config.js";
import Logo from "../components/Logo";
import RoomNav from "../components/RoomNav";
import MobileRoomNav from "../components/MobileRoomNav";
import { useNavigate } from "react-router-dom";
import {
  getCategories,
  getCategoryDefaultScene,
} from "../data/panoConfig";

// ── Collect EVERY scene (one marker per pano image) ──
function getAllSceneMarkers(bhkType) {
  const categories = getCategories(bhkType);
  const markers = [];

  for (const cat of categories) {
    if (cat.type === "single") {
      for (const scene of cat.scenes || []) {
        if (scene.minimapPos) {
          markers.push({
            id: scene.id,
            label: scene.label,
            x: scene.minimapPos.x,
            y: scene.minimapPos.y,
            categoryId: cat.id,
            subcategoryId: null,
            sceneId: scene.id,
          });
        }
      }
    }

    if (cat.type === "dropdown") {
      for (const sub of cat.subcategories || []) {
        for (const scene of sub.scenes || []) {
          if (scene.minimapPos) {
            markers.push({
              id: scene.id,
              label: scene.label,
              x: scene.minimapPos.x,
              y: scene.minimapPos.y,
              categoryId: cat.id,
              subcategoryId: sub.id,
              sceneId: scene.id,
            });
          }
        }
      }
    }
  }

  return markers;
}

const FloorPlanPage = ({
  onClose,
  onRoomSelect,
  bhkType = "4bhk",
  initialRoom = null,
}) => {
  const containerRef = useRef(null);
  const [isMuted, setIsMuted] = useState(false);
  const logoRef = useRef(null);
  const logoContainerRef = useRef(null);
  const closeRef = useRef(null);
  const navRef = useRef(null);
  const mobileNavRef = useRef(null);
  const navigate = useNavigate();
  const markerRefs = useRef([]);

  const [activeCategory, setActiveCategory] = useState("living");
  const [activeSubcategory, setActiveSubcategory] = useState(null);
  const [hoveredMarker, setHoveredMarker] = useState(null);

  const categories = getCategories(bhkType);
  const markers = useMemo(() => getAllSceneMarkers(bhkType), [bhkType]);

  const handleClick = () => {
    navigate("/");
  };

  const colors = {
    bg: "#927867",
    textPrimary: "#f5f0eb",
    textSecondary: "#e8e0d8",
    textAccent: "#E8C4A0",
    terracotta: "#c17f59",
    terracottaDark: "#a65d3f",
    terracottaLight: "#d4a574",
  };

  const floorplanImage = `/assets/${bhkType}/floorplan/${bhkType.toUpperCase()} PLAN.jpg`;

  const handleMarkerClick = useCallback(
    (marker) => {
      setActiveCategory(marker.categoryId);
      setActiveSubcategory(marker.subcategoryId);

      if (onRoomSelect) {
        onRoomSelect({
          categoryId: marker.categoryId,
          subcategoryId: marker.subcategoryId,
          sceneId: marker.sceneId,
        });
      }
    },
    [onRoomSelect]
  );

  const handleNavSelect = useCallback(
    (categoryId, subcategoryId) => {
      setActiveCategory(categoryId);
      setActiveSubcategory(subcategoryId);

      const result = getCategoryDefaultScene(bhkType, categoryId, subcategoryId);
      if (!result) return;

      const { scene, categoryId: resolvedCat, subcategoryId: resolvedSub } = result;

      if (onRoomSelect) {
        onRoomSelect({
          categoryId: resolvedCat,
          subcategoryId: resolvedSub,
          sceneId: scene.id,
        });
      }
    },
    [bhkType, onRoomSelect]
  );

  // Entry animations
  useGSAP(
    () => {
      const ctx = gsap.context(() => {
        gsap.set(logoContainerRef.current, { opacity: 0, x: -30 });
        gsap.set(closeRef.current, { opacity: 0, x: 30 });
        gsap.set(".floor-plan-container", { opacity: 0, scale: 0.95 });
        gsap.set(".sound-controls", { opacity: 0, x: -20 });
        gsap.set(".particle", { opacity: 0 });
        gsap.set(".room-marker", { opacity: 0, scale: 0 });

        const navEl = navRef.current?.getContainerEl();
        if (navEl) gsap.set(navEl, { opacity: 0, y: 10 });

        const mobileNavEl = mobileNavRef.current?.getContainerEl();
        if (mobileNavEl) gsap.set(mobileNavEl, { opacity: 0, scale: 0.95 });

        const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

        tl.to(
          ".floor-plan-container",
          { opacity: 1, scale: 1, duration: 0.6 },
          0.2
        )
          .to(logoContainerRef.current, { opacity: 1, x: 0, duration: 0.5 }, 0.3)
          .add(() => {
            if (logoRef.current?.animateIn) {
              logoRef.current.animateIn({ duration: 0.3, ease: "power2.out" });
            }
          }, 0.35)
          .to(closeRef.current, { opacity: 1, x: 0, duration: 0.5 }, 0.3);

        if (navEl) {
          tl.to(navEl, { opacity: 1, y: 0, duration: 0.4 }, 0.4);
        }
        if (mobileNavEl) {
          tl.to(mobileNavEl, { opacity: 1, scale: 1, duration: 0.3 }, 0.4);
        }

        tl.to(".sound-controls", { opacity: 1, x: 0, duration: 0.4 }, 0.5);

        // Stagger in all scene markers
        tl.to(
          ".room-marker",
          {
            opacity: 1,
            scale: 1,
            duration: 0.3,
            stagger: 0.03,
            ease: "back.out(1.7)",
          },
          0.6
        );

        tl.to(".particle", { opacity: 0.3, stagger: 0.1, duration: 0.5 }, 0.6);

        gsap.utils.toArray(".particle").forEach((particle, i) => {
          gsap.to(particle, {
            y: `-=${50 + Math.random() * 50}`,
            x: `+=${20 + Math.random() * 30}`,
            opacity: 0,
            duration: 8 + Math.random() * 4,
            delay: i * 0.5,
            repeat: -1,
            ease: "none",
          });
        });
      }, containerRef);

      return () => ctx.revert();
    },
    { scope: containerRef }
  );

  const handleCloseEnter = useCallback(() => {
    gsap.to(closeRef.current, {
      rotation: 90,
      scale: 1.1,
      backgroundColor: "rgba(245, 240, 235, 0.3)",
      duration: 0.3,
      ease: "power2.out",
    });
  }, []);

  const handleCloseLeave = useCallback(() => {
    gsap.to(closeRef.current, {
      rotation: 0,
      scale: 1,
      backgroundColor: "rgba(245, 240, 235, 0.15)",
      duration: 0.3,
      ease: "power2.out",
    });
  }, []);

  const handleMarkerEnter = useCallback((markerId, el) => {
    setHoveredMarker(markerId);
    gsap.to(el, { scale: 1.35, duration: 0.3, ease: "power2.out" });
  }, []);

  const handleMarkerLeave = useCallback((el) => {
    setHoveredMarker(null);
    gsap.to(el, { scale: 1, duration: 0.3, ease: "power2.out" });
  }, []);

  return (
    <div
      ref={containerRef}
      className="h-screen w-full relative overflow-hidden flex flex-col"
      style={{ backgroundColor: colors.bg }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,400&family=Marcellus&display=swap');

        @keyframes markerPulse {
          0%   { r: 8; opacity: 0.45; }
          70%  { opacity: 0.08; }
          100% { r: 18; opacity: 0; }
        }
        @keyframes markerPulse2 {
          0%   { r: 8; opacity: 0.25; }
          70%  { opacity: 0.04; }
          100% { r: 15; opacity: 0; }
        }
        @keyframes markerGlow {
          0%   { opacity: 0.15; r: 10; }
          50%  { opacity: 0.28; r: 13; }
          100% { opacity: 0.15; r: 10; }
        }
      `}</style>

      {/* Particles */}
      <div
        className="fixed inset-0 overflow-hidden pointer-events-none"
        style={{ zIndex: 6 }}
      >
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="particle absolute rounded-full"
            style={{
              width: `${3 + (i % 2)}px`,
              height: `${3 + (i % 2)}px`,
              backgroundColor: colors.textPrimary,
              left: `${15 + i * 15}%`,
              top: `${70 + (i % 3) * 10}%`,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header
        className="flex-none flex justify-between items-center px-6 md:px-10 py-3 sm:py-4 md:py-5"
        style={{ zIndex: 20 }}
      >
        <div ref={logoContainerRef}>
          <Logo
            ref={logoRef}
            className={"w-32 sm:w-40 md:w-48 lg:w-56 xl:w-44 h-auto"}
            onClick={handleClick}
          />
        </div>

        <button
          ref={closeRef}
          onClick={onClose}
          onMouseEnter={handleCloseEnter}
          onMouseLeave={handleCloseLeave}
          className="w-10 h-10 md:w-11 md:h-11 flex items-center justify-center rounded-full cursor-pointer border"
          style={{
            backgroundColor: "rgba(245, 240, 235, 0.15)",
            borderColor: "rgba(245, 240, 235, 0.3)",
            backdropFilter: "blur(10px)",
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

      {/* Main Content */}
      <main
        className="flex-1 min-h-0 flex items-center justify-center px-4 sm:px-8 md:px-16"
        style={{ zIndex: 10 }}
      >
        <div
          className="floor-plan-container w-full h-full max-h-full max-w-5xl flex flex-col justify-center rounded-2xl overflow-hidden p-4 sm:p-6 md:p-8"
          style={{
            background: "rgba(230, 216, 204, 0.2)",
            border: "1px solid rgba(245, 240, 235, 0.12)",
            boxShadow: "0 25px 70px rgba(0, 0, 0, 0.15)",
          }}
        >
          {/* Title */}
          <div className="flex-none text-center mb-3">
            <h2
              className="text-xl sm:text-2xl md:text-3xl font-light"
              style={{
                fontFamily: "'Cinzel', serif",
                letterSpacing: "0.08em",
                color: colors.textPrimary,
              }}
            >
              {bhkType.toUpperCase()} FLOOR PLAN
            </h2>
          </div>

          {/* Floor Plan Image with ALL Scene Markers */}
          <div className="flex-1 min-h-0 w-full flex items-center justify-center">
            <div className="relative inline-block max-w-full max-h-full">
              <img
                src={floorplanImage}
                alt={`${bhkType.toUpperCase()} Floor Plan`}
                className="block max-w-full max-h-full drop-shadow-lg"
                style={{ objectFit: "contain" }}
                draggable={false}
              />

              {/* ── Scene Marker Overlay (1 per pano) ── */}
              <div className="absolute inset-0" style={{ zIndex: 5, top: "210px" }}>
                {markers.map((marker, idx) => {
                  const isHovered = hoveredMarker === marker.id;

                  return (
                    <div
                      key={marker.id}
                      className="room-marker absolute "
                      ref={(el) => (markerRefs.current[idx] = el)}
                      style={{
                        left: `${marker.x}%`,
                        top: `${marker.y}%`,
                        transform: "translate(-50%, -50%)",
                        cursor: "pointer",
                        zIndex: isHovered ? 15 : 10,
                      }}
                      onClick={() => handleMarkerClick(marker)}
                      onMouseEnter={(e) =>
                        handleMarkerEnter(marker.id, e.currentTarget)
                      }
                      onMouseLeave={(e) =>
                        handleMarkerLeave(e.currentTarget)
                      }
                    >
                      {/* Compact SVG marker for dense placement */}
                      <svg
                        width="36"
                        height="36"
                        viewBox="0 0 36 36"
                        style={{ overflow: "visible", display: "block" }}
                      >
                        <defs>
                          <radialGradient
                            id={`mg-${marker.id}`}
                            cx="50%"
                            cy="50%"
                            r="50%"
                          >
                            <stop offset="0%" stopColor="#c17f59" stopOpacity="0.5" />
                            <stop offset="60%" stopColor="#c17f59" stopOpacity="0.12" />
                            <stop offset="100%" stopColor="#c17f59" stopOpacity="0" />
                          </radialGradient>
                          <filter
                            id={`ms-${marker.id}`}
                            x="-50%"
                            y="-50%"
                            width="200%"
                            height="200%"
                          >
                            <feDropShadow
                              dx="0"
                              dy="0.8"
                              stdDeviation="1.5"
                              floodColor="#000"
                              floodOpacity="0.3"
                            />
                          </filter>
                        </defs>

                        {/* Ambient glow */}
                        <circle
                          cx="18"
                          cy="18"
                          r="10"
                          fill={`url(#mg-${marker.id})`}
                          style={{ animation: "markerGlow 3s ease-in-out infinite" }}
                        />

                        {/* Pulse ring 1 */}
                        <circle
                          cx="18"
                          cy="18"
                          r="8"
                          fill="none"
                          stroke="#c17f59"
                          strokeWidth="1"
                          opacity="0"
                          style={{ animation: "markerPulse 2.6s ease-out infinite" }}
                        />

                        {/* Pulse ring 2 — staggered */}
                        <circle
                          cx="18"
                          cy="18"
                          r="8"
                          fill="none"
                          stroke="#E8C4A0"
                          strokeWidth="0.7"
                          opacity="0"
                          style={{
                            animation: "markerPulse2 2.6s ease-out 1.3s infinite",
                          }}
                        />

                        {/* Outer white ring */}
                        <circle
                          cx="18"
                          cy="18"
                          r="6"
                          fill="#f5f0eb"
                          filter={`url(#ms-${marker.id})`}
                        />

                        {/* Terracotta centre */}
                        <circle cx="18" cy="18" r="4" fill="#c17f59" />

                        {/* Specular highlight */}
                        <circle cx="16.8" cy="16.8" r="1.2" fill="#fff" opacity="0.35" />
                      </svg>

                      {/* Label tooltip */}
                      <div
                        className="absolute left-1/2 whitespace-nowrap px-2.5 py-1 rounded-full pointer-events-none"
                        style={{
                          bottom: "calc(100% + 2px)",
                          fontFamily: "'Marcellus', serif",
                          fontSize: "0.55rem",
                          letterSpacing: "0.05em",
                          color: colors.textPrimary,
                          backgroundColor: "rgba(125, 102, 88, 0.92)",
                          backdropFilter: "blur(8px)",
                          boxShadow: "0 2px 10px rgba(0,0,0,0.25)",
                          border: "1px solid rgba(245,240,235,0.15)",
                          opacity: isHovered ? 1 : 0,
                          transform: isHovered
                            ? "translateX(-50%) translateY(0)"
                            : "translateX(-50%) translateY(4px)",
                          transition: "opacity 0.2s, transform 0.2s",
                        }}
                      >
                        {marker.label}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <div
        className="flex-none px-4 md:px-10 pb-4 sm:pb-5 md:pb-6 pt-2"
        style={{ zIndex: 20 }}
      >
        <div className="flex items-end justify-between">
          {/* Sound Controls */}
          <div className="sound-controls flex items-center gap-3">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="w-10 h-10 flex items-center justify-center rounded-full transition-transform duration-200 hover:scale-110"
              style={{
                backgroundColor: "rgba(245, 240, 235, 0.15)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(245, 240, 235, 0.2)",
              }}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="w-5 h-5"
                stroke={colors.textSecondary}
                strokeWidth="2"
              >
                <path d="M11 5L6 9H2v6h4l5 4V5z" />
                {!isMuted && (
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                )}
                {isMuted && (
                  <>
                    <line x1="23" y1="9" x2="17" y2="15" />
                    <line x1="17" y1="9" x2="23" y2="15" />
                  </>
                )}
              </svg>
            </button>
          </div>

          {/* Center: Nav (desktop) */}
          <div className="hidden sm:flex flex-col items-center gap-2">
            <RoomNav
              ref={navRef}
              categories={categories}
              activeCategory={activeCategory}
              activeSubcategory={activeSubcategory}
              onSelect={handleNavSelect}
              colors={colors}
            />
          </div>

          {/* Right (Mobile): Nav */}
          <div className="sm:hidden flex flex-col items-end gap-2">
            <MobileRoomNav
              ref={mobileNavRef}
              categories={categories}
              activeCategory={activeCategory}
              activeSubcategory={activeSubcategory}
              onSelect={handleNavSelect}
              colors={colors}
            />
          </div>

          {/* Spacer to balance layout on desktop */}
          <div className="w-10 hidden sm:block" />
        </div>
      </div>
    </div>
  );
};

export default FloorPlanPage;