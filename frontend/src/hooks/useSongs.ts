import useSWR from 'swr';

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

// hook that fetches all songs
export function useSongs() {
  const { data, error, isLoading, mutate } = useSWR(
    `${API_BASE_URL}/songs/`,
    fetcher
  );

  return {
    songs: data?.data || [],
    isLoading,
    isError: error,
    mutate
  };
}

// hook that fetches a single song by ID
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