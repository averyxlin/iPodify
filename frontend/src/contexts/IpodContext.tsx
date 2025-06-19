'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useIpodControls } from '../hooks';
import { Song } from '../types/song';

interface IpodContextType {
  selectedSongID: number | null;
  setSelectedSongID: (id: number | null) => void;
  highlightedSongID: number | null;
  setHighlightedSongID: (id: number | null) => void;
  selectedSong: Song | null;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  onMenu: () => void;
  onPlayPause: () => void;
  onUp: () => void;
  onDown: () => void;
  onCenter: () => void;
  showTopBar: boolean;
  setShowTopBar: (show: boolean) => void;
}

const IpodContext = createContext<IpodContextType | undefined>(undefined);

export function IpodProvider({ children }: { children: ReactNode }) {
  const ipodControls = useIpodControls();

  return (
    <IpodContext.Provider value={ipodControls}>
      {children}
    </IpodContext.Provider>
  );
}

export function useIpodContext() {
  const context = useContext(IpodContext);
  if (!context) throw new Error('useIpodContext must be used within IpodProvider');
  return context;
} 