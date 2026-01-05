import React, { useState, useCallback, useRef } from 'react';
import HomePage from './pages/Homepage';
import MainPage from './pages/MainPage';
import FloorPlanPage from './pages/FloorPlanPage';
import ShaderTransition from './components/ShaderTransition';

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
      // Optional: Scroll to top on page change
      window.scrollTo(0, 0);
    }
  }, []);

  // Called when shrink animation completes
  const handleTransitionEnd = useCallback(() => {
    nextPageRef.current = null;
    setIsTransitioning(false);
  }, []);

  // Handle room selection from floor plan
  const handleRoomSelect = useCallback((roomId) => {
    setSelectedRoom(roomId);
    nextPageRef.current = 'main';
    setIsTransitioning(true);
  }, []);

  return (
    /* FIX: Changed h-screen to min-h-screen 
       FIX: Removed overflow-hidden to allow the browser to scroll
    */
    <div className="relative w-full min-h-screen">
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

      {/* GLSL Shader Transition 
          Note: Ensure this component uses 'fixed' positioning so it 
          stays visible even if the user has scrolled down.
      */}
      <ShaderTransition 
        isActive={isTransitioning}
        onComplete={handleTransitionMidpoint}
        onEnd={handleTransitionEnd}
      />
    </div>
  );
};

export default App;