'use client';

import { useState } from 'react';

export function usePlayState(initialState = false) {
  const [isPlaying, setIsPlaying] = useState(initialState);

  const play = () => setIsPlaying(true);
  const pause = () => setIsPlaying(false);
  const toggle = () => setIsPlaying((playing) => !playing);

  return {
    isPlaying,
    setIsPlaying,
    play,
    pause,
    toggle,
  };
} 