'use client';

import { useSongs } from '../hooks/useSongs';

export default function Home() {
  const { songs, isLoading, isError } = useSongs();
  
  console.log('Songs data:', songs);
  console.log('Loading state:', isLoading);
  console.log('Error state:', isError);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading songs...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-red-500">Error loading songs</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8">Songs</h1>
      <div className="grid gap-4">
        {songs?.map((song: any) => (
          <div 
            key={song.id} 
            className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <h2 className="text-xl font-semibold">{song.title}</h2>
            <p className="text-gray-600 dark:text-gray-300">{song.artist}</p>
            {song.album && (
              <p className="text-sm text-gray-500 dark:text-gray-400">Album: {song.album}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
