'use client';

import useSWR from "swr";

const API_BASE_URL = 'http://localhost:8000/api';

const fetcher = async (url: string) => {
  try {
    const response = await fetch(url, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Response data:', data);
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};

export function useSongs() {
  const { data, error, isLoading, mutate } = useSWR(
    `${API_BASE_URL}/songs/`,
    fetcher
  );

  const createSong = async (songData: {
    title: string;
    artist: string;
    album: string;
    year: number;
    duration: number;
    spotify_url: string;
    cover_art_url: string;
    genre: string;
  }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/songs/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(songData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to add song');
      }
      
      await mutate();
      
      return data;
    } catch (error) {
      console.error('Create song error:', error);
      throw error;
    }
  };

  const deleteSong = async (id: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/songs/${id}/`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to delete song');
      }
      await mutate();
    } catch (error) {
      console.error('Delete song error:', error);
      throw error;
    }
  };

  const updateSong = async (id: number, songData: {
    title?: string;
    artist?: string;
    album?: string;
    year?: number;
    duration?: number;
    spotify_url?: string;
    cover_art_url?: string;
    genre?: string;
  }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/songs/${id}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(songData),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update song');
      }
      await mutate();
      return data;
    } catch (error) {
      console.error('Update song error:', error);
      throw error;
    }
  };

  return {
    songs: data?.data || [],
    isLoading,
    isError: error,
    mutate,
    createSong,
    deleteSong,
    updateSong
  };
}

export function useSong(id: string) {
  const { data, error, isLoading, mutate } = useSWR(
    id ? `${API_BASE_URL}/songs/${id}/` : null,
    fetcher
  );

  return {
    song: data?.data,
    isLoading,
    isError: error,
    mutate
  };
} 