export interface Song {
  id: number;
  title: string;
  artist: string;
  album: string;
  year: number;
  duration: number;
  cover_art_url?: string;
  spotify_url?: string;
  genre?: string;
  decade?: string;
} 