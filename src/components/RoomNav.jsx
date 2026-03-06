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
 * RoomNav — Category navigation bar with dropdown support.
 *
 * Sits above the carousel. Matches the carousel's glassmorphism style.
 * "Bedrooms" opens a dropup menu (since it's at the bottom of the screen).
 *
 * Props:
 *   categories     — from panoConfig: [{ id, label, type, scenes?, subcategories? }]
 *   activeCategory — currently selected category id
 *   activeSubcategory — currently selected subcategory id (for dropdowns)
 *   onSelect       — (categoryId, subcategoryId?) => void
 *   colors         — theme colors object
 */
const RoomNav = forwardRef(
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
    const [openDropdown, setOpenDropdown] = useState(null);
    const dropdownRef = useRef(null);
    const dropdownItemsRef = useRef([]);

    // Expose container for parent entrance animations
    useImperativeHandle(ref, () => ({
      getContainerEl: () => containerRef.current,
    }));

    // Close dropdown on outside click
    useEffect(() => {
      const handleClickOutside = (e) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
          closeDropdown();
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const closeDropdown = useCallback(() => {
      if (!dropdownRef.current) {
        setOpenDropdown(null);
        return;
      }
      // Animate out
      const items = dropdownRef.current.querySelectorAll(".dropdown-item");
      gsap.to(items, {
        opacity: 0,
        y: 5,
        duration: 0.15,
        stagger: 0.03,
        ease: "power2.in",
        onComplete: () => setOpenDropdown(null),
      });
    }, []);

    const openDropdownMenu = useCallback(
      (categoryId) => {
        if (openDropdown === categoryId) {
          closeDropdown();
          return;
        }
        setOpenDropdown(categoryId);
      },
      [openDropdown, closeDropdown]
    );

    // Animate dropdown items in when openDropdown changes
    useEffect(() => {
      if (!openDropdown || !dropdownRef.current) return;
      const items = dropdownRef.current.querySelectorAll(".dropdown-item");
      gsap.fromTo(
        items,
        { opacity: 0, y: 8 },
        {
          opacity: 1,
          y: 0,
          duration: 0.2,
          stagger: 0.04,
          ease: "power2.out",
        }
      );
    }, [openDropdown]);

    const handleCategoryClick = useCallback(
      (category) => {
        if (category.type === "dropdown") {
          openDropdownMenu(category.id);
        } else {
          closeDropdown();
          onSelect(category.id, null);
        }
      },
      [onSelect, openDropdownMenu, closeDropdown]
    );

    const handleSubcategoryClick = useCallback(
      (categoryId, subcategoryId) => {
        onSelect(categoryId, subcategoryId);
        closeDropdown();
      },
      [onSelect, closeDropdown]
    );

    // Filter out categories with no scenes (future-proofing: hide empty ones)
    const visibleCategories = categories.filter((cat) => {
      if (cat.type === "single") return cat.scenes && cat.scenes.length > 0;
      if (cat.type === "dropdown") {
        return cat.subcategories?.some((sub) => sub.scenes && sub.scenes.length > 0);
      }
      return false;
    });

    // For dropdown categories, filter subcategories that have scenes
    const getVisibleSubcategories = (category) => {
      if (category.type !== "dropdown") return [];
      return (category.subcategories || []).filter(
        (sub) => sub.scenes && sub.scenes.length > 0
      );
    };

    return (
      <>
        <style>{`
          .room-nav-item {
            transition: background-color 0.2s ease, color 0.2s ease, transform 0.15s ease;
          }
          .room-nav-item:hover {
            transform: translateY(-1px);
          }
          .room-nav-item:active {
            transform: translateY(0);
          }
          .dropdown-panel {
            animation: none; /* gsap handles animation */
          }
          .dropdown-item {
            transition: background-color 0.15s ease;
          }
          .dropdown-item:hover {
            background-color: rgba(245, 240, 235, 0.15) !important;
          }
        `}</style>

        <div
          ref={containerRef}
          className="room-nav flex items-center gap-1.5 rounded-xl px-1.5 py-1.5 relative"
          style={{
            background: "rgba(125, 102, 88, 0.5)",
            backdropFilter: "blur(12px)",
            boxShadow: `
              0 0 0 1px rgba(245, 240, 235, 0.1),
              0 2px 8px rgba(0, 0, 0, 0.1)
            `,
          }}
        >
          {visibleCategories.map((category) => {
            const isActive =
              activeCategory === category.id;
            const isDropdown = category.type === "dropdown";
            const isOpen = openDropdown === category.id;

            return (
              <div key={category.id} className="relative" ref={isOpen ? dropdownRef : null}>
                {/* Nav Button */}
                <button
                  onClick={() => handleCategoryClick(category)}
                  className={`room-nav-item flex items-center gap-1.5 px-3.5 py-2 rounded-lg cursor-pointer whitespace-nowrap select-none`}
                  style={{
                    fontFamily: "'Marcellus', serif",
                    fontSize: "12px",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: isActive
                      ? colors.terracottaDark || "#a65d3f"
                      : colors.textPrimary || "#f5f0eb",
                    backgroundColor: isActive
                      ? "rgba(245, 240, 235, 0.9)"
                      : "transparent",
                    border: "none",
                    outline: "none",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor =
                        "rgba(245, 240, 235, 0.15)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }
                  }}
                >
                  <span>{category.label}</span>

                  {/* Dropdown Chevron */}
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
                        transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "transform 0.25s ease",
                        opacity: 0.7,
                      }}
                    >
                      {/* Chevron UP since this is a dropup */}
                      <polyline points="6 15 12 9 18 15" />
                    </svg>
                  )}
                </button>

                {/* Dropup Menu */}
                {isDropdown && isOpen && (
                  <div
                    className="dropdown-panel absolute left-0 bottom-full mb-2 min-w-[160px] rounded-xl overflow-hidden"
                    style={{
                      background: "rgba(100, 80, 68, 0.92)",
                      backdropFilter: "blur(16px)",
                      boxShadow: `
                        0 0 0 1px rgba(245, 240, 235, 0.12),
                        0 -4px 20px rgba(0, 0, 0, 0.25),
                        0 -8px 32px rgba(0, 0, 0, 0.15)
                      `,
                      zIndex: 50,
                    }}
                  >
                    <div className="py-1.5 px-1.5 flex flex-col gap-0.5">
                      {getVisibleSubcategories(category).map((sub) => {
                        const isSubActive = activeSubcategory === sub.id;
                        return (
                          <button
                            key={sub.id}
                            onClick={() =>
                              handleSubcategoryClick(category.id, sub.id)
                            }
                            className="dropdown-item flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer text-left w-full border-none outline-none"
                            style={{
                              fontFamily: "'Marcellus', serif",
                              fontSize: "12px",
                              letterSpacing: "0.04em",
                              color: isSubActive
                                ? colors.textAccent || "#E8C4A0"
                                : colors.textPrimary || "#f5f0eb",
                              backgroundColor: isSubActive
                                ? "rgba(245, 240, 235, 0.1)"
                                : "transparent",
                            }}
                          >
                            {/* Active indicator dot */}
                            <span
                              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                              style={{
                                backgroundColor: isSubActive
                                  ? colors.textAccent || "#E8C4A0"
                                  : "transparent",
                                transition: "background-color 0.2s ease",
                              }}
                            />
                            <span>{sub.label}</span>
                            {/* Scene count badge */}
                            <span
                              className="ml-auto text-[10px] opacity-50"
                              style={{
                                fontFamily: "'Cormorant Garamond', serif",
                              }}
                            >
                              {sub.scenes?.length || 0}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </>
    );
  }
);

RoomNav.displayName = "RoomNav";

export default RoomNav;