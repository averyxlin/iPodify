import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Song } from '../../types/song';

interface SongCardProps {
  song: Song;
}

export function SongCard({ song }: SongCardProps) {
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="overflow-hidden w-56">
      <CardContent className="p-3">
        <div className="aspect-square bg-muted relative overflow-hidden rounded-lg">
          {song.cover_art_url ? (
            <img
              src={song.cover_art_url}
              alt={`${song.title} cover art`}
              className="w-full h-full object-cover"
              onError={e => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : null}
          <div className={`absolute inset-0 bg-gradient-to-br from-muted to-muted/80 flex items-center justify-center ${song.cover_art_url ? 'hidden' : ''}`}>
            <span className="text-muted-foreground text-sm font-medium">No Cover Art</span>
          </div>
        </div>
      </CardContent>
      <div className="px-4 pb-4">
        <h3 className="font-semibold truncate" title={song.title}>{song.title}</h3>
        <p className="text-sm text-muted-foreground truncate" title={song.artist}>{song.artist}</p>
        <p className="text-xs text-muted-foreground truncate" title={song.album}>{song.album}</p>
        <div className="flex justify-between items-center mt-3 text-xs text-muted-foreground">
          <span>{song.year}</span>
          <span>{formatDuration(song.duration)}</span>
        </div>
        {song.genre && (
          <div className="mt-2">
            <Badge variant="outline" className="text-xs">
              {song.genre}
            </Badge>
          </div>
        )}
      </div>
    </Card>
  );
} 