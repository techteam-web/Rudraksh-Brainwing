import React, { useEffect, useRef, useState, useCallback } from "react";
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

  // Component refs
  const navRef = useRef(null);
  const mobileNavRef = useRef(null);

  // Transition overlay
  const transitionOverlayRef = useRef(null);

  // Mobile Floor Plan Button
  const mobileFloorPlanRef = useRef(null);

  // State
  const [isMuted, setIsMuted] = useState(false);
  const isTransitioningRef = useRef(false);

  // Navigation state
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeSubcategory, setActiveSubcategory] = useState(null);
  const [activeSceneId, setActiveSceneId] = useState(null);
  const [activeSceneConfig, setActiveSceneConfig] = useState(null);

  // Categories from config
  const categories = getCategories(bhkType);

  const handleClick = () => {
    navigate("/");
  };

  // Color theme
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

  // --- Initialize default scene on mount ---
  useEffect(() => {
    const defaultScene = getDefaultScene(bhkType);
    if (defaultScene) {
      setActiveCategory(defaultScene.categoryId);
      setActiveSubcategory(defaultScene.subcategoryId);
      setActiveSceneId(defaultScene.scene.id);
      setActiveSceneConfig(defaultScene.scene);
    }
  }, [bhkType]);

  // ─────────────────────────────────────────────
  //  GSAP zoom-in + fade transition
  //  Only animates transform (scale) and opacity
  //  for guaranteed 60fps compositing.
  // ─────────────────────────────────────────────
  const transitionToScene = useCallback(
    (newScene, categoryId, subcategoryId) => {
      if (isTransitioningRef.current) return;
      isTransitioningRef.current = true;

      const panoLayer = imageRef.current;
      const overlay = transitionOverlayRef.current;

      // Kill any in-progress tweens on these elements
      gsap.killTweensOf(panoLayer);
      gsap.killTweensOf(overlay);

      const tl = gsap.timeline({
        onComplete: () => {
          isTransitioningRef.current = false;
        },
      });

      // Phase 1 — zoom in + fade out current scene
      tl.to(panoLayer, {
        scale: 1.12,
        opacity: 0,
        duration: 0.4,
        ease: "power3.in",
      });

      // Dark overlay rises alongside
      tl.to(
        overlay,
        {
          opacity: 1,
          duration: 0.35,
          ease: "power2.in",
        },
        0 // start at same time as zoom
      );

      // Phase 2 — swap scene while hidden
      tl.call(() => {
        setActiveCategory(categoryId);
        setActiveSubcategory(subcategoryId);
        setActiveSceneId(newScene.id);
        setActiveSceneConfig(newScene);
      });

      // Tiny pause for React to mount the new PanoramaViewer
      tl.to({}, { duration: 0.15 });

      // Phase 3 — reset scale to slightly zoomed, then reveal
      tl.set(panoLayer, { scale: 1.06 });

      tl.to(panoLayer, {
        scale: 1,
        opacity: 1,
        duration: 0.5,
        ease: "power2.out",
      });

      tl.to(
        overlay,
        {
          opacity: 0,
          duration: 0.4,
          ease: "power2.out",
        },
        "<" // same start as the reveal
      );
    },
    []
  );

  // --- Handle nav category/subcategory selection ---
  const handleNavSelect = useCallback(
    (categoryId, subcategoryId) => {
      if (
        categoryId === activeCategory &&
        subcategoryId === activeSubcategory
      )
        return;

      const result = getCategoryDefaultScene(
        bhkType,
        categoryId,
        subcategoryId
      );
      if (!result) return;

      const { scene, subcategoryId: resolvedSubId } = result;

      // Preload previews
      const urls = getPreviewUrls(bhkType, categoryId, resolvedSubId);
      preloadImages(urls);

      transitionToScene(scene, categoryId, resolvedSubId);
    },
    [bhkType, activeCategory, activeSubcategory, transitionToScene]
  );

  // --- Handle hotspot click ---
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

  // --- Set initial hidden states ---
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

  // --- Entrance animation ---
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

    tl.to(
      miniMapRef.current,
      { opacity: 1, scale: 1, duration: 0.3 },
      "-=0.1"
    );
    tl.to(soundControlsRef.current, { opacity: 1, duration: 0.2 }, "-=0.1");
    tl.to(
      mobileFloorPlanRef.current,
      { opacity: 1, scale: 1, duration: 0.2 },
      "-=0.1"
    );

    const mobileNavEl = mobileNavRef.current?.getContainerEl();
    if (mobileNavEl) {
      tl.to(mobileNavEl, { opacity: 1, scale: 1, duration: 0.2 }, "-=0.15");
    }
  }, [isReady]);

  // Close button hover
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

  // Minimap dot position
  // Minimap dot reads position from the active scene's minimapPos
  const currentHighlight = activeSceneConfig?.minimapPos || { x: 50, y: 50 };

  return (
    <div
      ref={containerRef}
      className="min-h-screen w-full relative overflow-hidden"
      style={{ backgroundColor: colors.bg }}
    >
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Marcellus&display=swap');
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
            onHotspotClick={handleHotspotClick}
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
        style={{
          zIndex: 4,
          backgroundColor: "#1a1814",
          opacity: 0,
        }}
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

      {/* ── 360° indicator ── */}
      {activeSceneConfig && (
        <div
          className="absolute top-10 left-1/2 transform -translate-x-1/2 items-center gap-2 px-2 py-1 rounded-full hidden md:flex"
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
            className="w-5 h-5"
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
        className="absolute bottom-0 left-0 right-0 px-6 md:px-10 pb-6"
        style={{ zIndex: 20 }}
      >
        <div className="flex items-end justify-between gap-3 sm:gap-7">
          {/* Sound */}
          <div
            ref={soundControlsRef}
            className="flex items-center gap-3 sm:w-[280px]"
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

          {/* Right (Mobile): Nav + Floor Plan */}
          <div className="sm:hidden flex flex-col items-end gap-2">
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

          {/* Mini Map (desktop) */}
          <div
            ref={miniMapRef}
            onClick={onFloorPlanClick}
            className="hidden md:block relative w-[280px] h-[180px] rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.03] group"
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

            {/* Room Highlight Dot */}
            <div
              className="minimap-highlight absolute w-4 h-4 rounded-full border-2"
              style={{
                backgroundColor: "rgba(148, 112, 88, 0.9)",
                borderColor: colors.textPrimary,
                boxShadow: `
                  0 0 8px ${colors.textAccent},
                  0 0 16px ${colors.textAccent}80,
                  0 0 24px ${colors.textAccent}40
                `,
                left: currentHighlight.x + "%",
                top: currentHighlight.y + "%",
                transform: "translate(-50%, -50%)",
                transition:
                  "left 0.5s cubic-bezier(0.4, 0, 0.2, 1), top 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                zIndex: 20,
              }}
            >
              <div
                className="absolute inset-0 rounded-full animate-ping"
                style={{
                  backgroundColor: colors.textAccent,
                  opacity: 0.4,
                  animationDuration: "2s",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom line */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
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