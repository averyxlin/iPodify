'use client';

import { useSongs } from './useSongs';
import { useIpodUI } from './useIpodUI';
import { Song } from '../types/song';
import { useState } from 'react';

export function useIpodControls() {
  const { songs } = useSongs();
  const ipodUI = useIpodUI();
  
  const [selectedSongID, setSelectedSongID] = useState<number | null>(null);
  const [highlightedSongID, setHighlightedSongID] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const selectedSong = songs.find((song: Song) => song.id === selectedSongID) || null;
  const highlightedIndex = songs.findIndex((song: Song) => song.id === highlightedSongID);

  const selectSong = (id: number | null) => setSelectedSongID(id);
  const highlightSong = (id: number | null) => setHighlightedSongID(id);

  const highlightNext = () => {
    if (songs.length === 0) return;
    if (highlightedIndex < songs.length - 1) {
      setHighlightedSongID(songs[highlightedIndex + 1].id);
    } else {
      setHighlightedSongID(songs[0].id);
    }
  };

  const highlightPrevious = () => {
    if (songs.length === 0) return;
    if (highlightedIndex > 0) {
      setHighlightedSongID(songs[highlightedIndex - 1].id);
    } else {
      setHighlightedSongID(songs[songs.length - 1].id);
    }
  };

  const onMenu = () => ipodUI.toggleSidebar();
  
  const onPlayPause = () => {
    if (selectedSong && selectedSong.spotify_url) {
      setIsPlaying(!isPlaying);
    } else {
      setIsPlaying(!isPlaying);
    }
  };
  
  const onUp = () => {
    if (selectedSongID !== null && !ipodUI.sidebarOpen && songs.length > 0) {
      const currentIndex = songs.findIndex((song: Song) => song.id === selectedSongID);
      if (currentIndex > 0) {
        selectSong(songs[currentIndex - 1].id);
      } else {
        selectSong(songs[songs.length - 1].id);
      }
    } else {
      highlightPrevious();
    }
  };
  
  const onDown = () => {
    if (selectedSongID !== null && !ipodUI.sidebarOpen && songs.length > 0) {
      const currentIndex = songs.findIndex((song: Song) => song.id === selectedSongID);
      if (currentIndex < songs.length - 1) {
        selectSong(songs[currentIndex + 1].id);
      } else {
        selectSong(songs[0].id);
      }
    } else {
      highlightNext();
    }
  };
  
  const onCenter = () => {
    if (!ipodUI.sidebarOpen && selectedSongID !== null) {
      ipodUI.toggleTopBar();
      return;
    }
    selectSong(highlightedSongID);
    ipodUI.setSidebarOpen(false);
  };

  return {
    selectedSongID,
    setSelectedSongID: selectSong,
    highlightedSongID,
    setHighlightedSongID: highlightSong,
    selectedSong,
    
    sidebarOpen: ipodUI.sidebarOpen,
    setSidebarOpen: ipodUI.setSidebarOpen,
    isPlaying,
    setIsPlaying,
    showTopBar: ipodUI.showTopBar,
    setShowTopBar: ipodUI.setShowTopBar,
    
    onMenu,
    onPlayPause,
    onUp,
    onDown,
    onCenter,
  };
} 