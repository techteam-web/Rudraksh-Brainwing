import React, { useState, useCallback, useRef } from 'react';
import MainPage from './pages/MainPage';
import FloorPlanPage from './pages/FloorPlanPage';
import HomePage from './pages/Homepage';
import PageTransition from './components/PageTransition';

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const nextPageRef = useRef(null);

  const navigateToMain = useCallback((room = null) => {
    if (isTransitioning) return;
    // Ignore if room is an event object
    if (room && typeof room === 'object' && room.nativeEvent) {
      room = null;
    }
    setSelectedRoom(room);
    nextPageRef.current = 'main';
    setIsTransitioning(true);
  }, [isTransitioning]);

  const navigateToHome = useCallback(() => {
    if (isTransitioning) return;
    nextPageRef.current = 'home';
    setIsTransitioning(true);
  }, [isTransitioning]);

  const navigateToFloorPlan = useCallback(() => {
    if (isTransitioning) return;
    nextPageRef.current = 'floorplan';
    setIsTransitioning(true);
  }, [isTransitioning]);

  // Called at the midpoint when screen is fully covered
  const handleTransitionMidpoint = useCallback(() => {
    if (nextPageRef.current) {
      setCurrentPage(nextPageRef.current);
    }
  }, []);

  // Called when transition animation completes
  const handleTransitionEnd = useCallback(() => {
    nextPageRef.current = null;
    setIsTransitioning(false);
  }, []);

  // Handle room selection from floor plan
  const handleRoomSelect = useCallback((roomId) => {
    if (isTransitioning) return;
    setSelectedRoom(roomId);
    nextPageRef.current = 'main';
    setIsTransitioning(true);
  }, [isTransitioning]);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Page Container */}
      <div className="w-full h-full">
        {currentPage === 'home' && <HomePage onExplore={navigateToMain} />}
        {currentPage === 'main' && (
          <MainPage 
            onClose={navigateToHome} 
            onFloorPlanClick={navigateToFloorPlan}
            initialRoom={selectedRoom}
          />
        )}
        {currentPage === 'floorplan' && (
          <FloorPlanPage 
            onClose={navigateToMain}
            onRoomSelect={handleRoomSelect}
          />
        )}
      </div>

      {/* GSAP Page Transition */}
      <PageTransition 
        isActive={isTransitioning}
        onMidpoint={handleTransitionMidpoint}
        onComplete={handleTransitionEnd}
      />
    </div>
  );
};

export default App;