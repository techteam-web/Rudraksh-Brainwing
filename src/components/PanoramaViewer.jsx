import React, { useEffect, useRef } from "react";

/**
 * PanoramaViewer — Config-driven Marzipano viewer.
 *
 * Props:
 *   sceneConfig    — full scene object from panoConfig (tilesPath, levels, faceSize, initialView, linkHotspots)
 *   onHotspotClick — (targetSceneId) => void
 *
 * The component creates a new Marzipano viewer each time sceneConfig changes.
 * Tiles load progressively (pinFirstLevel ensures instant low-res feedback).
 */
const PanoramaViewer = ({ sceneConfig, onHotspotClick }) => {
  const containerRef = useRef(null);
  const viewerRef = useRef(null);

  useEffect(() => {
    if (!sceneConfig) return;

    console.log("PanoramaViewer: Mounting scene:", sceneConfig.id);
    let cleanupTimers = [];

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
      const wrapper = document.createElement("div");
      wrapper.className = "pano-hotspot";
      wrapper.style.cssText = `
        width: 50px;
        height: 50px;
        cursor: pointer;
        position: relative;
      `;

      const inner = document.createElement("div");
      inner.style.cssText = `
        width: 100%;
        height: 100%;
        background: rgba(193, 127, 89, 0.85);
        border: 3px solid rgba(255, 255, 255, 0.95);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
        transition: transform 0.2s ease, box-shadow 0.2s ease;
      `;

      const rotationDeg = ((hotspot.rotation || 0) * 180) / Math.PI;
      inner.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" width="22" height="22"
             stroke="white" stroke-width="2.5" stroke-linecap="round"
             stroke-linejoin="round"
             style="transform: rotate(${rotationDeg}deg);">
          <path d="M12 19V5M5 12l7-7 7 7"/>
        </svg>
      `;

      wrapper.appendChild(inner);

      // Pulse animation
      const pulse = document.createElement("div");
      pulse.style.cssText = `
        position: absolute;
        inset: -4px;
        border-radius: 50%;
        border: 2px solid rgba(193, 127, 89, 0.6);
        animation: hotspot-pulse 2s ease-out infinite;
      `;
      wrapper.appendChild(pulse);

      // Add keyframes (once)
      if (!document.getElementById("hotspot-styles")) {
        const style = document.createElement("style");
        style.id = "hotspot-styles";
        style.textContent = `
          @keyframes hotspot-pulse {
            0% { transform: scale(1); opacity: 1; }
            100% { transform: scale(1.5); opacity: 0; }
          }
        `;
        document.head.appendChild(style);
      }

      wrapper.addEventListener("mouseenter", () => {
        inner.style.transform = "scale(1.15)";
        inner.style.boxShadow = "0 6px 25px rgba(193, 127, 89, 0.6)";
      });

      wrapper.addEventListener("mouseleave", () => {
        inner.style.transform = "scale(1)";
        inner.style.boxShadow = "0 4px 15px rgba(0, 0, 0, 0.4)";
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

        if (!containerRef.current) return;

        // Destroy existing viewer
        if (viewerRef.current) {
          viewerRef.current.destroy();
          viewerRef.current = null;
        }

        // Clear container
        containerRef.current.innerHTML = "";

        console.log("PanoramaViewer: Loading scene", sceneConfig.id);
        console.log("PanoramaViewer: Tiles path:", sceneConfig.tilesPath);
        console.log("PanoramaViewer: Preview:", sceneConfig.preview);
        console.log("PanoramaViewer: Levels:", sceneConfig.levels.length);
        console.log("PanoramaViewer: FaceSize:", sceneConfig.faceSize);

        // Create viewer — matches Marzipano tool's index.js exactly
        const viewer = new Marzipano.Viewer(containerRef.current, {
          controls: { mouseViewMode: "drag" },
          stage: { progressive: true },
        });
        viewerRef.current = viewer;

        // Create geometry
        var geometry = new Marzipano.CubeGeometry(sceneConfig.levels);

        // View limits — matches Marzipano tool exactly
        var limiter = Marzipano.RectilinearView.limit.traditional(
          sceneConfig.faceSize,
          100 * Math.PI / 180,
          120 * Math.PI / 180
        );

        var view = new Marzipano.RectilinearView(
          sceneConfig.initialView,
          limiter
        );

        // Image source — EXACT same pattern as Marzipano tool's index.js
        // URL: tilesPath/{z}/{f}/{y}/{x}.jpg
        // Preview: tilesPath/preview.jpg (used for fallbackOnly level)
        var source = Marzipano.ImageUrlSource.fromString(
          sceneConfig.tilesPath + "/{z}/{f}/{y}/{x}.jpg",
          { cubeMapPreviewUrl: sceneConfig.preview }
        );

        // Log a sample tile URL for debugging
        console.log(
          "PanoramaViewer: Sample tile URL:",
          sceneConfig.tilesPath + "/1/f/0/0.jpg"
        );

        // Create and switch to scene — matches Marzipano tool exactly
        var scene = viewer.createScene({
          source: source,
          geometry: geometry,
          view: view,
          pinFirstLevel: true,
        });

        // Add hotspots
        if (sceneConfig.linkHotspots?.length > 0) {
          sceneConfig.linkHotspots.forEach((hotspot) => {
            const element = createHotspotElement(hotspot, onHotspotClick);
            scene
              .hotspotContainer()
              .createHotspot(element, {
                yaw: hotspot.yaw,
                pitch: hotspot.pitch,
              });
          });
        }

        scene.switchTo();

        // Auto-rotation
        const autorotate = Marzipano.autorotate({
          yawSpeed: 0.015,
          targetPitch: 0,
          targetFov: Math.PI / 2,
        });

        const autorotateTimer = setTimeout(() => {
          viewer.startMovement(autorotate);
        }, 2000);
        cleanupTimers.push(autorotateTimer);

        viewer.controls().addEventListener("active", () => {
          viewer.stopMovement();
        });

        let inactivityTimeout;
        viewer.controls().addEventListener("inactive", () => {
          clearTimeout(inactivityTimeout);
          inactivityTimeout = setTimeout(() => {
            viewer.startMovement(autorotate);
          }, 5000);
          cleanupTimers.push(inactivityTimeout);
        });
      } catch (error) {
        console.error("PanoramaViewer: Failed to initialize:", error);
      }
    };

    initViewer();

    return () => {
      cleanupTimers.forEach((timer) => clearTimeout(timer));
      if (viewerRef.current) {
        viewerRef.current.destroy();
        viewerRef.current = null;
      }
    };
  }, [sceneConfig, onHotspotClick]);

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