'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSongs } from './useSongs';
import { Song } from '../types/song';

export function useSongsList() {
  const { songs, isLoading, isError } = useSongs();
  const [selectedSongID, setSelectedSongID] = useState<number | null>(null);
  const [highlightedSongID, setHighlightedSongID] = useState<number | null>(null);

  useEffect(() => {
    if (songs.length > 0 && highlightedSongID === null) {
      setHighlightedSongID(songs[0].id);
    }
  }, [songs, highlightedSongID]);

  useEffect(() => {
    if (songs.length > 0 && (highlightedSongID === null || !songs.some((s: Song) => s.id === highlightedSongID))) {
      setHighlightedSongID(songs[0].id);
    }
  }, [songs, highlightedSongID]);

  const selectedSong = useMemo(() => 
    songs.find((song: Song) => song.id === selectedSongID) || null, 
    [songs, selectedSongID]
  );

  const highlightedSong = useMemo(() => 
    songs.find((song: Song) => song.id === highlightedSongID) || null, 
    [songs, highlightedSongID]
  );

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

  return {
    songs,
    isLoading,
    isError,
    
    selectedSongID,
    selectedSong,
    highlightedSongID,
    highlightedSong,
    highlightedIndex,
    
    selectSong,
    highlightSong,
    highlightNext,
    highlightPrevious,
  };
} 