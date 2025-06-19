'use client';

import { useSongsList } from './useSongsList';
import { useIpodUI } from './useIpodUI';
import { usePlayState } from './usePlayState';
import { Song } from '../types/song';

export function useIpodControls() {
  const songsList = useSongsList();
  const ipodUI = useIpodUI();
  const playState = usePlayState();

  const onMenu = () => ipodUI.toggleSidebar();
  const onPlayPause = () => playState.toggle();
  
  const onUp = () => {
    if (songsList.selectedSongID !== null && !ipodUI.sidebarOpen && songsList.songs.length > 0) {
      const currentIndex = songsList.songs.findIndex((song: Song) => song.id === songsList.selectedSongID);
      if (currentIndex > 0) {
        songsList.selectSong(songsList.songs[currentIndex - 1].id);
      } else {
        songsList.selectSong(songsList.songs[songsList.songs.length - 1].id);
      }
    } else {
      songsList.highlightPrevious();
    }
  };
  
  const onDown = () => {
    if (songsList.selectedSongID !== null && !ipodUI.sidebarOpen && songsList.songs.length > 0) {
      const currentIndex = songsList.songs.findIndex((song: Song) => song.id === songsList.selectedSongID);
      if (currentIndex < songsList.songs.length - 1) {
        songsList.selectSong(songsList.songs[currentIndex + 1].id);
      } else {
        songsList.selectSong(songsList.songs[0].id);
      }
    } else {
      songsList.highlightNext();
    }
  };
  
  const onCenter = () => {
    if (!ipodUI.sidebarOpen && songsList.selectedSongID !== null) {
      ipodUI.toggleTopBar();
      return;
    }
    songsList.selectSong(songsList.highlightedSongID);
    ipodUI.closeSidebar();
  };

  return {
    selectedSongID: songsList.selectedSongID,
    setSelectedSongID: songsList.selectSong,
    highlightedSongID: songsList.highlightedSongID,
    setHighlightedSongID: songsList.highlightSong,
    selectedSong: songsList.selectedSong,
    
    sidebarOpen: ipodUI.sidebarOpen,
    setSidebarOpen: ipodUI.setSidebarOpen,
    isPlaying: playState.isPlaying,
    setIsPlaying: playState.setIsPlaying,
    showTopBar: ipodUI.showTopBar,
    setShowTopBar: ipodUI.setShowTopBar,
    
    onMenu,
    onPlayPause,
    onUp,
    onDown,
    onCenter,
  };
} 