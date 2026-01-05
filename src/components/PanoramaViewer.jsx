import React, { useEffect, useRef } from 'react';

const PanoramaViewer = ({ sceneId, onHotspotClick }) => {
  const containerRef = useRef(null);
  const viewerRef = useRef(null);

  // Scene configurations from data.js
  const scenes = {
    'kids-bedroom-1': {
      id: '0-kids_bedroom_final_01',
      tilesPath: '/marzipano/tiles/0-kids_bedroom_final_01',
      levels: [
        { tileSize: 256, size: 256, fallbackOnly: true },
        { tileSize: 512, size: 512 },
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
      id: '1-kids_bedroom_final_02',
      tilesPath: '/marzipano/tiles/1-kids_bedroom_final_02',
      levels: [
        { tileSize: 256, size: 256, fallbackOnly: true },
        { tileSize: 512, size: 512 },
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
    console.log('PanoramaViewer mounted with sceneId:', sceneId);
    
    const loadMarzipano = () => {
      return new Promise((resolve, reject) => {
        if (window.Marzipano) {
          resolve(window.Marzipano);
          return;
        }

        const script = document.createElement('script');
        script.src = '/marzipano/marzipano.js';
        script.onload = () => resolve(window.Marzipano);
        script.onerror = reject;
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

      // Arrow icon
      inner.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" width="22" height="22" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="transform: rotate(${(hotspot.rotation || 0) * 180 / Math.PI}deg);">
          <path d="M12 19V5M5 12l7-7 7 7"/>
        </svg>
      `;

      wrapper.appendChild(inner);

      // Hover effects
      wrapper.addEventListener('mouseenter', () => {
        inner.style.transform = 'scale(1.15)';
        inner.style.boxShadow = '0 6px 25px rgba(193, 127, 89, 0.6)';
      });

      wrapper.addEventListener('mouseleave', () => {
        inner.style.transform = 'scale(1)';
        inner.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.4)';
      });

      // Click handler
      wrapper.addEventListener('click', (e) => {
        e.stopPropagation();
        if (onClick) {
          onClick(hotspot.target);
        }
      });

      return wrapper;
    };

    const initViewer = async () => {
      try {
        console.log('Initializing viewer for scene:', sceneId);
        const Marzipano = await loadMarzipano();
        console.log('Marzipano loaded:', !!Marzipano);
        
        if (!containerRef.current) {
          console.error('Container ref is null');
          return;
        }

        const sceneConfig = scenes[sceneId];
        if (!sceneConfig) {
          console.error('Scene not found:', sceneId, 'Available scenes:', Object.keys(scenes));
          return;
        }
        
        console.log('Scene config found:', sceneConfig.tilesPath);

        // Clear any existing content
        containerRef.current.innerHTML = '';

        const viewerOpts = {
          controls: {
            mouseViewMode: 'drag'
          }
        };

        const viewer = new Marzipano.Viewer(containerRef.current, viewerOpts);
        viewerRef.current = viewer;

        const geometry = new Marzipano.CubeGeometry(sceneConfig.levels);

        const limiter = Marzipano.RectilinearView.limit.traditional(
          sceneConfig.faceSize,
          100 * Math.PI / 180,
          120 * Math.PI / 180
        );

        const view = new Marzipano.RectilinearView(
          sceneConfig.initialView,
          limiter
        );

        const source = new Marzipano.ImageUrlSource((tile) => {
          const prefix = sceneConfig.tilesPath;
          const face = tile.face;
          const level = tile.z + 1;
          const x = tile.x;
          const y = tile.y;
          
          return { url: `${prefix}/${level}/${face}/${y}/${x}.jpg` };
        });

        const scene = viewer.createScene({
          source: source,
          geometry: geometry,
          view: view,
          pinFirstLevel: true
        });

        // Add hotspots
        if (sceneConfig.linkHotspots && sceneConfig.linkHotspots.length > 0) {
          sceneConfig.linkHotspots.forEach((hotspot) => {
            const element = createHotspotElement(hotspot, onHotspotClick);
            
            scene.hotspotContainer().createHotspot(element, { 
              yaw: hotspot.yaw, 
              pitch: hotspot.pitch 
            }, { perspective: { radius: 400 } });
          });
        }

        scene.switchTo();

        // Auto-rotation
        const autorotate = Marzipano.autorotate({
          yawSpeed: 0.03,
          targetPitch: 0,
          targetFov: Math.PI / 2
        });

        setTimeout(() => {
          viewer.startMovement(autorotate);
        }, 1000);

        viewer.controls().addEventListener('active', () => {
          viewer.stopMovement();
        });

        let autorotateTimeout;
        viewer.controls().addEventListener('inactive', () => {
          clearTimeout(autorotateTimeout);
          autorotateTimeout = setTimeout(() => {
            viewer.startMovement(autorotate);
          }, 3000);
        });

      } catch (error) {
        console.error('Failed to initialize panorama viewer:', error);
      }
    };

    initViewer();

    return () => {
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