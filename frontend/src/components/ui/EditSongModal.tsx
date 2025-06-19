'use client';

import React, { useState } from 'react';
import { Button } from './button';
import { Input } from './input';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from './select';
import { useSongs } from '../../hooks/useSongs';
import { Song } from '../../types/song';

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

export function EditSongModal({ open, onClose, song }: { open: boolean; onClose: () => void; song: Song | undefined | null }) {
  const { updateSong } = useSongs();
  const [form, setForm] = useState({
    title: '',
    artist: '',
    album: '',
    year: '',
    duration: '',
    spotify_url: '',
    cover_art_url: '',
    genre: '',
  });
  const [errors, setErrors] = useState<{ [k: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!open || !song || typeof song.id !== 'number') return null;

  const validate = () => {
    const errs: { [k: string]: string } = {};
    if (!form.title && !song.title) errs.title = 'Title is required';
    if (!form.artist && !song.artist) errs.artist = 'Artist is required';
    if (!form.album && !song.album) errs.album = 'Album is required';
    const year = parseInt(form.year || (typeof song.year === 'number' ? song.year.toString() : ''), 10);
    const now = new Date().getFullYear();
    if (!form.year && !song.year) errs.year = 'Year is required';
    else if (isNaN(year) || year < 1970 || year > now) errs.year = 'Year must be between 1970 and ' + now;
    const duration = parseInt(form.duration || (typeof song.duration === 'number' ? song.duration.toString() : ''), 10);
    if (!form.duration && !song.duration) errs.duration = 'Duration is required';
    else if (isNaN(duration) || duration <= 0 || duration > 3600) errs.duration = 'Duration must be 1-3600 seconds';
    if (!form.spotify_url && !song.spotify_url) errs.spotify_url = 'Spotify URL is required';
    else if ((form.spotify_url || song.spotify_url) && !(form.spotify_url || song.spotify_url || '').startsWith('https://open.spotify.com/track/')) errs.spotify_url = 'Must be a valid Spotify track URL';
    if (!form.cover_art_url && !song.cover_art_url) errs.cover_art_url = 'Cover art URL is required';
    else if ((form.cover_art_url || song.cover_art_url) && !/\.(jpg|jpeg|png|gif)$/i.test(form.cover_art_url || song.cover_art_url || '')) errs.cover_art_url = 'Must be a valid image URL';
    if (!form.genre && !song.genre) errs.genre = 'Genre is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleGenreChange = (value: string) => {
    setForm({ ...form, genre: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setErrors({});
    setSuccess(false);
    try {
      await updateSong(song.id, {
        title: form.title || song.title,
        artist: form.artist || song.artist,
        album: form.album || song.album,
        year: parseInt(form.year || (typeof song.year === 'number' ? song.year.toString() : ''), 10),
        duration: parseInt(form.duration || (typeof song.duration === 'number' ? song.duration.toString() : ''), 10),
        spotify_url: form.spotify_url || song.spotify_url,
        cover_art_url: form.cover_art_url || song.cover_art_url,
        genre: form.genre || song.genre,
      });
      setSuccess(true);
      setTimeout(() => {
        setForm({
          title: '', artist: '', album: '', year: '', duration: '', spotify_url: '', cover_art_url: '', genre: '',
        });
        setSuccess(false);
        onClose();
      }, 1000);
    } catch (err) {
      setErrors({ form: err instanceof Error ? err.message : 'Network error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-8 relative">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold m-0 leading-none">Edit Song</h2>
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
              placeholder={song.title || 'Title'}
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
              placeholder={song.artist || 'Artist'}
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
              placeholder={song.album || 'Album'}
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
              placeholder={typeof song.year === 'number' ? song.year.toString() : 'Year (e.g. 2022)'}
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
              placeholder={typeof song.duration === 'number' ? song.duration.toString() : 'Duration (seconds)'}
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
              placeholder={typeof song.spotify_url === 'string' ? song.spotify_url : 'Spotify URL'}
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
              placeholder={typeof song.cover_art_url === 'string' ? song.cover_art_url : 'Cover Art URL'}
              value={form.cover_art_url}
              onChange={handleChange}
              disabled={loading}
            />
            {errors.cover_art_url && <div className="text-red-500 text-xs mt-1">{errors.cover_art_url}</div>}
          </div>
          <div>
            <Select value={form.genre} onValueChange={handleGenreChange}>
              <SelectTrigger className="w-full border rounded px-3 py-2 !h-11">
                <SelectValue placeholder={typeof song.genre === 'string' ? song.genre : 'Select genre'} />
              </SelectTrigger>
              <SelectContent>
                {GENRES.map((g) => (
                  <SelectItem key={g} value={g}>{g}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.genre && <div className="text-red-500 text-xs mt-1">{errors.genre}</div>}
          </div>
          {errors.form && <div className="text-red-500 text-xs mt-2">{errors.form}</div>}
          {success && <div className="text-green-600 text-xs mt-2">Song updated!</div>}
          <div className="flex justify-end gap-2 mt-4">
            <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>Cancel</Button>
            <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</Button>
          </div>
        </form>
      </div>
    </div>
  );
} 