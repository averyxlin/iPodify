'use client';

import { useState, useCallback, ChangeEvent } from 'react';

export interface SongFormData {
  title: string;
  artist: string;
  album: string;
  year: string;
  duration: string;
  spotify_url: string;
  cover_art_url: string;
  genre: string;
}

export interface FormErrors {
  [key: string]: string;
}

export function useFormState(initialData?: Partial<SongFormData>) {
  const [form, setForm] = useState<SongFormData>({
    title: '',
    artist: '',
    album: '',
    year: '',
    duration: '',
    spotify_url: '',
    cover_art_url: '',
    genre: '',
    ...initialData,
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) {
      setErrors(prev => ({ ...prev, [e.target.name]: '' }));
    }
  }, [errors]);

  const handleGenreChange = useCallback((value: string) => {
    setForm(prev => ({ ...prev, genre: value }));
    if (errors.genre) {
      setErrors(prev => ({ ...prev, genre: '' }));
    }
  }, [errors.genre]);

  const resetForm = useCallback(() => {
    setForm({
      title: '',
      artist: '',
      album: '',
      year: '',
      duration: '',
      spotify_url: '',
      cover_art_url: '',
      genre: '',
    });
    setErrors({});
    setSuccess(false);
  }, []);

  const setFormError = useCallback((field: string, message: string) => {
    setErrors(prev => ({ ...prev, [field]: message }));
  }, []);

  const setFormSuccess = useCallback(() => {
    setSuccess(true);
  }, []);

  const setLoadingState = useCallback((isLoading: boolean) => {
    setLoading(isLoading);
  }, []);

  return {
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
  };
} 