import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { SongCard } from './SongCard';
import { Song } from '../../types/song';

interface DashboardProps {
  songs: Song[];
  onRemoveSong: (songId: number) => void;
}

export function Dashboard({ songs, onRemoveSong }: DashboardProps) {
  if (songs.length === 0) {
    return (
      <Card className="mx-6 mb-6">
        <CardContent className="p-12 text-center min-h-[300px] flex flex-col justify-center">
          <div className="text-muted-foreground mb-6">
            <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
          </div>
          <h3 className="text-xl font-medium mb-3">No songs in dashboard</h3>
          <p className="text-muted-foreground text-lg">Add songs from the table below to see them here</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mx-6 mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Dashboard</CardTitle>
          <Badge variant="secondary">
            {songs.length} song{songs.length !== 1 ? 's' : ''} in your collection
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {songs.map((song) => (
            <SongCard
              key={song.id}
              song={song}
              onRemove={onRemoveSong}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 