'use client';

import { useState, useEffect } from 'react';
import { Song } from '../types/song';

export function useSpotifyPlayer(selectedSong: Song | null, isPlaying: boolean) {
  const [showSpotifyEmbed, setShowSpotifyEmbed] = useState(false);
  const [spotifyError, setSpotifyError] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(false);

  useEffect(() => {
    setShowSpotifyEmbed(false);
    setSpotifyError(false);
    setShowSkeleton(false);
  }, [selectedSong?.id]);

  useEffect(() => {
    if (isPlaying && selectedSong?.spotify_url && !showSpotifyEmbed) {
      setShowSpotifyEmbed(true);
      setSpotifyError(false);
      setShowSkeleton(true);
    } else if (!isPlaying && showSpotifyEmbed) {
      setShowSpotifyEmbed(false);
      setSpotifyError(false);
      setShowSkeleton(false);
    }
  }, [isPlaying, selectedSong, showSpotifyEmbed]);

  useEffect(() => {
    if (showSkeleton) {
      const timer = setTimeout(() => {
        setShowSkeleton(false);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [showSkeleton]);

  const handleSpotifyError = () => {
    setSpotifyError(true);
    setShowSpotifyEmbed(false);
    setShowSkeleton(false);
  };

  const handleBackFromSpotify = () => {
    setShowSpotifyEmbed(false);
    setSpotifyError(false);
    setShowSkeleton(false);
  };

  const canShowSpotify = selectedSong?.spotify_url && !spotifyError;

  return {
    showSpotifyEmbed,
    spotifyError,
    showSkeleton,
    canShowSpotify,
    handleSpotifyError,
    handleBackFromSpotify,
  };
} 