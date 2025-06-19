'use client';

import { useIpodContext } from '../contexts/IpodContext';
import { useSongs } from './useSongs';
import { useModalState } from './useModalState';
import { Song } from '../types/song';

export function useSongActions() {
  const { selectedSongID, selectedSong, setSelectedSongID } = useIpodContext();
  const { songs, deleteSong } = useSongs();
  
  const deleteModal = useModalState();
  const editModal = useModalState();

  const handleDelete = () => deleteModal.open();
  const handleEdit = () => editModal.open();

  const handleDeleteConfirm = async () => {
    if (selectedSongID) {
      const currentIndex = songs.findIndex((song: Song) => song.id === selectedSongID);
      
      // if song not found, just delete and clear selection
      if (currentIndex === -1) {
        await deleteSong(selectedSongID);
        setSelectedSongID(null);
        deleteModal.close();
        return;
      }
      
      // calc next song ID before deleting current song
      let nextSongID: number | null = null;
      if (songs.length > 1) {
        if (currentIndex >= songs.length - 1) {
          // if at end, go to prev song
          nextSongID = songs[currentIndex - 1].id;
        } else {
          // otherwise, go to next song
          nextSongID = songs[currentIndex + 1].id;
        }
      }
      
      await deleteSong(selectedSongID);
      
      // set next song as selected
      setSelectedSongID(nextSongID);
      
      deleteModal.close();
    }
  };

  const handleDeleteCancel = () => deleteModal.close();
  const handleEditClose = () => editModal.close();

  return {
    selectedSongID,
    selectedSong,
    deleteModal: {
      isOpen: deleteModal.isOpen,
      open: handleDelete,
      close: deleteModal.close,
    },
    editModal: {
      isOpen: editModal.isOpen,
      open: handleEdit,
      close: handleEditClose,
    },
    handleDeleteConfirm,
    handleDeleteCancel,
  };
} 