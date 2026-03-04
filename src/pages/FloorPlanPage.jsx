import React, { useRef, useState, useCallback } from "react";
import { gsap, useGSAP } from "/gsap.config.js";
import Logo from "../components/Logo";
import RoomCarousel from "../components/RoomCarousel";
import { useNavigate } from "react-router-dom";

const FloorPlanPage = ({
  onClose,
  onRoomSelect,
  bhkType = "4bhk",
  initialRoom = null,
}) => {
  const containerRef = useRef(null);
  const [activeRoom, setActiveRoom] = useState(initialRoom || "Living");
  const [isMuted, setIsMuted] = useState(false);
  const logoRef = useRef(null);
  const logoContainerRef = useRef(null);
  const closeRef = useRef(null);
  const carouselRef = useRef(null);
  const navigate = useNavigate();

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

  // Room data with dynamic paths based on bhkType
  const basePath = `/assets/${bhkType}/rooms/preview`;

  const rooms =
    bhkType === "4bhk"
      ? [
          { id: "Arrival", name: "Arrival Space", description: "Grand entrance foyer", x: 18, y: 25, image: `${basePath}/arrival.webp` },
          { id: "Living", name: "Family Lounge", description: "Spacious living area", x: 45, y: 25, image: `${basePath}/livingroom.webp` },
          { id: "Kitchen", name: "Heart of the Home", description: "Modern culinary space", x: 45, y: 65, image: `${basePath}/kitchen.webp` },
          { id: "Bedroom", name: "Private Retreat", description: "Master bedroom suite", x: 72, y: 25, image: `${basePath}/bedroom.webp` },
          { id: "Balcony", name: "Open-Air Escape", description: "Scenic outdoor space", x: 18, y: 65, image: `${basePath}/balcony.webp` },
          { id: "Kids Bedroom 1", name: "Kids Room 1", description: "Playful kids space", x: 88, y: 25, image: `${basePath}/kids-bedroom-1.webp`, is360: true },
          { id: "Kids Bedroom 2", name: "Kids Room 2", description: "Cozy kids retreat", x: 88, y: 70, image: `${basePath}/kids-bedroom-2.webp`, is360: true },
        ]
      : [
          { id: "Arrival", name: "Arrival Space", description: "Grand entrance foyer", x: 18, y: 25, image: `${basePath}/arrival.webp` },
          { id: "Living", name: "Family Lounge", description: "Spacious living area", x: 45, y: 25, image: `${basePath}/livingroom.webp` },
          { id: "Kitchen", name: "Heart of the Home", description: "Modern culinary space", x: 45, y: 65, image: `${basePath}/kitchen.webp` },
          { id: "Bedroom", name: "Private Retreat", description: "Master bedroom suite", x: 72, y: 25, image: `${basePath}/bedroom.webp` },
          { id: "Balcony", name: "Open-Air Escape", description: "Scenic outdoor space", x: 18, y: 65, image: `${basePath}/balcony.webp` },
          { id: "Kids Bedroom", name: "Kids Room", description: "Playful kids space", x: 88, y: 45, image: `${basePath}/kids-bedroom.webp`, is360: true },
        ];

  // Floorplan image path
  const floorplanImage = `/assets/${bhkType}/floorplan/${bhkType.toUpperCase()} PLAN.jpg`;

  // Entry animations
  useGSAP(
    () => {
      const ctx = gsap.context(() => {
        gsap.set(logoContainerRef.current, { opacity: 0, x: -30 });
        gsap.set(closeRef.current, { opacity: 0, x: 30 });
        gsap.set(".floor-plan-container", { opacity: 0, scale: 0.95 });
        gsap.set(".sound-controls", { opacity: 0, x: -20 });
        gsap.set(".particle", { opacity: 0 });

        const carouselEl = carouselRef.current?.getContainerEl();
        if (carouselEl) {
          gsap.set(carouselEl, { opacity: 0, y: 20 });
        }

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

        if (carouselEl) {
          tl.to(carouselEl, { opacity: 1, y: 0, duration: 0.5 }, 0.4);
        }

        tl.to(
            ".carousel-item",
            { opacity: 1, y: 0, stagger: 0.05, duration: 0.4 },
            0.5
          )
          .to(".sound-controls", { opacity: 1, x: 0, duration: 0.4 }, 0.5)
          .to(".particle", { opacity: 0.3, stagger: 0.1, duration: 0.5 }, 0.6);

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

  const handleRoomChange = useCallback(
    (roomId) => {
      setActiveRoom(roomId);
    },
    []
  );

  return (
    <div
      ref={containerRef}
      className="h-screen w-full relative overflow-hidden flex flex-col"
      style={{ backgroundColor: colors.bg }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,400&family=Marcellus&display=swap');
        
        .floor-plan-hotspot:hover .room-label {
          opacity: 1;
          transform: translateY(0);
        }
        
        .room-label {
          opacity: 0;
          transform: translateY(5px);
          transition: opacity 0.2s, transform 0.2s;
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

      {/* 1st Stack: Header — flex-none keeps it from shrinking/growing */}
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

      {/* 2nd Stack: Main Content — flex-1 min-h-0 strictly contains it between header & footer */}
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
          {/* Title Area */}
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

          {/* Image Area — dynamically scales without pushing out */}
          <div className="flex-1 min-h-0 w-full flex items-center justify-center">
            <img
              src={floorplanImage}
              alt={`${bhkType.toUpperCase()} Floor Plan`}
              className="max-w-full max-h-full object-contain drop-shadow-lg"
            />
          </div>
        </div>
      </main>

      {/* 3rd Stack: Footer — flex-none locks it to the bottom */}
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

          {/* Room Carousel Component */}
          <RoomCarousel
            ref={carouselRef}
            rooms={rooms}
            activeRoom={activeRoom}
            onRoomChange={handleRoomChange}
            colors={colors}
            className="max-w-[75vw]"
          />

          <div className="w-10" />
        </div>
      </div>
    </div>
  );
};

export default FloorPlanPage;