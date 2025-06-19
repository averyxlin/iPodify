'use client';

import { useState } from 'react';

export function useIpodUI() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showTopBar, setShowTopBar] = useState(false);

  const toggleSidebar = () => setSidebarOpen((open) => !open);
  const toggleTopBar = () => setShowTopBar((show) => !show);

  const closeSidebar = () => setSidebarOpen(false);
  const openSidebar = () => setSidebarOpen(true);

  const closeTopBar = () => setShowTopBar(false);
  const openTopBar = () => setShowTopBar(true);

  return {
    sidebarOpen,
    showTopBar,
    
    setSidebarOpen,
    setShowTopBar,
    toggleSidebar,
    toggleTopBar,
    closeSidebar,
    openSidebar,
    closeTopBar,
    openTopBar,
  };
} 