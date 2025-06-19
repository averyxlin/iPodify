import React, { FormEvent } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '../ui/select';
import { useSongs, useFormState, useFormValidation } from '../../hooks';

const GENRES = [
  'Rock',
  'Pop',
  'Disco',
  'New Wave',
  'Hip Hop',
  'Electronic',
  'Jazz',
  'Classical',
  'Country',
  'R&B',
];

export function AddSongModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { createSong } = useSongs();
  const { validateSongForm } = useFormValidation();
  const {
    form,
    errors,
    loading,
    success,
    handleChange,
    handleGenreChange,
    resetForm,
    setFormError,
    setFormSuccess,
    setLoadingState,
    setErrors,
  } = useFormState();

  if (!open) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    const validation = validateSongForm(form);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setLoadingState(true);
    setErrors({});
    setFormSuccess();
    
    try {
      await createSong({
        ...form,
        year: parseInt(form.year, 10),
        duration: parseInt(form.duration, 10),
      });
      
      setTimeout(() => {
        resetForm();
        onClose();
      }, 1000);
    } catch (err) {
      setFormError('form', err instanceof Error ? err.message : 'Network error');
    } finally {
      setLoadingState(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-8 relative">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold m-0 leading-none">Add Song</h2>
          <button
            className="text-gray-400 hover:text-gray-600 text-2xl w-10 h-10 flex items-center justify-center rounded-full focus:outline-none"
            onClick={onClose}
            aria-label="Close"
            type="button"
          >
            ×
          </button>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <Input
              className="h-11"
              name="title"
              placeholder="Title"
              value={form.title}
              onChange={handleChange}
              disabled={loading}
            />
            {errors.title && <div className="text-red-500 text-xs mt-1">{errors.title}</div>}
          </div>
          <div>
            <Input
              className="h-11"
              name="artist"
              placeholder="Artist"
              value={form.artist}
              onChange={handleChange}
              disabled={loading}
            />
            {errors.artist && <div className="text-red-500 text-xs mt-1">{errors.artist}</div>}
          </div>
          <div>
            <Input
              className="h-11"
              name="album"
              placeholder="Album"
              value={form.album}
              onChange={handleChange}
              disabled={loading}
            />
            {errors.album && <div className="text-red-500 text-xs mt-1">{errors.album}</div>}
          </div>
          <div>
            <Input
              className="h-11"
              name="year"
              placeholder="Year (e.g. 2022)"
              value={form.year}
              onChange={handleChange}
              disabled={loading}
              type="number"
            />
            {errors.year && <div className="text-red-500 text-xs mt-1">{errors.year}</div>}
          </div>
          <div>
            <Input
              className="h-11"
              name="duration"
              placeholder="Duration (seconds)"
              value={form.duration}
              onChange={handleChange}
              disabled={loading}
              type="number"
            />
            {errors.duration && <div className="text-red-500 text-xs mt-1">{errors.duration}</div>}
          </div>
          <div>
            <Input
              className="h-11"
              name="spotify_url"
              placeholder="Spotify URL"
              value={form.spotify_url}
              onChange={handleChange}
              disabled={loading}
            />
            {errors.spotify_url && <div className="text-red-500 text-xs mt-1">{errors.spotify_url}</div>}
          </div>
          <div>
            <Input
              className="h-11"
              name="cover_art_url"
              placeholder="Cover Art URL"
              value={form.cover_art_url}
              onChange={handleChange}
              disabled={loading}
            />
            {errors.cover_art_url && <div className="text-red-500 text-xs mt-1">{errors.cover_art_url}</div>}
          </div>
          <div>
            <Select value={form.genre} onValueChange={handleGenreChange}>
              <SelectTrigger className="w-full border rounded px-3 py-2 !h-11">
                <SelectValue placeholder="Select genre" />
              </SelectTrigger>
              <SelectContent>
                {GENRES.map((g) => (
                  <SelectItem key={g} value={g}>
                    {g}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.genre && <div className="text-red-500 text-xs mt-1">{errors.genre}</div>}
          </div>
          {errors.form && <div className="text-red-500 text-sm">{errors.form}</div>}
          {success && <div className="text-green-500 text-sm">Song added successfully!</div>}
          <div className="flex gap-2 pt-4">
            <Button
              type="submit"
              className="flex-1 bg-blue-950 text-white border border-blue-900 hover:bg-blue-900"
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add Song'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
} 