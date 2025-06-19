'use client';

import { useState, useCallback } from 'react';

export function usePlayingState(initialState = false) {
  const [isPlaying, setIsPlaying] = useState(initialState);

  const play = useCallback(() => setIsPlaying(true), []);
  const pause = useCallback(() => setIsPlaying(false), []);
  const toggle = useCallback(() => setIsPlaying(prev => !prev), []);

  return {
    isPlaying,
    setIsPlaying,
    play,
    pause,
    toggle,
  };
} 