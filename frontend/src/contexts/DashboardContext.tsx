import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Song } from '../types/song';

interface DashboardContextType {
  dashboardSongs: Song[];
  addToDashboard: (song: Song) => void;
  removeFromDashboard: (songId: number) => void;
  isInDashboard: (songId: number) => boolean;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [dashboardSongs, setDashboardSongs] = useState<Song[]>([]);

  const addToDashboard = (song: Song) => {
    setDashboardSongs(prev => {
      if (prev.some(s => s.id === song.id)) {
        return prev;
      }
      return [...prev, song];
    });
  };

  const removeFromDashboard = (songId: number) => {
    setDashboardSongs(prev => prev.filter(song => song.id !== songId));
  };

  const isInDashboard = (songId: number) => {
    return dashboardSongs.some(song => song.id === songId);
  };

  return (
    <DashboardContext.Provider
      value={{
        dashboardSongs,
        addToDashboard,
        removeFromDashboard,
        isInDashboard,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
} 