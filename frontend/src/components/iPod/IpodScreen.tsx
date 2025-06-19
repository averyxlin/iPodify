import React, { useState, useEffect } from 'react';
import { useIpodContext } from '../../contexts/IpodContext';
import { useSongs } from '../../hooks/useSongs';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Song } from '../../types/song';
import { DeleteSongDialog } from '../ui/DeleteSongDialog';
import { EditSongModal } from '../ui/EditSongModal';
import { Spotify } from 'react-spotify-embed';

export function IpodScreen() {
  const { sidebarOpen, selectedSong, selectedSongID, highlightedSongID, isPlaying, setIsPlaying } = useIpodContext();
  const { songs, deleteSong } = useSongs();
  const hasSelectedSong = selectedSongID !== null;
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showSpotifyEmbed, setShowSpotifyEmbed] = useState(false);
  const [spotifyError, setSpotifyError] = useState(false);

  const songsPerPage = 5;
  const totalPages = Math.ceil(songs.length / songsPerPage);
  const startIndex = (currentPage - 1) * songsPerPage;
  const endIndex = startIndex + songsPerPage;
  const paginatedSongs = songs.slice(startIndex, endIndex);

  const handleDeleteConfirm = async () => {
    if (selectedSongID) {
      await deleteSong(selectedSongID);
      setShowDeleteDialog(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteDialog(false);
  };

  const handleEditClose = () => {
    setShowEditModal(false);
  };

  const handleSpotifyError = () => {
    setSpotifyError(true);
    setShowSpotifyEmbed(false);
    setIsPlaying(false);
  };

  const handleBackFromSpotify = () => {
    setShowSpotifyEmbed(false);
    setSpotifyError(false);
    setIsPlaying(false);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [songs.length]);

  useEffect(() => {
    if (highlightedSongID && songs.length > 0) {
      const songIndex = songs.findIndex((song: Song) => song.id === highlightedSongID);
      if (songIndex !== -1) {
        const pageForSong = Math.floor(songIndex / songsPerPage) + 1;
        if (pageForSong !== currentPage) {
          setCurrentPage(pageForSong);
        }
      }
    }
  }, [highlightedSongID, songs, currentPage, songsPerPage]);

  useEffect(() => {
    setShowSpotifyEmbed(false);
    setSpotifyError(false);
  }, [selectedSongID]);

  useEffect(() => {
    if (isPlaying && selectedSong?.spotify_url && !showSpotifyEmbed) {
      setShowSpotifyEmbed(true);
      setSpotifyError(false);
    } else if (!isPlaying && showSpotifyEmbed) {
      setShowSpotifyEmbed(false);
      setSpotifyError(false);
    }
  }, [isPlaying, selectedSong, showSpotifyEmbed]);

  return (
    <Card className="w-[90%] h-[55%] rounded-3xl mt-8 flex overflow-hidden relative">
      <Card className={`absolute top-0 left-0 h-full w-2/3 max-w-[320px] z-20 border-r-2 border-border transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} pointer-events-auto flex flex-col`}>
        <CardContent className="flex-1 overflow-y-auto p-0">
          <ul>
            {paginatedSongs.map((song: Song) => (
              <li
                key={song.id}
                className={`px-6 py-3 cursor-pointer ${song.id === highlightedSongID ? 'bg-muted' : ''}`}
              >
                <div className="font-medium truncate">{song.title}</div>
                <div className="text-sm text-muted-foreground truncate">{song.artist}</div>
              </li>
            ))}
          </ul>
        </CardContent>
        <div className="absolute bottom-0 left-0 w-full flex justify-center py-2 bg-white/80 backdrop-blur rounded-b-3xl">
          <span className="text-xs text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
        </div>
      </Card>
      
      {showSpotifyEmbed && selectedSong?.spotify_url ? (
        <div className="flex flex-1 items-center justify-center w-full h-full p-0">
          <div className="aspect-square w-full max-w-[90%] max-h-[90%]">
            <Spotify 
              link={selectedSong.spotify_url} 
              onError={handleSpotifyError}
              width="100%"
              height="100%"
              style={{ borderRadius: 0 }}
            />
          </div>
        </div>
      ) : spotifyError ? (
        <div className="flex flex-1 items-center justify-center w-full p-6">
          <Card className="w-full max-w-[400px] mx-auto rounded-2xl p-6 text-center">
            <div className="text-red-500 mb-4">
              <svg className="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Spotify URL Not Found</h3>
            <div className="text-center">
              <p className="text-lg mb-4">This song doesn&apos;t have a Spotify link available.</p>
              <Button onClick={handleBackFromSpotify} variant="outline">
                Go Back
              </Button>
            </div>
          </Card>
        </div>
      ) : hasSelectedSong && selectedSong?.cover_art_url ? (
        <div className="flex flex-1 flex-col items-center justify-center w-full p-0">
          <Card className="w-full max-w-[340px] mx-auto rounded-2xl p-6 pt-8 relative flex flex-col items-center">
            <CardContent className="flex flex-col items-center w-full max-w-[240px] mx-auto p-0">
              <img
                src={selectedSong.cover_art_url}
                alt={`${selectedSong.title} cover art`}
                className="w-40 h-40 object-cover rounded-xl mb-4 mx-auto"
              />
              <div className="w-full text-center">
                <div className="text-xl font-bold break-words mb-2">{selectedSong?.title}</div>
                <div className="text-base text-muted-foreground break-words mb-2">{selectedSong?.artist}</div>
                <div className="text-sm text-muted-foreground mb-1">{selectedSong?.album}</div>
                <div className="text-xs text-muted-foreground">{selectedSong?.year}</div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-center w-full p-6">
          <span className="text-muted-foreground text-lg">Select a song from the menu</span>
        </div>
      )}
      
      <DeleteSongDialog open={showDeleteDialog} onConfirm={handleDeleteConfirm} onCancel={handleDeleteCancel} />
      <EditSongModal open={showEditModal} onClose={handleEditClose} song={selectedSong} />
    </Card>
  );
} 