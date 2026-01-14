import React, { useRef, useState, useCallback } from "react";
import { gsap, useGSAP } from "/gsap.config.js";
import Logo from "../components/Logo";

const FloorPlanPage = ({
  onClose,
  onRoomSelect,
  bhkType = "4bhk",
  initialRoom = null,
}) => {
  const containerRef = useRef(null);
  const carouselItemsRef = useRef([]);
  const [activeRoom, setActiveRoom] = useState(initialRoom || "Living");
  const [isMuted, setIsMuted] = useState(false);
  const logoRef = useRef(null);
  const logoContainerRef = useRef(null);
  const closeRef = useRef(null);

  // Reset refs on mount
  useGSAP(
    () => {
      carouselItemsRef.current = [];
    },
    { scope: containerRef }
  );

  const addToCarouselItems = (el) => {
    if (el && !carouselItemsRef.current.includes(el)) {
      carouselItemsRef.current.push(el);
    }
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
          {
            id: "Arrival",
            name: "Arrival Space",
            description: "Grand entrance foyer",
            x: 18,
            y: 25,
            image: `${basePath}/arrival.webp`,
          },
          {
            id: "Living",
            name: "Family Lounge",
            description: "Spacious living area",
            x: 45,
            y: 25,
            image: `${basePath}/livingroom.webp`,
          },
          {
            id: "Kitchen",
            name: "Heart of the Home",
            description: "Modern culinary space",
            x: 45,
            y: 65,
            image: `${basePath}/kitchen.webp`,
          },
          {
            id: "Bedroom",
            name: "Private Retreat",
            description: "Master bedroom suite",
            x: 72,
            y: 25,
            image: `${basePath}/bedroom.webp`,
          },
          {
            id: "Balcony",
            name: "Open-Air Escape",
            description: "Scenic outdoor space",
            x: 18,
            y: 65,
            image: `${basePath}/balcony.webp`,
          },
          {
            id: "Kids Bedroom 1",
            name: "Kids Room 1",
            description: "Playful kids space",
            x: 88,
            y: 25,
            image: `${basePath}/kids-bedroom-1.webp`,
            is360: true,
          },
          {
            id: "Kids Bedroom 2",
            name: "Kids Room 2",
            description: "Cozy kids retreat",
            x: 88,
            y: 70,
            image: `${basePath}/kids-bedroom-2.webp`,
            is360: true,
          },
        ]
      : [
          {
            id: "Arrival",
            name: "Arrival Space",
            description: "Grand entrance foyer",
            x: 18,
            y: 25,
            image: `${basePath}/arrival.webp`,
          },
          {
            id: "Living",
            name: "Family Lounge",
            description: "Spacious living area",
            x: 45,
            y: 25,
            image: `${basePath}/livingroom.webp`,
          },
          {
            id: "Kitchen",
            name: "Heart of the Home",
            description: "Modern culinary space",
            x: 45,
            y: 65,
            image: `${basePath}/kitchen.webp`,
          },
          {
            id: "Bedroom",
            name: "Private Retreat",
            description: "Master bedroom suite",
            x: 72,
            y: 25,
            image: `${basePath}/bedroom.webp`,
          },
          {
            id: "Balcony",
            name: "Open-Air Escape",
            description: "Scenic outdoor space",
            x: 18,
            y: 65,
            image: `${basePath}/balcony.webp`,
          },
          {
            id: "Kids Bedroom",
            name: "Kids Room",
            description: "Playful kids space",
            x: 88,
            y: 45,
            image: `${basePath}/kids-bedroom.webp`,
            is360: true,
          },
        ];

  // Floorplan image path
  const floorplanImage = `/assets/${bhkType}/floorplan/${bhkType.toUpperCase()} PLAN.jpg`;

  // Single optimized useGSAP for all entry animations
  useGSAP(
    () => {
      const ctx = gsap.context(() => {
        // Set initial states - use logoContainerRef for the wrapper
        gsap.set(logoContainerRef.current, { opacity: 0, x: -30 });
        gsap.set(closeRef.current, { opacity: 0, x: 30 });
        gsap.set(".floor-plan-container", { opacity: 0, scale: 0.95 });
        gsap.set(".carousel-wrapper", { opacity: 0, y: 20 });
        gsap.set(".sound-controls", { opacity: 0, x: -20 });
        gsap.set(".mandala-center", { opacity: 0, scale: 0.9 });
        gsap.set(".mandala-side", { opacity: 0 });
        gsap.set(".particle", { opacity: 0 });

        // Main entry timeline
        const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

        tl.to(".mandala-center", { opacity: 0.25, scale: 1, duration: 0.8 }, 0)
          .to(".mandala-side", { opacity: 0.15, duration: 0.8 }, 0.1)
          .to(
            ".floor-plan-container",
            { opacity: 1, scale: 1, duration: 0.6 },
            0.2
          )
          // Animate logo container
          .to(logoContainerRef.current, { opacity: 1, x: 0, duration: 0.5 }, 0.3)
          // Also try to call animateIn if the Logo component supports it
          .add(() => {
            if (logoRef.current?.animateIn) {
              logoRef.current.animateIn({ duration: 0.3, ease: "power2.out" });
            }
          }, 0.35)
          .to(closeRef.current, { opacity: 1, x: 0, duration: 0.5 }, 0.3)
          .to(".carousel-wrapper", { opacity: 1, y: 0, duration: 0.5 }, 0.4)
          .to(
            ".carousel-item",
            { opacity: 1, y: 0, stagger: 0.05, duration: 0.4 },
            0.5
          )
          .to(".sound-controls", { opacity: 1, x: 0, duration: 0.4 }, 0.5)
          .to(".particle", { opacity: 0.3, stagger: 0.1, duration: 0.5 }, 0.6);

        // Slow mandala rotations - use will-change for GPU acceleration
        gsap.to(".mandala-center", {
          rotation: 360,
          duration: 120,
          repeat: -1,
          ease: "none",
        });

        gsap.to(".mandala-left", {
          rotation: 360,
          duration: 150,
          repeat: -1,
          ease: "none",
        });

        gsap.to(".mandala-right", {
          rotation: -360,
          duration: 150,
          repeat: -1,
          ease: "none",
        });

        // Simplified particle animation
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

  const handleCarouselItemEnter = useCallback((index) => {
    gsap.to(carouselItemsRef.current[index], {
      scale: 1.05,
      y: -4,
      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.25)",
      duration: 0.15,
      ease: "power2.out",
    });
  }, []);

  const handleCarouselItemLeave = useCallback((index) => {
    gsap.to(carouselItemsRef.current[index], {
      scale: 1,
      y: 0,
      boxShadow: "0 4px 15px rgba(0, 0, 0, 0.15)",
      duration: 0.15,
      ease: "power2.out",
    });
  }, []);

  const handleHotspotClick = useCallback((room) => {
    setActiveRoom(room.id);

    gsap.to(`.hotspot-${room.id.replace(/\s+/g, "-")}`, {
      scale: 1.3,
      duration: 0.2,
      yoyo: true,
      repeat: 1,
    });
  }, []);

  const handleRoomClick = useCallback((room) => {
    setActiveRoom(room.id);
  }, []);

  const handleRoomNavigate = useCallback(
    (room) => {
      onRoomSelect?.(room.id);
    },
    [onRoomSelect]
  );

  return (
    <div
      ref={containerRef}
      className="min-h-screen w-full relative overflow-hidden"
      style={{ backgroundColor: colors.bg }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,400&family=Marcellus&display=swap');
        
        .carousel-item {
          opacity: 0;
          transform: translateY(10px);
        }
        
        .floor-plan-hotspot:hover .room-label {
          opacity: 1;
          transform: translateY(0);
        }
        
        .room-label {
          opacity: 0;
          transform: translateY(5px);
          transition: opacity 0.2s, transform 0.2s;
        }

        .mandala-center, .mandala-side {
          will-change: transform;
        }
      `}</style>

      {/* Particles - reduced to 6 */}
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
        className="absolute top-0 left-0 right-0 flex justify-between items-center px-6 md:px-10 py-5"
        style={{ zIndex: 20 }}
      >
        {/* Logo - wrapped in a container for animation */}
        <div ref={logoContainerRef}>
          <Logo
            ref={logoRef}
            className={"w-32 sm:w-40 md:w-48 lg:w-56 xl:w-44 h-auto"}
          />
        </div>

        {/* Close Button */}
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

      {/* Floor Plan */}
      <div
        className="floor-plan-container absolute top-[42%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl px-4 sm:px-8 md:px-16"
        style={{ zIndex: 10 }}
      >
        <div
          className="relative w-full rounded-2xl overflow-hidden"
          style={{
            background: "rgba(230, 216, 204, 0.2)",
            border: "1px solid rgba(245, 240, 235, 0.12)",
            boxShadow: "0 25px 70px rgba(0, 0, 0, 0.15)",
          }}
        >
          <div className="relative px-4 sm:px-6 md:px-10 py-3 sm:py-4 md:py-5">
            {/* Title */}
            <div className="text-center mb-3">
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

            {/* Floor Plan Image */}
            <div className="relative w-full rounded-xl overflow-hidden">
              <img
                src={floorplanImage}
                alt={`${bhkType.toUpperCase()} Floor Plan`}
                className="w-full h-auto object-cover"
                style={{
                  maxHeight: "55vh",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Carousel */}
      <div
        className="absolute bottom-0 left-0 right-0 px-4 md:px-10 pb-6"
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
            <span
              className="text-[8px] uppercase tracking-[0.2em]"
              style={{
                fontFamily: "'Marcellus', serif",
                color: colors.textSecondary,
              }}
            >
              {isMuted ? "Unmute" : "Sound"}
            </span>
          </div>

          {/* Room Carousel */}
          <div
            className="carousel-wrapper flex items-center gap-3 md:gap-4 px-5 py-4 rounded-2xl overflow-x-auto max-w-[75vw]"
            style={{
              background: "rgba(125, 102, 88, 0.4)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(245, 240, 235, 0.1)",
              scrollbarWidth: "none",
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
                className="carousel-item shrink-0 cursor-pointer rounded-xl overflow-hidden relative"
                style={{
                  width: "110px",
                  height: "75px",
                  boxShadow:
                    activeRoom === room.id
                      ? `0 6px 20px rgba(0,0,0,0.3), 0 0 0 2px ${colors.textAccent}`
                      : "0 4px 15px rgba(0,0,0,0.15)",
                }}
              >
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${room.image})` }}
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      activeRoom === room.id
                        ? "linear-gradient(to top, rgba(245, 240, 235, 0.9) 0%, transparent 100%)"
                        : "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)",
                  }}
                />
                <div className="absolute inset-0 flex flex-col items-center justify-end p-2">
                  {room.is360 && (
                    <div
                      className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: "rgba(245, 240, 235, 0.9)" }}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        className="w-3 h-3"
                        stroke={colors.terracotta}
                        strokeWidth="2"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <path d="M2 12h20" />
                      </svg>
                    </div>
                  )}
                  <span
                    className="text-[10px] md:text-[11px] font-medium text-center"
                    style={{
                      fontFamily: "'Marcellus', serif",
                      color:
                        activeRoom === room.id
                          ? colors.terracottaDark
                          : colors.textPrimary,
                      textShadow:
                        activeRoom === room.id
                          ? "none"
                          : "0 1px 3px rgba(0,0,0,0.4)",
                    }}
                  >
                    {room.id}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="w-10" />
        </div>
      </div>
    </div>
  );
};

export default FloorPlanPage;