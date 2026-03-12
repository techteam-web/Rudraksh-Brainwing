import React, { useState, useCallback, useRef, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import MainPage from './pages/MainPage';
import FloorPlanPage from './pages/FloorPlanPage';
import HomePage from './pages/Homepage';
import PageTransition from './components/PageTransition';
import FullscreenPrompt from './components/FullscreenPrompt';

const AppContent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showFullscreenPrompt, setShowFullscreenPrompt] = useState(true);

  const pendingNavRef = useRef(null);

  // ── Track last active scene per bhkType ──
  const lastSceneRef = useRef({});

  const handleSceneChange = useCallback((bhkType, sceneId) => {
    lastSceneRef.current[bhkType] = sceneId;
  }, []);

  // Hide prompt if already fullscreen or when fullscreen is entered externally
  useEffect(() => {
    const onFSChange = () => {
      if (document.fullscreenElement) {
        setShowFullscreenPrompt(false);
      }
    };
    document.addEventListener('fullscreenchange', onFSChange);
    document.addEventListener('webkitfullscreenchange', onFSChange);

    if (document.fullscreenElement) setShowFullscreenPrompt(false);

    return () => {
      document.removeEventListener('fullscreenchange', onFSChange);
      document.removeEventListener('webkitfullscreenchange', onFSChange);
    };
  }, []);

  const navigateWithTransition = useCallback((path, room = null) => {
    if (isTransitioning || pendingNavRef.current) return;
    if (path === location.pathname && !room) return;
    pendingNavRef.current = path;
    setSelectedRoom(room);
    setIsTransitioning(true);
  }, [isTransitioning, location.pathname]);

  const navigateToHome = useCallback(() => {
    navigateWithTransition('/');
  }, [navigateWithTransition]);

  const navigateToMain = useCallback((bhkType = '4bhk', room = null) => {
    if (bhkType && typeof bhkType === 'object' && bhkType.nativeEvent) {
      bhkType = '4bhk';
      room = null;
    }
    if (typeof bhkType === 'string' && !['3bhk', '4bhk'].includes(bhkType)) {
      room = bhkType;
      bhkType = location.pathname.includes('3bhk') ? '3bhk' : '4bhk';
    }
    const path = `/${bhkType}${room ? `?room=${encodeURIComponent(room)}` : ''}`;
    navigateWithTransition(path, room);
  }, [navigateWithTransition, location.pathname]);

  const navigateToFloorPlan = useCallback((bhkType) => {
    if (!bhkType) {
      bhkType = location.pathname.includes('3bhk') ? '3bhk' : '4bhk';
    }
    navigateWithTransition(`/${bhkType}/floorplan`);
  }, [navigateWithTransition, location.pathname]);

  const handleRoomSelect = useCallback((roomId) => {
    const bhkType = location.pathname.includes('3bhk') ? '3bhk' : '4bhk';
    const path = `/${bhkType}?room=${encodeURIComponent(roomId)}`;
    navigateWithTransition(path, roomId);
  }, [navigateWithTransition, location.pathname]);

  // ── Return to MainPage from FloorPlan, restoring last scene ──
  const handleFloorPlanClose = useCallback((bhkType) => {
    const lastScene = lastSceneRef.current[bhkType] || null;
    navigateToMain(bhkType, lastScene);
  }, [navigateToMain]);

  const handleMidpoint = useCallback(() => {
    if (pendingNavRef.current) {
      navigate(pendingNavRef.current);
    }
  }, [navigate]);

  const handleComplete = useCallback(() => {
    pendingNavRef.current = null;
    setIsTransitioning(false);
  }, []);

  const getInitialRoom = useCallback(() => {
    const params = new URLSearchParams(location.search);
    return params.get('room') || selectedRoom;
  }, [location.search, selectedRoom]);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {showFullscreenPrompt && (
        <FullscreenPrompt onEnter={() => setShowFullscreenPrompt(false)} />
      )}

      <Routes>
        <Route path="/" element={<HomePage onExplore={navigateToMain} />} />
        <Route
          path="/4bhk"
          element={
            <MainPage
              onClose={navigateToHome}
              onFloorPlanClick={() => navigateToFloorPlan('4bhk')}
              initialRoom={getInitialRoom()}
              bhkType="4bhk"
              onSceneChange={(sceneId) => handleSceneChange('4bhk', sceneId)}
            />
          }
        />
        <Route
          path="/3bhk"
          element={
            <MainPage
              onClose={navigateToHome}
              onFloorPlanClick={() => navigateToFloorPlan('3bhk')}
              initialRoom={getInitialRoom()}
              bhkType="3bhk"
              onSceneChange={(sceneId) => handleSceneChange('3bhk', sceneId)}
            />
          }
        />
        <Route
          path="/4bhk/floorplan"
          element={
            <FloorPlanPage
              onClose={() => handleFloorPlanClose('4bhk')}
              onRoomSelect={handleRoomSelect}
              bhkType="4bhk"
            />
          }
        />
        <Route
          path="/3bhk/floorplan"
          element={
            <FloorPlanPage
              onClose={() => handleFloorPlanClose('3bhk')}
              onRoomSelect={handleRoomSelect}
              bhkType="3bhk"
            />
          }
        />
        <Route path="*" element={<HomePage onExplore={navigateToMain} />} />
      </Routes>
      <img
            src="/images/Brainwing-logo.webp"
            alt="Brainwing"
            className="fixed bottom-3 left-24 w-30 z-[9999] pointer-events-none opacity-55
             sm:bottom-2 sm:left-33 sm:w-35
             md:bottom-2 md:left-45 md:w-30
             lg:bottom-2 lg:left-50 lg:w-40
             xl:bottom-2 xl:left-50 xl:w-42
             2xl:bottom-2 2xl:left-50 2xl:w-46
             3xl:bottom-2 3xl:left-50 3xl:w-44
             4xl:bottom-2 4xl:left-50 4xl:w-50
             5xl:bottom-2 5xl:left-50 5xl:w-62"
          />

      <PageTransition
        isActive={isTransitioning}
        onMidpoint={handleMidpoint}
        onComplete={handleComplete}
      />
    </div>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

export default App;