import useSWR from 'swr';

const API_BASE_URL = 'http://localhost:8000/api';

interface Song {
  id: number;
  title: string;
  artist: string;
  spotify_url: string;
  year: number;
  duration: number;
  created_at: string;
  updated_at: string;
}

const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('An error occurred while fetching the data.');
  }
  return response.json();
};

export function useSongs() {
  const { data, error, isLoading, mutate } = useSWR<Song[]>(
    `${API_BASE_URL}/songs/`,
    fetcher
  );

  return {
    songs: data,
    isLoading,
    isError: error,
    mutate,
  };
}

export function useSong(id: number) {
  const { data, error, isLoading, mutate } = useSWR<Song>(
    id ? `${API_BASE_URL}/songs/${id}/` : null,
    fetcher
  );

  return {
    song: data,
    isLoading,
    isError: error,
    mutate,
  };
} 