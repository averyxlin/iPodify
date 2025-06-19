'use client';

import { useState } from 'react';

export function useIpodUI() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showTopBar, setShowTopBar] = useState(false);

  const toggleSidebar = () => setSidebarOpen((open) => !open);
  const toggleTopBar = () => setShowTopBar((show) => !show);

  return {
    sidebarOpen,
    showTopBar,
    
    setSidebarOpen,
    setShowTopBar,
    toggleSidebar,
    toggleTopBar,
  };
} 