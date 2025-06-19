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

  if (!open) return null;

  const validate = () => {
    const errs: { [k: string]: string } = {};
    if (!form.title) errs.title = 'Title is required';
    if (!form.artist) errs.artist = 'Artist is required';
    if (!form.album) errs.album = 'Album is required';
    const year = parseInt(form.year, 10);
    const now = new Date().getFullYear();
    if (!form.year) errs.year = 'Year is required';
    else if (isNaN(year) || year < 1970 || year > now) errs.year = 'Year must be between 1970 and ' + now;
    const duration = parseInt(form.duration, 10);
    if (!form.duration) errs.duration = 'Duration is required';
    else if (isNaN(duration) || duration <= 0 || duration > 3600) errs.duration = 'Duration must be 1-3600 seconds';
    if (!form.spotify_url) errs.spotify_url = 'Spotify URL is required';
    else if (!form.spotify_url.startsWith('https://open.spotify.com/track/')) errs.spotify_url = 'Must be a valid Spotify track URL';
    if (!form.cover_art_url) errs.cover_art_url = 'Cover art URL is required';
    else if (!/\.(jpg|jpeg|png|gif)$/i.test(form.cover_art_url)) errs.cover_art_url = 'Must be a valid image URL';
    if (!form.genre) errs.genre = 'Genre is required';
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
      await createSong({
        ...form,
        year: parseInt(form.year, 10),
        duration: parseInt(form.duration, 10),
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
                  <SelectItem key={g} value={g}>{g}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.genre && <div className="text-red-500 text-xs mt-1">{errors.genre}</div>}
          </div>
          {errors.form && <div className="text-red-500 text-xs mt-2">{errors.form}</div>}
          {success && <div className="text-green-600 text-xs mt-2">Song added!</div>}
          <div className="flex justify-end gap-2 mt-4">
            <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>Cancel</Button>
            <Button type="submit" disabled={loading}>{loading ? 'Adding...' : 'Add Song'}</Button>
          </div>
        </form>
      </div>
    </div>
  );
} 