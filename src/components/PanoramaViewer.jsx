import React, { useEffect, useRef } from "react";
import { findSceneById } from "../data/panoConfig";

/**
 * PanoramaViewer — Config-driven Marzipano viewer.
 *
 * Props:
 *   sceneConfig    — full scene object from panoConfig
 *   bhkType        — "3bhk" | "4bhk" (used to resolve hotspot labels)
 *   onHotspotClick — (targetSceneId) => void
 *   onViewChange   — ({ yaw, pitch, fov }) => void  — fires on every frame while panning
 */
const PanoramaViewer = ({ sceneConfig, bhkType, onHotspotClick, onViewChange }) => {
  const containerRef = useRef(null);
  const viewerRef = useRef(null);

  // Keep a stable ref so the Marzipano listener always sees the latest callback
  const onViewChangeRef = useRef(onViewChange);
  useEffect(() => {
    onViewChangeRef.current = onViewChange;
  }, [onViewChange]);

  useEffect(() => {
    if (!sceneConfig) return;

    let cleanupTimers = [];
    let isMounted = true;
    let rafId = null;

    const loadMarzipano = () => {
      return new Promise((resolve, reject) => {
        if (window.Marzipano) {
          resolve(window.Marzipano);
          return;
        }
        const script = document.createElement("script");
        script.src = "/marzipano/marzipano.js";
        script.onload = () => resolve(window.Marzipano);
        script.onerror = (err) => reject(err);
        document.head.appendChild(script);
      });
    };

    const createHotspotElement = (hotspot, onClick) => {
      const SIZE = 54;
      const HALF = SIZE / 2;

      // Resolve the target scene label
      let targetLabel = "";
      if (bhkType && hotspot.target) {
        const result = findSceneById(bhkType, hotspot.target);
        if (result) targetLabel = result.scene.label;
      }

      const wrapper = document.createElement("div");
      wrapper.className = "pano-hotspot";
      wrapper.style.cssText = `
        width: ${SIZE}px;
        height: ${SIZE}px;
        margin-left: -${HALF}px;
        margin-top: -${HALF}px;
        cursor: pointer;
        position: relative;
      `;

      // ── Tooltip ──
      const tooltip = document.createElement("div");
      tooltip.textContent = targetLabel;
      tooltip.style.cssText = `
        position: absolute;
        bottom: calc(100% + 12px);
        left: 50%;
        transform: translateX(-50%) translateY(6px);
        white-space: nowrap;
        font-family: 'Marcellus', serif;
        font-size: 12px;
        letter-spacing: 0.04em;
        color: #f5f0eb;
        background: rgba(40, 32, 28, 0.85);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        padding: 6px 14px;
        border-radius: 8px;
        border: 1px solid rgba(245, 240, 235, 0.15);
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.35);
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.25s ease, transform 0.25s ease;
        z-index: 100;
      `;

      // Small arrow at bottom of tooltip
      const arrow = document.createElement("div");
      arrow.style.cssText = `
        position: absolute;
        bottom: -5px;
        left: 50%;
        transform: translateX(-50%) rotate(45deg);
        width: 8px;
        height: 8px;
        background: rgba(40, 32, 28, 0.85);
        border-right: 1px solid rgba(245, 240, 235, 0.15);
        border-bottom: 1px solid rgba(245, 240, 235, 0.15);
      `;
      tooltip.appendChild(arrow);

      if (targetLabel) {
        wrapper.appendChild(tooltip);
      }

      // ── Outer static ring ──
      const outerRing = document.createElement("div");
      outerRing.style.cssText = `
        position: absolute;
        inset: -3px;
        border-radius: 50%;
        border: 2.5px solid rgba(255, 255, 255, 0.5);
        box-shadow: 0 0 18px rgba(255, 255, 255, 0.15);
        transition: border-color 0.3s ease, box-shadow 0.3s ease;
      `;
      wrapper.appendChild(outerRing);

      // ── Pulse ring (grows outward + fades) ──
      const pulse = document.createElement("div");
      pulse.style.cssText = `
        position: absolute;
        inset: -6px;
        border-radius: 50%;
        border: 2px solid rgba(255, 255, 255, 0.35);
        animation: hotspot-pulse 2.2s ease-out infinite;
        pointer-events: none;
      `;
      wrapper.appendChild(pulse);

      // ── White filled center ──
      const inner = document.createElement("div");
      inner.style.cssText = `
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.88);
        box-shadow:
          0 2px 12px rgba(0, 0, 0, 0.25),
          inset 0 1px 2px rgba(255, 255, 255, 0.6);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.25s ease, box-shadow 0.25s ease;
      `;

      // ── 360° Arrow + Lens SVG ──
      const iconSize = Math.round(SIZE * 0.40);
      inner.innerHTML = `
        <svg
          width="${iconSize}" height="${iconSize}"
          viewBox="0 0 24 24"
          fill="none"
          stroke="rgba(80, 65, 55, 0.85)"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M21 12a9 9 0 1 1-3.6-7.2"/>
          <polyline points="21 3 21 9 15 9"/>
          <circle cx="12" cy="12" r="3" stroke-width="1.8"/>
          <circle cx="12" cy="12" r="1" fill="rgba(80, 65, 55, 0.85)" stroke="none"/>
        </svg>
      `;
      wrapper.appendChild(inner);

      // ── Inject keyframes once ──
      if (!document.getElementById("hotspot-styles")) {
        const style = document.createElement("style");
        style.id = "hotspot-styles";
        style.textContent = `
          @keyframes hotspot-pulse {
            0%   { transform: scale(1);   opacity: 1; }
            100% { transform: scale(1.6); opacity: 0; }
          }
        `;
        document.head.appendChild(style);
      }

      // ── Hover: scale up + brighter ring + show tooltip ──
      wrapper.addEventListener("mouseenter", () => {
        inner.style.transform = "scale(1.08)";
        inner.style.boxShadow = `
          0 4px 20px rgba(0, 0, 0, 0.3),
          inset 0 1px 2px rgba(255, 255, 255, 0.6)
        `;
        outerRing.style.borderColor = "rgba(255, 255, 255, 0.75)";
        outerRing.style.boxShadow = "0 0 28px rgba(255, 255, 255, 0.3)";

        if (targetLabel) {
          tooltip.style.opacity = "1";
          tooltip.style.transform = "translateX(-50%) translateY(0)";
        }
      });

      wrapper.addEventListener("mouseleave", () => {
        inner.style.transform = "scale(1)";
        inner.style.boxShadow = `
          0 2px 12px rgba(0, 0, 0, 0.25),
          inset 0 1px 2px rgba(255, 255, 255, 0.6)
        `;
        outerRing.style.borderColor = "rgba(255, 255, 255, 0.5)";
        outerRing.style.boxShadow = "0 0 18px rgba(255, 255, 255, 0.15)";

        if (targetLabel) {
          tooltip.style.opacity = "0";
          tooltip.style.transform = "translateX(-50%) translateY(6px)";
        }
      });

      wrapper.addEventListener("click", (e) => {
        e.stopPropagation();
        if (onClick) onClick(hotspot.target);
      });

      return wrapper;
    };

    const initViewer = async () => {
      try {
        const Marzipano = await loadMarzipano();
        if (!containerRef.current || !isMounted) return;

        if (viewerRef.current) {
          viewerRef.current.destroy();
          viewerRef.current = null;
        }

        containerRef.current.innerHTML = "";

        const viewer = new Marzipano.Viewer(containerRef.current, {
          controls: { mouseViewMode: "drag" },
          stage: { progressive: true },
        });
        viewerRef.current = viewer;

        const geometry = new Marzipano.CubeGeometry(sceneConfig.levels);

        const limiter = Marzipano.RectilinearView.limit.traditional(
          sceneConfig.faceSize,
          (100 * Math.PI) / 180,
          (120 * Math.PI) / 180
        );

        const view = new Marzipano.RectilinearView(
          sceneConfig.initialView,
          limiter
        );

        const source = Marzipano.ImageUrlSource.fromString(
          sceneConfig.tilesPath + "/{z}/{f}/{y}/{x}.jpg",
          { cubeMapPreviewUrl: sceneConfig.preview }
        );

        const scene = viewer.createScene({
          source: source,
          geometry: geometry,
          view: view,
          pinFirstLevel: true,
        });

        if (sceneConfig.linkHotspots?.length > 0) {
          sceneConfig.linkHotspots.forEach((hotspot) => {
            const element = createHotspotElement(hotspot, onHotspotClick);
            scene.hotspotContainer().createHotspot(element, {
              yaw: hotspot.yaw,
              pitch: hotspot.pitch,
            });
          });
        }

        scene.switchTo();

        // ── Live view change → radar rotation ──────────────
        // RAF loop guarantees the radar tracks autorotate, user drag,
        // and inertia — React state batching can't drop frames.
        const pollView = () => {
          if (!isMounted) return;
          if (onViewChangeRef.current) {
            onViewChangeRef.current({
              yaw: view.yaw(),
              pitch: view.pitch(),
              fov: view.fov(),
            });
          }
          rafId = requestAnimationFrame(pollView);
        };
        rafId = requestAnimationFrame(pollView);

        // ── Autorotate ─────────────────────────────────────
        const autorotate = Marzipano.autorotate({
          yawSpeed: 0.015,
          targetPitch: 0,
          targetFov: Math.PI / 2,
        });

        const autorotateTimer = setTimeout(() => {
          if (isMounted && viewerRef.current) {
            viewer.startMovement(autorotate);
          }
        }, 2000);
        cleanupTimers.push(autorotateTimer);

        viewer.controls().addEventListener("active", () => {
          viewer.stopMovement();
        });

        let inactivityTimeout;
        viewer.controls().addEventListener("inactive", () => {
          clearTimeout(inactivityTimeout);
          inactivityTimeout = setTimeout(() => {
            if (isMounted && viewerRef.current) {
              viewer.startMovement(autorotate);
            }
          }, 5000);
          cleanupTimers.push(inactivityTimeout);
        });
      } catch (error) {
        console.error("PanoramaViewer: Failed to initialize:", error);
      }
    };

    initViewer();

    return () => {
      isMounted = false;
      if (rafId) cancelAnimationFrame(rafId);
      cleanupTimers.forEach((timer) => clearTimeout(timer));
      if (viewerRef.current) {
        viewerRef.current.destroy();
        viewerRef.current = null;
      }
    };
  }, [sceneConfig, bhkType, onHotspotClick]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full absolute inset-0"
      style={{
        background: "#1a1814",
        touchAction: "none",
      }}
    />
  );
};

export default PanoramaViewer;