import React, { useRef, useState, useCallback, useEffect } from "react";
import { gsap, useGSAP } from "/gsap.config.js";
import Logo from "../components/Logo";
import { useNavigate } from "react-router-dom";

const ZOOM_STEP = 0.3;
const MIN_ZOOM = 1;
const MAX_ZOOM = 4;

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
  const controlsRef = useRef(null);
  const navigate = useNavigate();

  // Pan & zoom state
  const viewportRef = useRef(null);
  const imageWrapRef = useRef(null);
  const scaleRef = useRef(1);
  const posRef = useRef({ x: 0, y: 0 });
  const dragRef = useRef({
    active: false,
    startX: 0,
    startY: 0,
    originX: 0,
    originY: 0,
  });
  const [zoomLevel, setZoomLevel] = useState(1);

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

  // ── Apply transform ──
  const applyTransform = useCallback(() => {
    if (!imageWrapRef.current) return;
    gsap.set(imageWrapRef.current, {
      x: posRef.current.x,
      y: posRef.current.y,
      scale: scaleRef.current,
    });
  }, []);

  // ── Clamp position so image doesn't fly off ──
  const clampPosition = useCallback(() => {
    const viewport = viewportRef.current;
    const wrap = imageWrapRef.current;
    if (!viewport || !wrap) return;

    const vw = viewport.clientWidth;
    const vh = viewport.clientHeight;
    const s = scaleRef.current;

    const maxPanX = Math.max(0, (vw * (s - 1)) / 2);
    const maxPanY = Math.max(0, (vh * (s - 1)) / 2);

    posRef.current.x = Math.max(-maxPanX, Math.min(maxPanX, posRef.current.x));
    posRef.current.y = Math.max(-maxPanY, Math.min(maxPanY, posRef.current.y));
  }, []);

  // ── Zoom helpers ──
  const animateZoom = useCallback(
    (newScale) => {
      const clamped = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, newScale));
      scaleRef.current = clamped;
      clampPosition();
      setZoomLevel(clamped);

      gsap.to(imageWrapRef.current, {
        x: posRef.current.x,
        y: posRef.current.y,
        scale: clamped,
        duration: 0.35,
        ease: "power2.out",
      });
    },
    [clampPosition]
  );

  const handleZoomIn = useCallback(() => {
    animateZoom(scaleRef.current + ZOOM_STEP);
  }, [animateZoom]);

  const handleZoomOut = useCallback(() => {
    animateZoom(scaleRef.current - ZOOM_STEP);
  }, [animateZoom]);

  const handleReset = useCallback(() => {
    scaleRef.current = 1;
    posRef.current = { x: 0, y: 0 };
    setZoomLevel(1);

    gsap.to(imageWrapRef.current, {
      x: 0,
      y: 0,
      scale: 1,
      duration: 0.4,
      ease: "power3.out",
    });
  }, []);

  // ── Mouse / touch drag ──
  const onPointerDown = useCallback((e) => {
    if (scaleRef.current <= 1) return;
    e.preventDefault();
    dragRef.current = {
      active: true,
      startX: e.clientX ?? e.touches?.[0]?.clientX ?? 0,
      startY: e.clientY ?? e.touches?.[0]?.clientY ?? 0,
      originX: posRef.current.x,
      originY: posRef.current.y,
    };
    if (viewportRef.current) viewportRef.current.style.cursor = "grabbing";
  }, []);

  const onPointerMove = useCallback(
    (e) => {
      if (!dragRef.current.active) return;
      const cx = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
      const cy = e.clientY ?? e.touches?.[0]?.clientY ?? 0;
      posRef.current.x = dragRef.current.originX + (cx - dragRef.current.startX);
      posRef.current.y = dragRef.current.originY + (cy - dragRef.current.startY);
      clampPosition();
      applyTransform();
    },
    [clampPosition, applyTransform]
  );

  const onPointerUp = useCallback(() => {
    dragRef.current.active = false;
    if (viewportRef.current)
      viewportRef.current.style.cursor =
        scaleRef.current > 1 ? "grab" : "default";
  }, []);

  // ── Mouse wheel zoom ──
  const onWheel = useCallback(
    (e) => {
      e.preventDefault();
      const delta = e.deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP;
      animateZoom(scaleRef.current + delta);
    },
    [animateZoom]
  );

  // ── Pinch zoom (touch) ──
  const lastPinchDist = useRef(null);

  const onTouchStart = useCallback(
    (e) => {
      if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        lastPinchDist.current = Math.hypot(dx, dy);
      } else if (e.touches.length === 1 && scaleRef.current > 1) {
        onPointerDown(e);
      }
    },
    [onPointerDown]
  );

  const onTouchMove = useCallback(
    (e) => {
      if (e.touches.length === 2 && lastPinchDist.current !== null) {
        e.preventDefault();
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const dist = Math.hypot(dx, dy);
        const diff = dist - lastPinchDist.current;
        lastPinchDist.current = dist;
        const newScale = scaleRef.current + diff * 0.008;
        scaleRef.current = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, newScale));
        clampPosition();
        setZoomLevel(scaleRef.current);
        applyTransform();
      } else if (e.touches.length === 1) {
        onPointerMove(e);
      }
    },
    [clampPosition, applyTransform, onPointerMove]
  );

  const onTouchEnd = useCallback(() => {
    lastPinchDist.current = null;
    onPointerUp();
  }, [onPointerUp]);

  // ── Attach wheel listener (passive: false needed) ──
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [onWheel]);

  // Entry animations
  useGSAP(
    () => {
      const ctx = gsap.context(() => {
        gsap.set(logoContainerRef.current, { opacity: 0, x: -30 });
        gsap.set(closeRef.current, { opacity: 0, x: 30 });
        gsap.set(".floor-plan-container", { opacity: 0, scale: 0.97 });
        gsap.set(".sound-controls", { opacity: 0, x: -20 });
        gsap.set(controlsRef.current, { opacity: 0, y: 10 });
        gsap.set(".particle", { opacity: 0 });
        gsap.set(".floor-plan-title", { opacity: 0, y: -15 });

        const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

        tl.to(
          ".floor-plan-container",
          { opacity: 1, scale: 1, duration: 0.6 },
          0.2
        )
          .to(".floor-plan-title", { opacity: 1, y: 0, duration: 0.5 }, 0.35)
          .to(
            logoContainerRef.current,
            { opacity: 1, x: 0, duration: 0.5 },
            0.3
          )
          .add(() => {
            if (logoRef.current?.animateIn) {
              logoRef.current.animateIn({ duration: 0.3, ease: "power2.out" });
            }
          }, 0.35)
          .to(closeRef.current, { opacity: 1, x: 0, duration: 0.5 }, 0.3)
          .to(controlsRef.current, { opacity: 1, y: 0, duration: 0.4 }, 0.4)
          .to(".sound-controls", { opacity: 1, x: 0, duration: 0.4 }, 0.5)
          .to(
            ".particle",
            { opacity: 0.3, stagger: 0.1, duration: 0.5 },
            0.6
          );

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

  const isMinZoom = zoomLevel <= MIN_ZOOM;
  const isMaxZoom = zoomLevel >= MAX_ZOOM;

  return (
    <div
      ref={containerRef}
      className="h-screen w-full relative overflow-hidden flex flex-col"
      style={{ backgroundColor: colors.bg }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,400&family=Marcellus&display=swap');
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
        className="flex-1 min-h-0 flex flex-col items-center justify-center"
        style={{ zIndex: 10 }}
      >
        {/* Title */}
        <div className="flex-none text-center mb-4 floor-plan-title">
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

        {/* Floor Plan wrapper with radial bg + top/bottom fade overlays */}
        <div
          className="floor-plan-container w-full flex-1 min-h-0 max-w-6xl relative"
          style={{
            opacity: 0,
            background: `radial-gradient(
              ellipse 70% 70% at 50% 50%,
              rgba(230, 216, 204, 0.22) 0%,
              rgba(230, 216, 204, 0.18) 25%,
              rgba(230, 216, 204, 0.10) 50%,
              rgba(230, 216, 204, 0.04) 70%,
              transparent 100%
            )`,
          }}
        >
          {/* Pannable / zoomable image area */}
          <div
            ref={viewportRef}
            className="w-full h-full overflow-hidden"
            style={{ cursor: zoomLevel > 1 ? "grab" : "default" }}
            onMouseDown={onPointerDown}
            onMouseMove={onPointerMove}
            onMouseUp={onPointerUp}
            onMouseLeave={onPointerUp}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <div
              ref={imageWrapRef}
              className="w-full h-full flex items-center justify-center"
              style={{
                willChange: "transform",
                transformOrigin: "center center",
              }}
            >
              <img
                src={floorplanImage}
                alt={`${bhkType.toUpperCase()} Floor Plan`}
                className="max-w-full max-h-full object-contain select-none"
                draggable={false}
              />
            </div>
          </div>

          {/* Top gradient fade — dissolves the image top edge into the page */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "22%",
              background: `linear-gradient(to bottom, ${colors.bg} 0%, ${colors.bg}CC 20%, ${colors.bg}66 50%, transparent 100%)`,
              pointerEvents: "none",
              zIndex: 2,
            }}
          />

          {/* Bottom gradient fade — dissolves the image bottom edge into the page */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "22%",
              background: `linear-gradient(to top, ${colors.bg} 0%, ${colors.bg}CC 20%, ${colors.bg}66 50%, transparent 100%)`,
              pointerEvents: "none",
              zIndex: 2,
            }}
          />
        </div>
      </main>

      {/* Footer */}
      <div
        className="flex-none px-4 md:px-10 pb-4 sm:pb-5 md:pb-6 pt-3"
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

          {/* Center: Zoom / Pan Controls */}
          <div
            ref={controlsRef}
            className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-2 rounded-full"
            style={{
              background: "rgba(125, 102, 88, 0.6)",
              backdropFilter: "blur(14px)",
              border: "1px solid rgba(245, 240, 235, 0.15)",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
            }}
          >
            {/* Zoom Out */}
            <button
              onClick={handleZoomOut}
              disabled={isMinZoom}
              className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-30 disabled:hover:scale-100"
              style={{
                backgroundColor: isMinZoom
                  ? "transparent"
                  : "rgba(245, 240, 235, 0.12)",
              }}
              aria-label="Zoom out"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="w-4 h-4 sm:w-5 sm:h-5"
                stroke={colors.textPrimary}
                strokeWidth="2"
                strokeLinecap="round"
              >
                <circle cx="11" cy="11" r="7" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                <line x1="8" y1="11" x2="14" y2="11" />
              </svg>
            </button>

            {/* Zoom indicator */}
            <span
              className="text-xs sm:text-sm font-medium min-w-[3rem] text-center select-none"
              style={{
                fontFamily: "'Marcellus', serif",
                color: colors.textPrimary,
                opacity: 0.85,
              }}
            >
              {Math.round(zoomLevel * 100)}%
            </span>

            {/* Zoom In */}
            <button
              onClick={handleZoomIn}
              disabled={isMaxZoom}
              className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-30 disabled:hover:scale-100"
              style={{
                backgroundColor: isMaxZoom
                  ? "transparent"
                  : "rgba(245, 240, 235, 0.12)",
              }}
              aria-label="Zoom in"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="w-4 h-4 sm:w-5 sm:h-5"
                stroke={colors.textPrimary}
                strokeWidth="2"
                strokeLinecap="round"
              >
                <circle cx="11" cy="11" r="7" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                <line x1="8" y1="11" x2="14" y2="11" />
                <line x1="11" y1="8" x2="11" y2="14" />
              </svg>
            </button>

            {/* Divider */}
            <div
              className="w-px h-6 mx-1"
              style={{ backgroundColor: "rgba(245, 240, 235, 0.2)" }}
            />

            {/* Reset / Fit */}
            <button
              onClick={handleReset}
              disabled={isMinZoom}
              className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-30 disabled:hover:scale-100"
              style={{
                backgroundColor: isMinZoom
                  ? "transparent"
                  : "rgba(245, 240, 235, 0.12)",
              }}
              aria-label="Reset view"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="w-4 h-4 sm:w-5 sm:h-5"
                stroke={colors.textPrimary}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 3h6v6" />
                <path d="M9 21H3v-6" />
                <path d="M21 3l-7 7" />
                <path d="M3 21l7-7" />
              </svg>
            </button>
          </div>

          {/* Spacer to balance layout on desktop */}
          <div className="w-10 hidden sm:block" />
        </div>
      </div>
    </div>
  );
};

export default FloorPlanPage;