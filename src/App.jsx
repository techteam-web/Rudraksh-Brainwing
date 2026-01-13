import React, { useState, useCallback, useRef } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import MainPage from './pages/MainPage';
import FloorPlanPage from './pages/FloorPlanPage';
import HomePage from './pages/Homepage';
import PageTransition from './components/PageTransition';

const AppContent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  
  // Store pending navigation - this is the key to preventing double transitions
  const pendingNavRef = useRef(null);

  // Generic navigation handler - all navigation goes through here
  const navigateWithTransition = useCallback((path, room = null) => {
    // Prevent multiple transitions
    if (isTransitioning || pendingNavRef.current) return;
    
    // Don't transition to current page
    if (path === location.pathname && !room) return;

    pendingNavRef.current = path;
    setSelectedRoom(room);
    setIsTransitioning(true);
  }, [isTransitioning, location.pathname]);

  // Navigate to home
  const navigateToHome = useCallback(() => {
    navigateWithTransition('/');
  }, [navigateWithTransition]);

  // Navigate to main page
  const navigateToMain = useCallback((bhkType = '4bhk', room = null) => {
    // Handle event object from button clicks
    if (bhkType && typeof bhkType === 'object' && bhkType.nativeEvent) {
      bhkType = '4bhk';
      room = null;
    }
    
    // Handle room string passed as first arg
    if (typeof bhkType === 'string' && !['3bhk', '4bhk'].includes(bhkType)) {
      room = bhkType;
      bhkType = location.pathname.includes('3bhk') ? '3bhk' : '4bhk';
    }

    const path = `/${bhkType}${room ? `?room=${encodeURIComponent(room)}` : ''}`;
    navigateWithTransition(path, room);
  }, [navigateWithTransition, location.pathname]);

  // Navigate to floor plan
  const navigateToFloorPlan = useCallback((bhkType) => {
    if (!bhkType) {
      bhkType = location.pathname.includes('3bhk') ? '3bhk' : '4bhk';
    }
    navigateWithTransition(`/${bhkType}/floorplan`);
  }, [navigateWithTransition, location.pathname]);

  // Handle room selection from floor plan
  const handleRoomSelect = useCallback((roomId) => {
    const bhkType = location.pathname.includes('3bhk') ? '3bhk' : '4bhk';
    const path = `/${bhkType}?room=${encodeURIComponent(roomId)}`;
    navigateWithTransition(path, roomId);
  }, [navigateWithTransition, location.pathname]);

  // Called when overlay fully covers screen - do the actual navigation
  const handleMidpoint = useCallback(() => {
    if (pendingNavRef.current) {
      navigate(pendingNavRef.current);
    }
  }, [navigate]);

  // Called when transition animation completes
  const handleComplete = useCallback(() => {
    pendingNavRef.current = null;
    setIsTransitioning(false);
  }, []);

  // Get room from URL
  const getInitialRoom = useCallback(() => {
    const params = new URLSearchParams(location.search);
    return params.get('room') || selectedRoom;
  }, [location.search, selectedRoom]);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <Routes>
        <Route 
          path="/" 
          element={
            <HomePage 
              onExplore={navigateToMain}
            />
          } 
        />
        
        <Route 
          path="/4bhk" 
          element={
            <MainPage 
              onClose={navigateToHome} 
              onFloorPlanClick={() => navigateToFloorPlan('4bhk')}
              initialRoom={getInitialRoom()}
              bhkType="4bhk"
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
            />
          } 
        />
        
        <Route 
          path="/4bhk/floorplan" 
          element={
            <FloorPlanPage 
              onClose={() => navigateToMain('4bhk')}
              onRoomSelect={handleRoomSelect}
              bhkType="4bhk"
            />
          } 
        />
        
        <Route 
          path="/3bhk/floorplan" 
          element={
            <FloorPlanPage 
              onClose={() => navigateToMain('3bhk')}
              onRoomSelect={handleRoomSelect}
              bhkType="3bhk"
            />
          } 
        />
        
        <Route 
          path="*" 
          element={
            <HomePage 
              onExplore={navigateToMain}
            />
          } 
        />
      </Routes>

      {/* Single transition overlay */}
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