# Custom Hooks Documentation

This directory contains reusable custom hooks that extract common logic from components throughout the application.

## Core Hooks

### `useSongs`
Manages song data fetching, creation, updating, and deletion operations.

```typescript
const { songs, isLoading, createSong, deleteSong, updateSong } = useSongs();
```

### `useModalState`
Simple hook for managing modal open/close state.

```typescript
const { isOpen, open, close } = useModalState(initialState);
```

### `useSongActions`
Manages song-related actions like delete and edit modals.

```typescript
const { selectedSongID, selectedSong, deleteModal, editModal, handleDeleteConfirm } = useSongActions();
```

## Form Management Hooks

### `useFormState`
Manages form state, validation errors, loading states, and success states.

```typescript
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
} = useFormState(initialData);
```

### `useFormValidation`
Provides validation logic for song forms.

```typescript
const { validateSongForm, validateField } = useFormValidation();

const validation = validateSongForm(form, existingSong);
if (!validation.isValid) {
  setErrors(validation.errors);
}
```

## UI State Hooks

### `usePagination`
Manages pagination state and navigation.

```typescript
const {
  currentPage,
  totalPages,
  paginatedItems,
  goToPage,
  nextPage,
  prevPage,
  hasNextPage,
  hasPrevPage,
} = usePagination(items, { itemsPerPage: 5 });
```

### `useSpotifyPlayer`
Manages Spotify player state and error handling.

```typescript
const {
  showSpotifyEmbed,
  spotifyError,
  showSkeleton,
  canShowSpotify,
  handleSpotifyError,
  handleBackFromSpotify,
} = useSpotifyPlayer(selectedSong, isPlaying);
```

### `useSidebar`
Manages sidebar open/close state.

```typescript
const { isOpen, open, close, toggle } = useSidebar(initialState);
```

### `usePlayingState`
Manages playing state for media playback.

```typescript
const { isPlaying, setIsPlaying, play, pause, toggle } = usePlayingState();
```

### `useSongSelection`
Manages song selection and highlighting.

```typescript
const {
  selectedSongID,
  selectedSong,
  highlightedSongID,
  selectSong,
  highlightSong,
  selectHighlightedSong,
  clearSelection,
} = useSongSelection(songs);
```

### `useIpodState`
Comprehensive hook that combines all iPod-related state management.

```typescript
const {
  // Song selection
  selectedSongID,
  selectedSong,
  highlightedSongID,
  selectSong,
  highlightSong,
  selectHighlightedSong,
  clearSelection,
  
  // Sidebar
  sidebarOpen,
  setSidebarOpen,
  openSidebar,
  closeSidebar,
  
  // Playing state
  isPlaying,
  setIsPlaying,
  play,
  pause,
  togglePlay,
  
  // Top bar
  showTopBar,
  setShowTopBar,
} = useIpodState(songs);
```

## Utility Hooks

### `useApiError`
Manages API error states and provides error handling utilities.

```typescript
const {
  error,
  isLoading,
  handleError,
  clearError,
  setLoading,
  executeWithErrorHandling,
} = useApiError();

const result = await executeWithErrorHandling(
  () => apiCall(),
  'fieldName'
);
```

### `useLocalStorage`
Manages localStorage operations with type safety.

```typescript
const [value, setValue, removeValue] = useLocalStorage('key', initialValue);
```

## Legacy Hooks

### `useIpodControls`
Original iPod control logic (legacy - consider using `useIpodState` instead).

### `useIpodUI`
Original iPod UI state management (legacy - consider using `useIpodState` instead).

## Usage Examples

### Refactored AddSongModal
```typescript
export function AddSongModal({ open, onClose }) {
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

  const handleSubmit = async (e) => {
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

  // ... rest of component
}
```

### Refactored IpodScreen
```typescript
export function IpodScreen() {
  const { songs, deleteSong } = useSongs();
  
  // Use pagination hook
  const {
    currentPage,
    totalPages,
    paginatedItems: paginatedSongs,
    goToPage,
  } = usePagination<Song>(songs, { itemsPerPage: 5 });

  // Use Spotify player hook
  const {
    showSpotifyEmbed,
    spotifyError,
    showSkeleton,
    canShowSpotify,
    handleSpotifyError,
    handleBackFromSpotify,
  } = useSpotifyPlayer(selectedSong, isPlaying);

  // ... rest of component
}
```

## Benefits of This Refactoring

1. **Reusability**: Common logic is extracted into reusable hooks
2. **Testability**: Hooks can be tested independently
3. **Maintainability**: Changes to logic only need to be made in one place
4. **Type Safety**: All hooks are fully typed with TypeScript
5. **Separation of Concerns**: UI components focus on rendering, hooks handle logic
6. **Consistency**: Standardized patterns across the application

## Migration Guide

When refactoring existing components:

1. Identify repeated logic patterns
2. Extract them into appropriate hooks
3. Update components to use the new hooks
4. Remove duplicate state management code
5. Test the refactored components

This refactoring makes the codebase more maintainable and follows React best practices for custom hooks. 