import React, { useEffect, useRef } from 'react';

/**
 * PanoramaViewer Component - 8K Resolution
 * 
 * NO data.js needed - all config is embedded here.
 * 
 * FOLDER STRUCTURE IN PUBLIC:
 * public/
 * └── marzipano/
 *     ├── marzipano.js
 *     └── tiles/
 *         ├── 0-living/
 *         │   ├── preview.jpg
 *         │   └── 1/ through 6/
 *         └── 1-kitchen/
 *             ├── preview.jpg
 *             └── 1/ through 6/
 */

const PanoramaViewer = ({ sceneId, onHotspotClick }) => {
  const containerRef = useRef(null);
  const viewerRef = useRef(null);

  // Scene configurations - ALL CONFIG EMBEDDED HERE
  // tilesPath matches YOUR folder names: 0-living, 1-kitchen
  // levels and faceSize from your 8K data.js export
  const scenes = {
    'living': {
      id: 'living',
      name: 'Living',
      tilesPath: '/marzipano/tiles/0-living',
      levels: [
        { tileSize: 512, size: 512, fallbackOnly: true},
        { tileSize: 512, size: 1024 },
        { tileSize: 512, size: 2048 },
        { tileSize: 512, size: 4096 },
        { tileSize: 512, size: 8192 }
      ],
      faceSize: 5750,
      initialView: {
        yaw: -0.3276872476992665,
        pitch: 0.0007041615010443536,
        fov: 1.4488196474276132
      },
      linkHotspots: [
        {
          yaw: 0.09287135793738166,
          pitch: -0.012331353592042404,
          rotation: 0,
          target: 'Kitchen'
        }
      ]
    },
    'kitchen': {
      id: 'kitchen',
      name: 'Kitchen',
      tilesPath: '/marzipano/tiles/1-kitchen',
      levels: [
        { tileSize: 512, size: 512, fallbackOnly: true},
        { tileSize: 512, size: 1024 },
        { tileSize: 512, size: 2048 },
        { tileSize: 512, size: 4096 },
        { tileSize: 512, size: 8192 }
      ],
      faceSize: 5750,
      initialView: {
        yaw: -3.0728918759931307,
        pitch: 0,
        fov: 1.4488196474276132
      },
      linkHotspots: [
        {
          yaw: -0.801326912162299,
          pitch: 0.11837850860981369,
          rotation: 0,
          target: 'Living'
        }
      ]
    },
    'kids-bedroom-1': {
      id: 'kids-bedroom-1',
      tilesPath: '/marzipano/tiles/0-kids_bedroom_final_01',
      levels: [
        { tileSize: 512, size: 512, fallbackOnly: true},
        { tileSize: 512, size: 1024 },
        { tileSize: 512, size: 2048 }
      ],
      faceSize: 1500,
      initialView: {
        yaw: -0.8417927282921394,
        pitch: 0.06109107214368947,
        fov: 1.3900591270580378
      },
      linkHotspots: [
        {
          yaw: 0.2882761953185984,
          pitch: 0.28481417024085687,
          rotation: 6.283185307179586,
          target: 'Kids Bedroom 2'
        }
      ]
    },
    'kids-bedroom-2': {
      id: 'kids-bedroom-2',
      tilesPath: '/marzipano/tiles/1-kids_bedroom_final_02',
      levels: [
        { tileSize: 512, size: 512, fallbackOnly: true},
        { tileSize: 512, size: 1024 },
        { tileSize: 512, size: 2048 }
      ],
      faceSize: 1500,
      initialView: {
        yaw: -2.4387619894212964,
        pitch: 0.06835272671570536,
        fov: 1.3900591270580378
      },
      linkHotspots: [
        {
          yaw: -2.749514776378021,
          pitch: 0.29688080012490303,
          rotation: 0,
          target: 'Kids Bedroom 1'
        }
      ]
    }
  };

  useEffect(() => {
    console.log('PanoramaViewer: Mounting with sceneId:', sceneId);
    let cleanupTimers = [];
    
    const loadMarzipano = () => {
      return new Promise((resolve, reject) => {
        if (window.Marzipano) {
          console.log('PanoramaViewer: Marzipano already loaded');
          resolve(window.Marzipano);
          return;
        }

        console.log('PanoramaViewer: Loading Marzipano script...');
        const script = document.createElement('script');
        script.src = '/marzipano/marzipano.js';
        script.onload = () => {
          console.log('PanoramaViewer: Marzipano script loaded');
          resolve(window.Marzipano);
        };
        script.onerror = (err) => {
          console.error('PanoramaViewer: Failed to load Marzipano:', err);
          reject(err);
        };
        document.head.appendChild(script);
      });
    };

    const createHotspotElement = (hotspot, onClick) => {
      const wrapper = document.createElement('div');
      wrapper.className = 'pano-hotspot';
      wrapper.style.cssText = `
        width: 50px;
        height: 50px;
        cursor: pointer;
        position: relative;
      `;

      const inner = document.createElement('div');
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

      const rotationDeg = (hotspot.rotation || 0) * 180 / Math.PI;
      inner.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" width="22" height="22" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="transform: rotate(${rotationDeg}deg);">
          <path d="M12 19V5M5 12l7-7 7 7"/>
        </svg>
      `;

      wrapper.appendChild(inner);

      // Pulse animation
      const pulse = document.createElement('div');
      pulse.style.cssText = `
        position: absolute;
        inset: -4px;
        border-radius: 50%;
        border: 2px solid rgba(193, 127, 89, 0.6);
        animation: hotspot-pulse 2s ease-out infinite;
      `;
      wrapper.appendChild(pulse);

      // Add keyframes
      if (!document.getElementById('hotspot-styles')) {
        const style = document.createElement('style');
        style.id = 'hotspot-styles';
        style.textContent = `
          @keyframes hotspot-pulse {
            0% { transform: scale(1); opacity: 1; }
            100% { transform: scale(1.5); opacity: 0; }
          }
        `;
        document.head.appendChild(style);
      }

      wrapper.addEventListener('mouseenter', () => {
        inner.style.transform = 'scale(1.15)';
        inner.style.boxShadow = '0 6px 25px rgba(193, 127, 89, 0.6)';
      });

      wrapper.addEventListener('mouseleave', () => {
        inner.style.transform = 'scale(1)';
        inner.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.4)';
      });

      wrapper.addEventListener('click', (e) => {
        e.stopPropagation();
        console.log('PanoramaViewer: Hotspot clicked, target:', hotspot.target);
        if (onClick) {
          onClick(hotspot.target);
        }
      });

      return wrapper;
    };

    const initViewer = async () => {
      try {
        const Marzipano = await loadMarzipano();
        
        if (!containerRef.current) {
          console.error('PanoramaViewer: Container ref is null');
          return;
        }

        const sceneConfig = scenes[sceneId];
        if (!sceneConfig) {
          console.error('PanoramaViewer: Scene not found:', sceneId);
          console.error('PanoramaViewer: Available scenes:', Object.keys(scenes));
          return;
        }
        
        console.log('PanoramaViewer: Loading scene from:', sceneConfig.tilesPath);
        console.log('PanoramaViewer: Levels:', sceneConfig.levels.length, '(max 8192px)');

        // Clear existing content
        containerRef.current.innerHTML = '';

        // Create viewer
        const viewer = new Marzipano.Viewer(containerRef.current, {
          controls: { mouseViewMode: 'drag' },
          stage: { progressive: true }
        });
        viewerRef.current = viewer;

        // Create geometry with 8K levels
        const geometry = new Marzipano.CubeGeometry(sceneConfig.levels);

        // View limits
        const limiter = Marzipano.RectilinearView.limit.traditional(
          sceneConfig.faceSize,
          100 * Math.PI / 180,
          120 * Math.PI / 180
        );

        const view = new Marzipano.RectilinearView(
          sceneConfig.initialView,
          limiter
        );

        // Image source - THIS IS THE KEY PART
        // URL pattern: /marzipano/tiles/0-living/1/f/0/0.jpg
        const source = new Marzipano.ImageUrlSource((tile) => {
          const prefix = sceneConfig.tilesPath;
          const face = tile.face;    // 'f', 'r', 'b', 'l', 'u', 'd'
          const level = tile.z + 1;  // 1-indexed in folders
          const x = tile.x;
          const y = tile.y;
          
          const url = `${prefix}/${level}/${face}/${y}/${x}.jpg`;
          return { url };
        });

        // Create and switch to scene
        const scene = viewer.createScene({
          source: source,
          geometry: geometry,
          view: view,
          pinFirstLevel: true
        });

        // Add hotspots
        if (sceneConfig.linkHotspots && sceneConfig.linkHotspots.length > 0) {
          console.log('PanoramaViewer: Adding', sceneConfig.linkHotspots.length, 'hotspots');
          sceneConfig.linkHotspots.forEach((hotspot) => {
            const element = createHotspotElement(hotspot, onHotspotClick);
            scene.hotspotContainer().createHotspot(element, { 
              yaw: hotspot.yaw, 
              pitch: hotspot.pitch 
            });
          });
        }

        scene.switchTo();
        console.log('PanoramaViewer: Scene loaded successfully');

        // Auto-rotation
        const autorotate = Marzipano.autorotate({
          yawSpeed: 0.015,
          targetPitch: 0,
          targetFov: Math.PI / 2
        });

        const autorotateTimer = setTimeout(() => {
          viewer.startMovement(autorotate);
        }, 2000);
        cleanupTimers.push(autorotateTimer);

        viewer.controls().addEventListener('active', () => {
          viewer.stopMovement();
        });

        let inactivityTimeout;
        viewer.controls().addEventListener('inactive', () => {
          clearTimeout(inactivityTimeout);
          inactivityTimeout = setTimeout(() => {
            viewer.startMovement(autorotate);
          }, 5000);
          cleanupTimers.push(inactivityTimeout);
        });

      } catch (error) {
        console.error('PanoramaViewer: Failed to initialize:', error);
      }
    };

    initViewer();

    return () => {
      cleanupTimers.forEach(timer => clearTimeout(timer));
      if (viewerRef.current) {
        viewerRef.current.destroy();
        viewerRef.current = null;
      }
    };
  }, [sceneId, onHotspotClick]);

  return (
    <div 
      ref={containerRef}
      className="w-full h-full absolute inset-0"
      style={{ 
        background: '#1a1814',
        touchAction: 'none'
      }}
    />
  );
};

export default PanoramaViewer;