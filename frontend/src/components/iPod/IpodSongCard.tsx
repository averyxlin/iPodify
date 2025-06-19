import React from 'react';
import { useIpodContext } from '../../contexts/IpodContext';
import { SongCard } from '../song/SongCard';

export function IpodSongCard() {
  const { selectedSong } = useIpodContext();
  return (
    <div className="flex-1 flex items-center justify-center">
      {selectedSong && <SongCard song={selectedSong} />}
    </div>
  );
} 