'use client';

import { useState } from 'react';
import { useIpodContext } from '../contexts/IpodContext';
import { useSongs } from './useSongs';
import { useModalState } from './useModalState';

export function useSongActions() {
  const { selectedSongID, selectedSong } = useIpodContext();
  const { deleteSong } = useSongs();
  
  const deleteModal = useModalState();
  const editModal = useModalState();

  const handleDelete = () => deleteModal.open();
  const handleEdit = () => editModal.open();

  const handleDeleteConfirm = async () => {
    if (selectedSongID) {
      await deleteSong(selectedSongID);
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