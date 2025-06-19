'use client';

import React from 'react';
import { Button } from '../ui/button';
import { AddSongModal } from '../modals/AddSongModal';
import { DeleteSongDialog } from '../modals/DeleteSongDialog';
import { EditSongModal } from '../modals/EditSongModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash, faPen } from '@fortawesome/free-solid-svg-icons';
import { useModalState, useSongActions } from '../../hooks';

export function TopBar() {
  const addSongModal = useModalState();
  const songActions = useSongActions();

  return (
    <>
      <div className="w-full flex justify-end items-center h-16 px-6 gap-2">
        <Button onClick={addSongModal.open} size="lg" className="bg-blue-950 text-white border border-blue-900 hover:bg-blue-900">
          <FontAwesomeIcon icon={faPlus} className="mr-2" /> Add Song
        </Button>
        {songActions.selectedSongID && (
          <>
            <Button 
              variant="destructive" 
              size="lg" 
              onClick={songActions.deleteModal.open}
            >
              <FontAwesomeIcon icon={faTrash} className="mr-2" /> Delete
            </Button>
            <Button 
              variant="secondary" 
              size="lg" 
              onClick={songActions.editModal.open}
            >
              <FontAwesomeIcon icon={faPen} className="mr-2" /> Edit
            </Button>
          </>
        )}
      </div>

      <AddSongModal 
        open={addSongModal.isOpen} 
        onClose={addSongModal.close} 
      />
      <DeleteSongDialog 
        open={songActions.deleteModal.isOpen} 
        onConfirm={songActions.handleDeleteConfirm} 
        onCancel={songActions.handleDeleteCancel} 
      />
      <EditSongModal 
        open={songActions.editModal.isOpen} 
        onClose={songActions.editModal.close} 
        song={songActions.selectedSong} 
      />
    </>
  );
} 