import React from 'react';
import { Button } from '../ui/button';

export function DeleteSongDialog({ open, onConfirm, onCancel }: { open: boolean; onConfirm: () => void; onCancel: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-sm p-8 relative">
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-2">Delete Song</h2>
          <p className="text-gray-700">Delete this song from your iPod?</p>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
          <Button type="button" variant="destructive" onClick={onConfirm}>Yes</Button>
        </div>
      </div>
    </div>
  );
} 