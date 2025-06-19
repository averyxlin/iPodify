import React from 'react';
import { useIpodContext } from '../../contexts/IpodContext';
import { useSongs } from '../../hooks/useSongs';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Song } from '../../types/song';
import { DeleteSongDialog } from '../ui/DeleteSongDialog';
import { EditSongModal } from '../ui/EditSongModal';
import { SidebarPagination } from '../ui/SidebarPagination';

export function IpodScreen() {
  const { sidebarOpen, selectedSong, selectedSongID, highlightedSongID } = useIpodContext();
  const { songs, deleteSong } = useSongs();
  const hasSelectedSong = selectedSongID !== null;
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [showEditModal, setShowEditModal] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);

  const songsPerPage = 5;
  const totalPages = Math.ceil(songs.length / songsPerPage);
  const startIndex = (currentPage - 1) * songsPerPage;
  const endIndex = startIndex + songsPerPage;
  const paginatedSongs = songs.slice(startIndex, endIndex);

  const handleDelete = () => setShowDeleteDialog(true);
  const handleEdit = () => setShowEditModal(true);

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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  React.useEffect(() => {
    setCurrentPage(1);
  }, [songs.length]);

  React.useEffect(() => {
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
      
      {hasSelectedSong && selectedSong?.cover_art_url ? (
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