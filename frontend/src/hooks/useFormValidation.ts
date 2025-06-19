'use client';

import { useCallback } from 'react';
import { SongFormData, FormErrors } from './useFormState';
import { Song } from '../types/song';

export function useFormValidation() {
  const validateSongForm = useCallback((
    form: SongFormData, 
    existingSong?: Song | null
  ): { isValid: boolean; errors: FormErrors } => {
    const errors: FormErrors = {};
    
    const getValue = (field: keyof SongFormData) => {
      return form[field] || (existingSong?.[field] as string) || '';
    };

    if (!getValue('title')) {
      errors.title = 'Title is required';
    }

    if (!getValue('artist')) {
      errors.artist = 'Artist is required';
    }

    if (!getValue('album')) {
      errors.album = 'Album is required';
    }

    const yearValue = getValue('year');
    if (!yearValue) {
      errors.year = 'Year is required';
    } else {
      const year = parseInt(yearValue, 10);
      const now = new Date().getFullYear();
      if (isNaN(year) || year < 1970 || year > now) {
        errors.year = `Year must be between 1970 and ${now}`;
      }
    }

    const durationValue = getValue('duration');
    if (!durationValue) {
      errors.duration = 'Duration is required';
    } else {
      const duration = parseInt(durationValue, 10);
      if (isNaN(duration) || duration <= 0 || duration > 3600) {
        errors.duration = 'Duration must be 1-3600 seconds';
      }
    }

    const spotifyUrl = getValue('spotify_url');
    if (!spotifyUrl) {
      errors.spotify_url = 'Spotify URL is required';
    } else if (!spotifyUrl.startsWith('https://open.spotify.com/track/')) {
      errors.spotify_url = 'Must be a valid Spotify track URL';
    }

    const coverArtUrl = getValue('cover_art_url');
    if (!coverArtUrl) {
      errors.cover_art_url = 'Cover art URL is required';
    } else if (!/\.(jpg|jpeg|png|gif)$/i.test(coverArtUrl)) {
      errors.cover_art_url = 'Must be a valid image URL';
    }

    if (!getValue('genre')) {
      errors.genre = 'Genre is required';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }, []);

  const validateField = useCallback((
    field: keyof SongFormData, 
    value: string, 
    existingValue?: string
  ): string => {
    const effectiveValue = value || existingValue || '';

    switch (field) {
      case 'title':
      case 'artist':
      case 'album':
      case 'genre':
        return effectiveValue ? '' : `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
      
      case 'year':
        if (!effectiveValue) return 'Year is required';
        const year = parseInt(effectiveValue, 10);
        const now = new Date().getFullYear();
        if (isNaN(year) || year < 1970 || year > now) {
          return `Year must be between 1970 and ${now}`;
        }
        return '';
      
      case 'duration':
        if (!effectiveValue) return 'Duration is required';
        const duration = parseInt(effectiveValue, 10);
        if (isNaN(duration) || duration <= 0 || duration > 3600) {
          return 'Duration must be 1-3600 seconds';
        }
        return '';
      
      case 'spotify_url':
        if (!effectiveValue) return 'Spotify URL is required';
        if (!effectiveValue.startsWith('https://open.spotify.com/track/')) {
          return 'Must be a valid Spotify track URL';
        }
        return '';
      
      case 'cover_art_url':
        if (!effectiveValue) return 'Cover art URL is required';
        if (!/\.(jpg|jpeg|png|gif)$/i.test(effectiveValue)) {
          return 'Must be a valid image URL';
        }
        return '';
      
      default:
        return '';
    }
  }, []);

  return {
    validateSongForm,
    validateField,
  };
} 