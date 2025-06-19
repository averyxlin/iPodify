'use client';

import { useSongSelection } from './useSongSelection';
import { useSidebar } from './useSidebar';
import { usePlayingState } from './usePlayingState';
import { useModalState } from './useModalState';
import { Song } from '../types/song';

export function useIpodState(songs: Song[]) {
  const songSelection = useSongSelection(songs);
  const sidebar = useSidebar();
  const playingState = usePlayingState();
  const topBar = useModalState(true);

  return {
    selectedSongID: songSelection.selectedSongID,
    selectedSong: songSelection.selectedSong,
    highlightedSongID: songSelection.highlightedSongID,
    selectSong: songSelection.selectSong,
    highlightSong: songSelection.highlightSong,
    selectHighlightedSong: songSelection.selectHighlightedSong,
    clearSelection: songSelection.clearSelection,

    sidebarOpen: sidebar.isOpen,
    setSidebarOpen: sidebar.toggle,
    openSidebar: sidebar.open,
    closeSidebar: sidebar.close,

    isPlaying: playingState.isPlaying,
    setIsPlaying: playingState.setIsPlaying,
    play: playingState.play,
    pause: playingState.pause,
    togglePlay: playingState.toggle,

    showTopBar: topBar.isOpen,
    setShowTopBar: (show: boolean) => show ? topBar.open() : topBar.close(),
  };
} 