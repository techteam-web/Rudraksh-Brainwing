import React, { useRef, useEffect, useCallback, useState, forwardRef, useImperativeHandle } from "react";
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
    const scrollRef = useRef(null);
    const navItemsRef = useRef([]);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    // Mouse drag state refs
    const isDraggingRef = useRef(false);
    const isDownRef = useRef(false);
    const startXRef = useRef(0);
    const scrollLeftRef = useRef(0);

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

    // Check scroll boundaries
    const updateArrows = useCallback(() => {
      const el = scrollRef.current;
      if (!el) return;
      setCanScrollLeft(el.scrollLeft > 2);
      setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 2);
    }, []);

    useEffect(() => {
      const el = scrollRef.current;
      if (!el) return;
      const raf = requestAnimationFrame(updateArrows);
      el.addEventListener("scroll", updateArrows, { passive: true });
      const ro = new ResizeObserver(updateArrows);
      ro.observe(el);
      return () => {
        cancelAnimationFrame(raf);
        el.removeEventListener("scroll", updateArrows);
        ro.disconnect();
      };
    }, [rooms, updateArrows]);

    // --- Arrow Click Navigation ---
    const handleArrowClick = useCallback((direction) => {
      const el = scrollRef.current;
      if (!el) return;
      const scrollAmount = 240;
      gsap.to(el, {
        scrollLeft: el.scrollLeft + (direction === "left" ? -scrollAmount : scrollAmount),
        duration: 0.4,
        ease: "power2.out",
      });
    }, []);

    // --- Mouse Drag Navigation ---
    const handleMouseDown = useCallback((e) => {
      const el = scrollRef.current;
      if (!el) return;
      
      isDownRef.current = true;
      isDraggingRef.current = false; // Reset drag status on fresh click
      
      // Calculate starting positions
      startXRef.current = e.pageX - el.offsetLeft;
      scrollLeftRef.current = el.scrollLeft;
      
      // Add visual cues for dragging
      el.classList.add("dragging");
    }, []);

    const handleMouseLeave = useCallback(() => {
      isDownRef.current = false;
      const el = scrollRef.current;
      if (el) el.classList.remove("dragging");
    }, []);

    const handleMouseUp = useCallback(() => {
      isDownRef.current = false;
      const el = scrollRef.current;
      if (el) el.classList.remove("dragging");
    }, []);

    const handleMouseMove = useCallback((e) => {
      if (!isDownRef.current) return;
      e.preventDefault(); // Prevent text/image selection while dragging
      
      const el = scrollRef.current;
      if (!el) return;

      const x = e.pageX - el.offsetLeft;
      const walk = (x - startXRef.current) * 1.5; // Multiply by 1.5 for slightly faster panning

      // If user moved the mouse significantly, mark as dragging (so we don't accidentally click a room)
      if (Math.abs(walk) > 5) {
        isDraggingRef.current = true;
      }

      el.scrollLeft = scrollLeftRef.current - walk;
    }, []);

    // --- Item Interactions ---
    const handleItemClick = useCallback((e, roomId) => {
      // If we were dragging, prevent the click from registering as a room change
      if (isDraggingRef.current) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      onRoomChange(roomId);
    }, [onRoomChange]);

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
          .carousel-scroll-inner {
            perspective: 1000px;
            scrollbar-width: none;
            -ms-overflow-style: none;
            cursor: grab; /* Add grab cursor */
            user-select: none; /* Prevent selection while dragging */
          }
          
          .carousel-scroll-inner.dragging {
            cursor: grabbing; /* Change cursor while actively dragging */
          }
          
          .carousel-scroll-inner::-webkit-scrollbar {
            display: none;
          }

          .carousel-item {
            transform-style: preserve-3d;
            opacity: 0;
            transform: translateY(15px) scale(0.95);
            /* Prevent image dragging overriding our custom drag */
            -webkit-user-drag: none; 
          }

          .carousel-item:hover {
            transform: translateY(-4px) rotateX(3deg) !important;
          }

          .carousel-arrow-btn {
            transition: opacity 0.25s ease, transform 0.15s ease, background 0.15s ease;
          }
          .carousel-arrow-btn:hover {
            background: rgba(255, 255, 255, 0.95) !important;
            transform: translateY(-50%) scale(1.12) !important;
          }
        `}</style>

        <div
          ref={containerRef}
          className={`carousel-container hidden sm:flex items-center rounded-2xl overflow-hidden relative max-w-[70vw] md:max-w-none ${className}`}
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
          {/* Left Arrow */}
          <button
            onClick={() => handleArrowClick("left")}
            aria-label="Scroll left"
            className="carousel-arrow-btn absolute left-1 top-1/2 z-10 w-7 h-7 rounded-full border-none flex items-center justify-center cursor-pointer"
            style={{
              transform: "translateY(-50%)",
              background: "rgba(245, 240, 235, 0.85)",
              backdropFilter: "blur(6px)",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.25)",
              opacity: canScrollLeft ? 1 : 0,
              pointerEvents: canScrollLeft ? "auto" : "none",
            }}
          >
            <svg
              width="12" height="12" viewBox="0 0 24 24" fill="none"
              stroke={colors.terracottaDark || "#6b4c3b"}
              strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          {/* Scrollable area */}
          <div
            ref={scrollRef}
            className="carousel-scroll-inner flex items-center gap-3 md:gap-4 px-5 py-4 overflow-x-auto"
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
          >
            {rooms.map((room, index) => (
              <div
                key={room.id}
                ref={addToNavItems}
                onClick={(e) => handleItemClick(e, room.id)}
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
                <div className="absolute inset-0 flex flex-col items-center justify-end p-2 pointer-events-none">
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

          {/* Right Arrow */}
          <button
            onClick={() => handleArrowClick("right")}
            aria-label="Scroll right"
            className="carousel-arrow-btn absolute right-1 top-1/2 z-10 w-7 h-7 rounded-full border-none flex items-center justify-center cursor-pointer"
            style={{
              transform: "translateY(-50%)",
              background: "rgba(245, 240, 235, 0.85)",
              backdropFilter: "blur(6px)",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.25)",
              opacity: canScrollRight ? 1 : 0,
              pointerEvents: canScrollRight ? "auto" : "none",
            }}
          >
            <svg
              width="12" height="12" viewBox="0 0 24 24" fill="none"
              stroke={colors.terracottaDark || "#6b4c3b"}
              strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            >
              <polyline points="9 6 15 12 9 18" />
            </svg>
          </button>
        </div>
      </>
    );
  }
);

RoomCarousel.displayName = "RoomCarousel";

export default RoomCarousel;