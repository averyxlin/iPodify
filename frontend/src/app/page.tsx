'use client';

import { useSongs } from '../hooks/useSongs';
import { SongsListResponsiveSkeleton } from '../components/cards/SongsListResponsiveSkeleton';
import { SongsTable } from '../components/table/SongsTable';
import { SongsListResponsive } from '../components/cards/SongsListResponsive';
import { useState } from 'react';
import React from 'react';

export default function Home() {
  const { songs, isLoading, isError } = useSongs();
  const [sortKey, setSortKey] = useState('title');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  const sortedSongs = React.useMemo(() => {
    if (!songs) return [];
    return [...songs].sort((a, b) => {
      const aValue = a[sortKey];
      const bValue = b[sortKey];
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc'
          ? aValue - bValue
          : bValue - aValue;
      } else {
        // fallback for mixed/other types
        return 0;
      }
    });
  }, [songs, sortKey, sortDirection]);

  console.log('Songs data:', songs);
  console.log('Loading state:', isLoading);
  console.log('Error state:', isError);

  const handleSort = (key: string) => {
    if (key === sortKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const sortOptions = [
    { label: 'Song Title (A–Z)', key: 'title', direction: 'asc' },
    { label: 'Song Title (Z–A)', key: 'title', direction: 'desc' },
    { label: 'Artist (A–Z)', key: 'artist', direction: 'asc' },
    { label: 'Artist (Z–A)', key: 'artist', direction: 'desc' },
    { label: 'Album (A–Z)', key: 'album', direction: 'asc' },
    { label: 'Album (Z–A)', key: 'album', direction: 'desc' },
    { label: 'Year (Oldest–Newest)', key: 'year', direction: 'asc' },
    { label: 'Year (Newest–Oldest)', key: 'year', direction: 'desc' },
  ];

  const currentSortValue = `${sortKey}:${sortDirection}`;

  const handleSortChange = (value: string) => {
    const [key, direction] = value.split(':');
    setSortKey(key);
    setSortDirection(direction as 'asc' | 'desc');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen p-8">
        <h1 className="text-3xl font-bold mb-8">Songs</h1>
        <SongsListResponsiveSkeleton />
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
      <SongsListResponsive
        songs={sortedSongs}
        sortKey={sortKey}
        sortDirection={sortDirection}
        sortValue={currentSortValue}
        sortOptions={sortOptions.map(opt => ({ label: opt.label, value: `${opt.key}:${opt.direction}` }))}
        onSortChange={handleSortChange}
      />
    </div>
  );
}
