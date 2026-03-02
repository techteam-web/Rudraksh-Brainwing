import React, { useRef, useEffect, useCallback, forwardRef, useImperativeHandle } from "react";
import { gsap } from "/gsap.config.js";

const RoomCarousel = forwardRef(
  (
    {
      rooms = [],
      activeRoom,
      onRoomChange,
      colors = {},
      style = {},
      className = "",
    },
    ref
  ) => {
    const containerRef = useRef(null);
    const navItemsRef = useRef([]);

    // Reset refs array when rooms change
    useEffect(() => {
      navItemsRef.current = [];
    }, [rooms]);

    // Expose container ref and item refs to parent for entrance animations
    useImperativeHandle(ref, () => ({
      getContainerEl: () => containerRef.current,
      getItemEls: () => navItemsRef.current,
    }));

    const addToNavItems = useCallback((el) => {
      if (el && !navItemsRef.current.includes(el)) {
        navItemsRef.current.push(el);
      }
    }, []);

    const handleCarouselItemEnter = useCallback((index) => {
      const item = navItemsRef.current[index];
      if (item) {
        gsap.to(item, {
          scale: 1.05,
          y: -4,
          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.25)",
          duration: 0.15,
          ease: "power2.out",
        });
      }
    }, []);

    const handleCarouselItemLeave = useCallback((index) => {
      const item = navItemsRef.current[index];
      if (item) {
        gsap.to(item, {
          scale: 1,
          y: 0,
          boxShadow: "0 4px 15px rgba(0, 0, 0, 0.15)",
          duration: 0.15,
          ease: "power2.out",
        });
      }
    }, []);

    return (
      <>
        {/* Carousel-specific styles */}
        <style>{`
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

        <div
          ref={containerRef}
          className={`carousel-container hidden sm:flex items-center gap-3 md:gap-4 px-5 py-4 rounded-2xl overflow-x-auto max-w-[70vw] md:max-w-none ${className}`}
          style={{
            background: "rgba(125, 102, 88, 0.4)",
            backdropFilter: "blur(12px)",
            boxShadow: `
              0 0 0 1px rgba(245, 240, 235, 0.1),
              0 4px 15px rgba(0, 0, 0, 0.1),
              0 10px 30px rgba(0, 0, 0, 0.15)
            `,
            ...style,
          }}
        >
          {rooms.map((room, index) => (
            <div
              key={room.id}
              ref={addToNavItems}
              onClick={() => onRoomChange(room.id)}
              onMouseEnter={() => handleCarouselItemEnter(index)}
              onMouseLeave={() => handleCarouselItemLeave(index)}
              className="carousel-item flex-shrink-0 cursor-pointer rounded-xl overflow-hidden relative"
              style={{
                width: "110px",
                height: "75px",
                boxShadow:
                  activeRoom === room.id
                    ? `0 6px 20px rgba(0, 0, 0, 0.3), 0 0 0 2px ${colors.textAccent}`
                    : "0 4px 15px rgba(0, 0, 0, 0.15)",
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

              {/* Overlay */}
              <div
                className="absolute inset-0 transition-all duration-300"
                style={{
                  background:
                    activeRoom === room.id
                      ? "linear-gradient(to top, rgba(245, 240, 235, 0.9) 0%, transparent 100%)"
                      : "linear-gradient(to top, rgba(0, 0, 0, 0.7) 0%, transparent 100%)",
                }}
              />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-end p-2">
                {/* 360 indicator */}
                {room.is360 && (
                  <div
                    className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center"
                    style={{
                      backgroundColor: "rgba(245, 240, 235, 0.9)",
                      boxShadow: "0 2px 6px rgba(0, 0, 0, 0.2)",
                    }}
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
                  className="text-[10px] md:text-[11px] font-medium text-center leading-tight"
                  style={{
                    fontFamily: "'Marcellus', serif",
                    textShadow:
                      activeRoom === room.id
                        ? "none"
                        : "0 1px 3px rgba(0,0,0,0.4)",
                    color:
                      activeRoom === room.id
                        ? colors.terracottaDark
                        : colors.textPrimary,
                  }}
                >
                  {room.id}
                </span>
              </div>
            </div>
          ))}
        </div>
      </>
    );
  }
);

RoomCarousel.displayName = "RoomCarousel";

export default RoomCarousel;