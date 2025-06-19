import React from 'react';
import { useIpodContext } from '../../contexts/IpodContext';
import { useSongs } from '../../hooks';
import { Song } from '../../types/song';

export function SongList() {
  const { songs, isLoading } = useSongs();
  const { selectedSongID, setSelectedSongID } = useIpodContext();

  if (isLoading) return <div>Loading...</div>;

  return (
    <ul className="divide-y divide-gray-200 overflow-y-auto max-h-full">
      {songs.map((song: Song) => (
        <li
          key={song.id}
          className={`p-2 cursor-pointer ${song.id === selectedSongID ? 'bg-blue-100 font-bold' : ''}`}
          onClick={() => setSelectedSongID(song.id)}
        >
          <div className="truncate">{song.title} <span className="text-xs text-gray-500">{song.artist}</span></div>
        </li>
      ))}
    </ul>
  );
} 