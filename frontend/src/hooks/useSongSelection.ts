'use client';

import { useState, useCallback, useEffect } from 'react';
import { Song } from '../types/song';

export function useSongSelection(songs: Song[]) {
  const [selectedSongID, setSelectedSongID] = useState<number | null>(null);
  const [highlightedSongID, setHighlightedSongID] = useState<number | null>(null);

  const selectedSong = songs.find(song => song.id === selectedSongID) || null;

  const selectSong = useCallback((id: number | null) => {
    setSelectedSongID(id);
  }, []);

  const highlightSong = useCallback((id: number | null) => {
    setHighlightedSongID(id);
  }, []);

  const selectHighlightedSong = useCallback(() => {
    if (highlightedSongID) {
      setSelectedSongID(highlightedSongID);
    }
  }, [highlightedSongID]);

  const clearSelection = useCallback(() => {
    setSelectedSongID(null);
    setHighlightedSongID(null);
  }, []);

  useEffect(() => {
    if (selectedSongID && !songs.find(song => song.id === selectedSongID)) {
      setSelectedSongID(null);
    }
    if (highlightedSongID && !songs.find(song => song.id === highlightedSongID)) {
      setHighlightedSongID(null);
    }
  }, [songs, selectedSongID, highlightedSongID]);

  return {
    selectedSongID,
    selectedSong,
    highlightedSongID,
    selectSong,
    highlightSong,
    selectHighlightedSong,
    clearSelection,
  };
} 