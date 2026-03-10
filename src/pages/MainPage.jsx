import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { gsap } from "/gsap.config.js";
import PanoramaViewer from "../components/PanoramaViewer";
import Logo from "../components/Logo";
import RoomNav from "../components/RoomNav";
import MobileRoomNav from "../components/MobileRoomNav";
import { useNavigate } from "react-router-dom";
import {
  getCategories,
  getDefaultScene,
  getCategoryDefaultScene,
  findSceneById,
  preloadImages,
  getPreviewUrls,
} from "../data/panoConfig";

// ── Radar visual config ─────────────────────────────────
const RADAR = {
  size: 94,
  coneRadius: 40,
  coneSpread: 65,
  dotRadius: 5.5,
  dotStroke: 3,
  haloRadius: 12,
};

const MainPage = ({
  onClose,
  onFloorPlanClick,
  initialRoom,
  bhkType = "4bhk",
  isReady = true,
}) => {
  const containerRef = useRef(null);
  const logoRef = useRef(null);
  const closeRef = useRef(null);
  const imageRef = useRef(null);
  const overlayRef = useRef(null);
  const miniMapRef = useRef(null);
  const soundControlsRef = useRef(null);
  const animationStartedRef = useRef(false);
  const navigate = useNavigate();

  const navRef = useRef(null);
  const mobileNavRef = useRef(null);
  const transitionOverlayRef = useRef(null);
  const mobileFloorPlanRef = useRef(null);

  const [isMuted, setIsMuted] = useState(false);
  const isTransitioningRef = useRef(false);

  const [activeCategory, setActiveCategory] = useState(null);
  const [activeSubcategory, setActiveSubcategory] = useState(null);
  const [activeSceneId, setActiveSceneId] = useState(null);
  const [activeSceneConfig, setActiveSceneConfig] = useState(null);

  const liveYawRef = useRef(0);
  const radarGroupRef = useRef(null);
  const activeSceneConfigRef = useRef(null);

  const categories = getCategories(bhkType);

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

  const getFloorPlanImage = useCallback(() => {
    return bhkType === "3bhk"
      ? "/assets/3bhk/floorplan/3BHK PLAN Main.webp"
      : "/assets/4bhk/floorplan/4BHK PLAN Main.webp";
  }, [bhkType]);

  useEffect(() => {
    const defaultScene = getDefaultScene(bhkType);
    if (defaultScene) {
      setActiveCategory(defaultScene.categoryId);
      setActiveSubcategory(defaultScene.subcategoryId);
      setActiveSceneId(defaultScene.scene.id);
      setActiveSceneConfig(defaultScene.scene);
    }
  }, [bhkType]);

  const transitionToScene = useCallback(
    (newScene, categoryId, subcategoryId) => {
      if (isTransitioningRef.current) return;
      isTransitioningRef.current = true;

      const panoLayer = imageRef.current;
      const overlay = transitionOverlayRef.current;

      gsap.killTweensOf(panoLayer);
      gsap.killTweensOf(overlay);

      const tl = gsap.timeline({
        onComplete: () => {
          isTransitioningRef.current = false;
        },
      });

      tl.to(panoLayer, {
        scale: 1.12,
        opacity: 0,
        duration: 0.4,
        ease: "power3.in",
      });

      tl.to(overlay, { opacity: 1, duration: 0.35, ease: "power2.in" }, 0);

      tl.call(() => {
        setActiveCategory(categoryId);
        setActiveSubcategory(subcategoryId);
        setActiveSceneId(newScene.id);
        setActiveSceneConfig(newScene);
      });

      tl.to({}, { duration: 0.15 });
      tl.set(panoLayer, { scale: 1.06 });

      tl.to(panoLayer, {
        scale: 1,
        opacity: 1,
        duration: 0.5,
        ease: "power2.out",
      });

      tl.to(overlay, { opacity: 0, duration: 0.4, ease: "power2.out" }, "<");
    },
    []
  );

  const handleNavSelect = useCallback(
    (categoryId, subcategoryId) => {
      if (
        categoryId === activeCategory &&
        subcategoryId === activeSubcategory
      )
        return;

      const result = getCategoryDefaultScene(bhkType, categoryId, subcategoryId);
      if (!result) return;

      const { scene, subcategoryId: resolvedSubId } = result;
      const urls = getPreviewUrls(bhkType, categoryId, resolvedSubId);
      preloadImages(urls);
      transitionToScene(scene, categoryId, resolvedSubId);
    },
    [bhkType, activeCategory, activeSubcategory, transitionToScene]
  );

  const handleHotspotClick = useCallback(
    (targetSceneId) => {
      if (isTransitioningRef.current) return;

      const result = findSceneById(bhkType, targetSceneId);
      if (!result) {
        console.warn("Scene not found:", targetSceneId);
        return;
      }

      const { scene, categoryId, subcategoryId } = result;
      transitionToScene(scene, categoryId, subcategoryId);
    },
    [bhkType, transitionToScene]
  );

  const handleViewChange = useCallback(({ yaw }) => {
    liveYawRef.current = yaw;
    if (radarGroupRef.current) {
      const config = activeSceneConfigRef.current;
      const deg = (config?.radarNorthOffset ?? 0) + (yaw * 180) / Math.PI;
      radarGroupRef.current.style.transform = `rotate(${deg}deg)`;
    }
  }, []);

  useEffect(() => {
    activeSceneConfigRef.current = activeSceneConfig;
    if (radarGroupRef.current && activeSceneConfig) {
      const deg =
        (activeSceneConfig.radarNorthOffset ?? 0) +
        (liveYawRef.current * 180) / Math.PI;
      radarGroupRef.current.style.transform = `rotate(${deg}deg)`;
    }
  }, [activeSceneConfig]);

  useEffect(() => {
    if (!containerRef.current) return;

    gsap.set(logoRef.current, { opacity: 0, x: -20 });
    gsap.set(closeRef.current, { opacity: 0, x: 20 });
    gsap.set(imageRef.current, { opacity: 0 });
    gsap.set(overlayRef.current, { opacity: 0 });
    gsap.set(miniMapRef.current, { opacity: 0, scale: 0.95 });
    gsap.set(soundControlsRef.current, { opacity: 0 });
    gsap.set(mobileFloorPlanRef.current, { opacity: 0, scale: 0.95 });
    if (transitionOverlayRef.current)
      gsap.set(transitionOverlayRef.current, { opacity: 0 });

    const mobileNavEl = mobileNavRef.current?.getContainerEl();
    if (mobileNavEl) gsap.set(mobileNavEl, { opacity: 0, scale: 0.95 });

    const navEl = navRef.current?.getContainerEl();
    if (navEl) gsap.set(navEl, { opacity: 0, y: 10 });
  }, []);

  useEffect(() => {
    if (!isReady || animationStartedRef.current || !containerRef.current)
      return;
    animationStartedRef.current = true;

    const tl = gsap.timeline({
      defaults: { ease: "power2.out" },
      delay: 0.05,
    });

    tl.to(imageRef.current, { opacity: 1, duration: 0.4 });
    tl.to(overlayRef.current, { opacity: 1, duration: 0.3 }, "-=0.2");

    tl.add(
      () => logoRef.current?.animateIn({ duration: 0.3, ease: "power2.out" }),
      "-=0.1"
    );
    tl.to(closeRef.current, { opacity: 1, x: 0, duration: 0.3 }, "-=0.2");

    const navEl = navRef.current?.getContainerEl();
    if (navEl) {
      tl.to(navEl, { opacity: 1, y: 0, duration: 0.3 }, "-=0.1");
    }

    tl.to(miniMapRef.current, { opacity: 1, scale: 1, duration: 0.3 }, "-=0.1");
    tl.to(soundControlsRef.current, { opacity: 1, duration: 0.2 }, "-=0.1");
    tl.to(mobileFloorPlanRef.current, { opacity: 1, scale: 1, duration: 0.2 }, "-=0.1");

    const mobileNavEl = mobileNavRef.current?.getContainerEl();
    if (mobileNavEl) {
      tl.to(mobileNavEl, { opacity: 1, scale: 1, duration: 0.2 }, "-=0.15");
    }
  }, [isReady]);

  const handleCloseEnter = () => {
    if (closeRef.current) {
      gsap.to(closeRef.current, {
        rotation: 90,
        scale: 1.1,
        backgroundColor: "rgba(245, 240, 235, 0.3)",
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
        backgroundColor: "rgba(245, 240, 235, 0.15)",
        duration: 0.4,
        ease: "power2.out",
      });
    }
  };

  // ── Radar geometry ────────────────────
  const currentHighlight = activeSceneConfig?.minimapPos || { x: 50, y: 50 };
  const cx = RADAR.size / 2;
  const cy = RADAR.size / 2;

  const wedgePath = useMemo(() => {
    const half = (RADAR.coneSpread / 2) * (Math.PI / 180);
    const x1 = cx + Math.sin(-half) * RADAR.coneRadius;
    const y1 = cy - Math.cos(-half) * RADAR.coneRadius;
    const x2 = cx + Math.sin(half) * RADAR.coneRadius;
    const y2 = cy - Math.cos(half) * RADAR.coneRadius;
    return `M ${cx} ${cy} L ${x1} ${y1} A ${RADAR.coneRadius} ${RADAR.coneRadius} 0 0 1 ${x2} ${y2} Z`;
  }, [cx, cy]);

  const edgeLines = useMemo(() => {
    const half = (RADAR.coneSpread / 2) * (Math.PI / 180);
    return {
      left:  { x: cx + Math.sin(-half) * RADAR.coneRadius, y: cy - Math.cos(-half) * RADAR.coneRadius },
      right: { x: cx + Math.sin(half)  * RADAR.coneRadius, y: cy - Math.cos(half)  * RADAR.coneRadius },
    };
  }, [cx, cy]);

  return (
    <div
      ref={containerRef}
      className="min-h-screen w-full relative overflow-hidden"
      style={{ backgroundColor: colors.bg }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Marcellus&display=swap');

        @keyframes rdrConePulse {
          0%   { opacity: 0.92; }
          50%  { opacity: 0.65; }
          100% { opacity: 0.92; }
        }
        @keyframes rdrRingPulse1 {
          0%   { r: ${RADAR.dotRadius + RADAR.dotStroke + 1}; opacity: 0.7; }
          70%  { opacity: 0.12; }
          100% { r: ${RADAR.dotRadius + RADAR.dotStroke + 15}; opacity: 0; }
        }
        @keyframes rdrRingPulse2 {
          0%   { r: ${RADAR.dotRadius + RADAR.dotStroke + 1}; opacity: 0.4; }
          70%  { opacity: 0.08; }
          100% { r: ${RADAR.dotRadius + RADAR.dotStroke + 11}; opacity: 0; }
        }
        @keyframes rdrHaloBreath {
          0%   { opacity: 0.3;  r: ${RADAR.haloRadius}; }
          50%  { opacity: 0.5;  r: ${RADAR.haloRadius + 3}; }
          100% { opacity: 0.3;  r: ${RADAR.haloRadius}; }
        }
      `}</style>

      {/* ── LAYER 1: Panorama ── */}
      <div
        ref={imageRef}
        className="absolute inset-0"
        style={{ zIndex: 1, willChange: "transform, opacity" }}
      >
        {activeSceneConfig ? (
          <PanoramaViewer
            key={activeSceneConfig.id}
            sceneConfig={activeSceneConfig}
            bhkType={bhkType}
            onHotspotClick={handleHotspotClick}
            onViewChange={handleViewChange}
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ backgroundColor: colors.bg }}
          >
            <span style={{ color: colors.textSecondary, opacity: 0.5 }}>
              Select a room to explore
            </span>
          </div>
        )}
      </div>

      {/* ── LAYER 2: Transition Overlay ── */}
      <div
        ref={transitionOverlayRef}
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 4, backgroundColor: "#1a1814", opacity: 0 }}
      />

      {/* ── LAYER 3: Decorative overlay ── */}
      <div
        ref={overlayRef}
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 2 }}
      />

      {/* ── LAYER 9: Top gradient ── */}
      <div
        className="absolute top-0 left-0 right-0 pointer-events-none"
        style={{
          zIndex: 9,
          height: "90px",
          background: `
            linear-gradient(
              to bottom,
              rgba(146, 120, 103, 1) 0%,
              rgba(146, 120, 103, 0.98) 8%,
              rgba(146, 120, 103, 0.94) 18%,
              rgba(146, 120, 103, 0.85) 28%,
              rgba(146, 120, 103, 0.72) 38%,
              rgba(146, 120, 103, 0.56) 48%,
              rgba(146, 120, 103, 0.38) 58%,
              rgba(146, 120, 103, 0.22) 68%,
              rgba(146, 120, 103, 0.1) 80%,
              rgba(146, 120, 103, 0.03) 92%,
              transparent 100%
            )
          `,
        }}
      />

      {/* ── 360° indicator + scene name ── */}
      {activeSceneConfig && (
        <div
          className="absolute flex items-center gap-2 px-3 py-1.5 rounded-full top-[4.5rem] left-6 md:top-10 md:left-1/2 md:transform md:-translate-x-1/2"
          style={{
            zIndex: 20,
            backgroundColor: "rgba(125, 102, 88, 0.85)",
            backdropFilter: "blur(10px)",
            boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
            border: "1px solid rgba(245, 240, 235, 0.2)",
          }}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="w-5 h-5 flex-shrink-0"
            stroke={colors.textPrimary}
            strokeWidth="1.5"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            <path d="M2 12h20" />
          </svg>
          <span
            className="text-xs uppercase tracking-normal"
            style={{
              fontFamily: "'Marcellus', serif",
              color: colors.textPrimary,
            }}
          >
            Drag to explore 360°
          </span>

          <span
            className="w-1 h-1 rounded-full flex-shrink-0"
            style={{ backgroundColor: colors.textPrimary, opacity: 0.4 }}
          />

          <span
            className="text-xs tracking-wide whitespace-nowrap"
            style={{
              fontFamily: "'Marcellus', serif",
              color: colors.textAccent,
            }}
          >
            {activeSceneConfig.label}
          </span>
        </div>
      )}

      {/* ── Header ── */}
      <header
        className="absolute top-0 left-0 right-0 flex justify-between items-center px-6 md:px-10 py-5"
        style={{ zIndex: 20 }}
      >
        <Logo
          ref={logoRef}
          className={"w-32 sm:w-40 md:w-48 lg:w-56 xl:w-44 h-auto"}
          onClick={handleClick}
        />

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

      {/* ── Bottom Controls ── */}
      <div
        className="absolute bottom-0 left-0 right-0 px-6 md:px-10 pb-6 pointer-events-none"
        style={{ zIndex: 20 }}
      >
        <div className="flex items-end justify-between gap-3 sm:gap-7">
          {/* Sound */}
          <div
            ref={soundControlsRef}
            className="flex items-center gap-3 sm:w-[280px] pointer-events-auto"
          >
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 hover:scale-110"
              style={{
                backgroundColor: "rgba(245, 240, 235, 0.15)",
                backdropFilter: "blur(10px)",
                boxShadow: "0 4px 15px rgba(0, 0, 0, 0.15)",
                border: "1px solid rgba(245, 240, 235, 0.2)",
              }}
            >
              {isMuted ? (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="w-5 h-5"
                  stroke={colors.textSecondary}
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
                  stroke={colors.textSecondary}
                  strokeWidth="2"
                >
                  <path d="M11 5L6 9H2v6h4l5 4V5z" />
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                </svg>
              )}
            </button>
          </div>

          {/* Center: Nav (desktop) */}
          <div className="hidden sm:flex flex-col items-center gap-2 pointer-events-auto">
            <RoomNav
              ref={navRef}
              categories={categories}
              activeCategory={activeCategory}
              activeSubcategory={activeSubcategory}
              onSelect={handleNavSelect}
              colors={colors}
            />
          </div>

          {/* Right (Mobile): Nav + Floor Plan */}
          <div className="sm:hidden flex flex-col items-end gap-2 pointer-events-auto">
            <MobileRoomNav
              ref={mobileNavRef}
              categories={categories}
              activeCategory={activeCategory}
              activeSubcategory={activeSubcategory}
              onSelect={handleNavSelect}
              colors={colors}
            />

            <button
              ref={mobileFloorPlanRef}
              onClick={onFloorPlanClick}
              className="flex items-center gap-2 px-4 py-3 rounded-xl transition-all duration-300 hover:scale-105 active:scale-95"
              style={{
                background: "rgba(125, 102, 88, 0.4)",
                backdropFilter: "blur(12px)",
                boxShadow: `
                  0 0 0 1px rgba(245, 240, 235, 0.1),
                  0 4px 15px rgba(0, 0, 0, 0.12),
                  0 10px 25px rgba(0, 0, 0, 0.15)
                `,
              }}
              aria-label="View Floor Plan"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="w-5 h-5"
                stroke={colors.textPrimary}
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
                  color: colors.textPrimary,
                  letterSpacing: "0.05em",
                }}
              >
                Floor Plan
              </span>
            </button>
          </div>

          {/* ═══════════════════════════════════════════
              Mini Map (desktop) with radar indicator
              ═══════════════════════════════════════════ */}
          <div
            ref={miniMapRef}
            onClick={onFloorPlanClick}
            className="hidden md:block relative w-[280px] h-[180px] rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.03] group pointer-events-auto"
            style={{
              background: "rgba(125, 102, 88, 0.4)",
              backdropFilter: "blur(12px)",
              boxShadow: `
                0 0 0 1px rgba(245, 240, 235, 0.1),
                0 4px 15px rgba(0, 0, 0, 0.12),
                0 10px 25px rgba(0, 0, 0, 0.15)
              `,
            }}
          >
            <img
              src={getFloorPlanImage()}
              alt={`${bhkType.toUpperCase()} Floor Plan`}
              className="w-full h-full object-cover p-2 rounded-2xl opacity-90 transition-opacity duration-300 group-hover:opacity-70"
            />

            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 z-10 flex items-center justify-center pointer-events-none">
              <span
                className="opacity-0 group-hover:opacity-100 text-sm font-medium transition-all duration-300 px-4 py-2 rounded-full transform scale-90 group-hover:scale-100"
                style={{
                  fontFamily: "'Marcellus', serif",
                  color: colors.textPrimary,
                  backgroundColor: "rgba(125, 102, 88, 0.9)",
                  backdropFilter: "blur(4px)",
                  boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
                }}
              >
                View Floor Plan
              </span>
            </div>

            {/* ── RADAR: Dark brown directional indicator ── */}
            <svg
              width={RADAR.size}
              height={RADAR.size}
              viewBox={`0 0 ${RADAR.size} ${RADAR.size}`}
              style={{
                position: "absolute",
                left: `${currentHighlight.x}%`,
                top: `${currentHighlight.y}%`,
                transform: "translate(-50%, -50%)",
                pointerEvents: "none",
                zIndex: 20,
                overflow: "visible",
                transition:
                  "left 0.5s cubic-bezier(0.4,0,0.2,1), top 0.5s cubic-bezier(0.4,0,0.2,1)",
              }}
            >
              <defs>
                {/* Cone: dark brown at centre → medium brown → fades out */}
                <radialGradient id="rdrConeFill" cx="50%" cy="50%" r="50%">
                  <stop offset="0%"   stopColor="#2c1e14" stopOpacity="0.95" />
                  <stop offset="20%"  stopColor="#3d2a1c" stopOpacity="0.8"  />
                  <stop offset="45%"  stopColor="#5c3d28" stopOpacity="0.55" />
                  <stop offset="70%"  stopColor="#7a5640" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#8b6450" stopOpacity="0"    />
                </radialGradient>

                {/* Warm highlight at centre for depth */}
                <radialGradient id="rdrConeInner" cx="50%" cy="50%" r="30%">
                  <stop offset="0%"   stopColor="#4a3020" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#4a3020" stopOpacity="0"   />
                </radialGradient>

                {/* Halo around dot — dark brown glow */}
                <radialGradient id="rdrHaloGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%"   stopColor="#3d2a1c" stopOpacity="0.6"  />
                  <stop offset="50%"  stopColor="#3d2a1c" stopOpacity="0.2"  />
                  <stop offset="100%" stopColor="#3d2a1c" stopOpacity="0"    />
                </radialGradient>

                {/* Soft blur for cone */}
                <filter id="rdrBlur">
                  <feGaussianBlur stdDeviation="0.8" />
                </filter>

                {/* Edge glow */}
                <filter id="rdrEdgeGlow">
                  <feGaussianBlur stdDeviation="0.5" />
                </filter>

                {/* Strong dark shadow under the dot */}
                <filter id="rdrDotShadow" x="-80%" y="-80%" width="260%" height="260%">
                  <feDropShadow dx="0" dy="0.5" stdDeviation="2" floodColor="#1a1008" floodOpacity="0.55" />
                </filter>
              </defs>

              {/* 1. Ambient halo — dark brown breathing glow */}
              <circle
                cx={cx} cy={cy}
                r={RADAR.haloRadius}
                fill="url(#rdrHaloGlow)"
                style={{ animation: "rdrHaloBreath 2.8s ease-in-out infinite" }}
              />

              {/* 2. Cone group — rotates via ref */}
              <g
                ref={radarGroupRef}
                style={{
                  transformOrigin: `${cx}px ${cy}px`,
                  willChange: "transform",
                }}
              >
                {/* 2a. Main cone — dark brown, slightly blurred */}
                <g
                  filter="url(#rdrBlur)"
                  style={{ animation: "rdrConePulse 2.8s ease-in-out infinite" }}
                >
                  <path d={wedgePath} fill="url(#rdrConeFill)" />
                </g>

                {/* 2b. Inner overlay for added density */}
                <path d={wedgePath} fill="url(#rdrConeInner)" opacity="0.8" />

                {/* 2c. Left edge — dark brown line */}
                <line
                  x1={cx} y1={cy}
                  x2={edgeLines.left.x} y2={edgeLines.left.y}
                  stroke="#3d2a1c"
                  strokeWidth="1.2"
                  opacity="0.7"
                  filter="url(#rdrEdgeGlow)"
                />

                {/* 2d. Right edge */}
                <line
                  x1={cx} y1={cy}
                  x2={edgeLines.right.x} y2={edgeLines.right.y}
                  stroke="#3d2a1c"
                  strokeWidth="1.2"
                  opacity="0.7"
                  filter="url(#rdrEdgeGlow)"
                />
              </g>

              {/* 3. Pulse ring 1 — dark brown */}
              <circle
                cx={cx} cy={cy}
                r={RADAR.dotRadius + RADAR.dotStroke + 1}
                fill="none"
                stroke="#3d2a1c"
                strokeWidth="1.8"
                opacity="0"
                style={{ animation: "rdrRingPulse1 2.6s ease-out infinite" }}
              />

              {/* 4. Pulse ring 2 — staggered, lighter brown */}
              <circle
                cx={cx} cy={cy}
                r={RADAR.dotRadius + RADAR.dotStroke + 1}
                fill="none"
                stroke="#5c3d28"
                strokeWidth="1"
                opacity="0"
                style={{ animation: "rdrRingPulse2 2.6s ease-out 1.3s infinite" }}
              />

              {/* 5. Dark shadow backdrop for the dot */}
              <circle
                cx={cx} cy={cy}
                r={RADAR.dotRadius + RADAR.dotStroke + 1}
                fill="#2c1e14"
                opacity="0.4"
                filter="url(#rdrDotShadow)"
              />

              {/* 6. Outer white ring — crisp contrast */}
              <circle
                cx={cx} cy={cy}
                r={RADAR.dotRadius + RADAR.dotStroke}
                fill="#f5f0eb"
              />

              {/* 7. Dark brown centre dot */}
              <circle
                cx={cx} cy={cy}
                r={RADAR.dotRadius}
                fill="#3d2a1c"
              />

              {/* 8. Specular highlight */}
              <circle
                cx={cx - 1.5}
                cy={cy - 1.5}
                r="1.5"
                fill="#fff"
                opacity="0.4"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Bottom line */}
      <div
        className="absolute bottom-0 right-0 left-0 pointer-events-none"
        style={{ zIndex: 15 }}
      >
        <div
          className="h-px mx-6 md:mx-10 opacity-20"
          style={{
            background: `linear-gradient(90deg, transparent 0%, ${colors.textSecondary} 20%, ${colors.textPrimary} 50%, ${colors.textSecondary} 80%, transparent 100%)`,
          }}
        />
      </div>
    </div>
  );
};

export default MainPage;