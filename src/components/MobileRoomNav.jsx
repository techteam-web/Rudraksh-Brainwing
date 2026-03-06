import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";
import { gsap } from "/gsap.config.js";

/**
 * MobileRoomNav — Collapsible category selector for mobile screens.
 *
 * Collapsed: Shows current category/subcategory name as a pill.
 * Expanded: Shows all categories with nested subcategory support.
 * Only visible below `sm` breakpoint (controlled by parent via className).
 *
 * Props:
 *   categories        — from panoConfig
 *   activeCategory    — currently selected category id
 *   activeSubcategory — currently selected subcategory id
 *   onSelect          — (categoryId, subcategoryId?) => void
 *   colors            — theme colors
 */
const MobileRoomNav = forwardRef(
  (
    {
      categories = [],
      activeCategory,
      activeSubcategory,
      onSelect,
      colors = {},
    },
    ref
  ) => {
    const containerRef = useRef(null);
    const panelRef = useRef(null);
    const [isExpanded, setIsExpanded] = useState(false);
    const [expandedDropdown, setExpandedDropdown] = useState(null);

    useImperativeHandle(ref, () => ({
      getContainerEl: () => containerRef.current,
    }));

    // Close on outside tap
    useEffect(() => {
      if (!isExpanded) return;
      const handleOutside = (e) => {
        if (containerRef.current && !containerRef.current.contains(e.target)) {
          closePanel();
        }
      };
      document.addEventListener("mousedown", handleOutside);
      document.addEventListener("touchstart", handleOutside);
      return () => {
        document.removeEventListener("mousedown", handleOutside);
        document.removeEventListener("touchstart", handleOutside);
      };
    }, [isExpanded]);

    // Animate panel in
    useEffect(() => {
      if (!isExpanded || !panelRef.current) return;
      const items = panelRef.current.querySelectorAll(".mobile-nav-item");
      gsap.fromTo(
        panelRef.current,
        { opacity: 0, y: 10, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.25, ease: "power2.out" }
      );
      gsap.fromTo(
        items,
        { opacity: 0, x: -8 },
        {
          opacity: 1,
          x: 0,
          duration: 0.2,
          stagger: 0.04,
          delay: 0.1,
          ease: "power2.out",
        }
      );
    }, [isExpanded]);

    const closePanel = useCallback(() => {
      if (!panelRef.current) {
        setIsExpanded(false);
        setExpandedDropdown(null);
        return;
      }
      gsap.to(panelRef.current, {
        opacity: 0,
        y: 10,
        scale: 0.95,
        duration: 0.15,
        ease: "power2.in",
        onComplete: () => {
          setIsExpanded(false);
          setExpandedDropdown(null);
        },
      });
    }, []);

    const handleToggle = () => {
      if (isExpanded) {
        closePanel();
      } else {
        setIsExpanded(true);
      }
    };

    const handleCategoryClick = useCallback(
      (category) => {
        if (category.type === "dropdown") {
          // Toggle subcategory expansion
          setExpandedDropdown((prev) =>
            prev === category.id ? null : category.id
          );
        } else {
          onSelect(category.id, null);
          closePanel();
        }
      },
      [onSelect, closePanel]
    );

    const handleSubcategoryClick = useCallback(
      (categoryId, subcategoryId) => {
        onSelect(categoryId, subcategoryId);
        closePanel();
      },
      [onSelect, closePanel]
    );

    // Visible categories (same filter as desktop nav)
    const visibleCategories = categories.filter((cat) => {
      if (cat.type === "single") return cat.scenes && cat.scenes.length > 0;
      if (cat.type === "dropdown") {
        return cat.subcategories?.some(
          (sub) => sub.scenes && sub.scenes.length > 0
        );
      }
      return false;
    });

    const getVisibleSubcategories = (category) => {
      if (category.type !== "dropdown") return [];
      return (category.subcategories || []).filter(
        (sub) => sub.scenes && sub.scenes.length > 0
      );
    };

    // Get display label for collapsed state
    const getActiveLabel = () => {
      const cat = categories.find((c) => c.id === activeCategory);
      if (!cat) return "Select Room";

      if (cat.type === "dropdown" && activeSubcategory) {
        const sub = cat.subcategories?.find((s) => s.id === activeSubcategory);
        return sub?.label || cat.label;
      }
      return cat.label;
    };

    return (
      <div ref={containerRef} className="relative">
        {/* ── Collapsed Pill ── */}
        <button
          onClick={handleToggle}
          className="flex items-center gap-2 px-4 py-3 rounded-xl transition-all duration-200 active:scale-95"
          style={{
            background: "rgba(125, 102, 88, 0.5)",
            backdropFilter: "blur(12px)",
            boxShadow: `
              0 0 0 1px rgba(245, 240, 235, 0.12),
              0 4px 15px rgba(0, 0, 0, 0.12),
              0 8px 20px rgba(0, 0, 0, 0.1)
            `,
          }}
        >
          {/* Room icon */}
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="w-4 h-4 flex-shrink-0"
            stroke={colors.textAccent || "#E8C4A0"}
            strokeWidth="1.5"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            <path d="M2 12h20" />
          </svg>

          <span
            className="text-xs font-medium whitespace-nowrap"
            style={{
              fontFamily: "'Marcellus', serif",
              color: colors.textPrimary || "#f5f0eb",
              letterSpacing: "0.05em",
            }}
          >
            {getActiveLabel()}
          </span>

          {/* Chevron */}
          <svg
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="none"
            stroke={colors.textPrimary || "#f5f0eb"}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.25s ease",
              opacity: 0.6,
            }}
          >
            <polyline points="6 15 12 9 18 15" />
          </svg>
        </button>

        {/* ── Expanded Panel (dropup) ── */}
        {isExpanded && (
          <div
            ref={panelRef}
            className="absolute right-0 bottom-full mb-2 min-w-[180px] rounded-xl overflow-hidden"
            style={{
              background: "rgba(90, 72, 62, 0.95)",
              backdropFilter: "blur(20px)",
              boxShadow: `
                0 0 0 1px rgba(245, 240, 235, 0.1),
                0 -4px 20px rgba(0, 0, 0, 0.3),
                0 -8px 40px rgba(0, 0, 0, 0.2)
              `,
              zIndex: 60,
            }}
          >
            <div className="py-2 px-2 flex flex-col gap-0.5">
              {visibleCategories.map((category) => {
                const isActive = activeCategory === category.id;
                const isDropdown = category.type === "dropdown";
                const isDropdownOpen = expandedDropdown === category.id;

                return (
                  <div key={category.id}>
                    {/* Category button */}
                    <button
                      onClick={() => handleCategoryClick(category)}
                      className="mobile-nav-item flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg text-left border-none outline-none"
                      style={{
                        fontFamily: "'Marcellus', serif",
                        fontSize: "13px",
                        letterSpacing: "0.04em",
                        color: isActive
                          ? colors.textAccent || "#E8C4A0"
                          : colors.textPrimary || "#f5f0eb",
                        backgroundColor: isActive
                          ? "rgba(245, 240, 235, 0.1)"
                          : "transparent",
                        transition: "background-color 0.15s ease",
                      }}
                    >
                      {/* Active dot */}
                      <span
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{
                          backgroundColor: isActive
                            ? colors.textAccent || "#E8C4A0"
                            : "transparent",
                        }}
                      />
                      <span className="flex-1">{category.label}</span>

                      {isDropdown && (
                        <svg
                          width="10"
                          height="10"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          style={{
                            transform: isDropdownOpen
                              ? "rotate(180deg)"
                              : "rotate(0deg)",
                            transition: "transform 0.2s ease",
                            opacity: 0.5,
                          }}
                        >
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      )}
                    </button>

                    {/* Subcategories (nested) */}
                    {isDropdown && isDropdownOpen && (
                      <div className="ml-4 mt-0.5 mb-1 flex flex-col gap-0.5 border-l border-white/10 pl-2">
                        {getVisibleSubcategories(category).map((sub) => {
                          const isSubActive =
                            activeSubcategory === sub.id;
                          return (
                            <button
                              key={sub.id}
                              onClick={() =>
                                handleSubcategoryClick(category.id, sub.id)
                              }
                              className="flex items-center gap-2 w-full px-2.5 py-2 rounded-lg text-left border-none outline-none"
                              style={{
                                fontFamily: "'Marcellus', serif",
                                fontSize: "12px",
                                letterSpacing: "0.03em",
                                color: isSubActive
                                  ? colors.textAccent || "#E8C4A0"
                                  : (colors.textSecondary || "#e8e0d8"),
                                backgroundColor: isSubActive
                                  ? "rgba(245, 240, 235, 0.08)"
                                  : "transparent",
                                transition: "background-color 0.15s ease",
                              }}
                            >
                              <span
                                className="w-1 h-1 rounded-full flex-shrink-0"
                                style={{
                                  backgroundColor: isSubActive
                                    ? colors.textAccent || "#E8C4A0"
                                    : "rgba(245, 240, 235, 0.3)",
                                }}
                              />
                              <span>{sub.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }
);

MobileRoomNav.displayName = "MobileRoomNav";

export default MobileRoomNav;