# Stereogrid Frontend

A Next.js frontend application for managing and displaying songs with a dashboard feature.

## Features

### Dashboard
- **Song Cards**: Display songs in a responsive grid layout with cover art, title, artist, album, duration, year, and genre
- **Add/Remove Songs**: Click the + button in the table to add songs to your dashboard, or click the X on cards to remove them
- **Visual Feedback**: Cards show cover art with fallback placeholders when images fail to load
- **Responsive Design**: Grid adapts from 1 column on mobile to 5 columns on large screens

### iPod Interface
- **Play/Pause Button**: Use the play/pause button on the iPod wheel to toggle between song details and Spotify playback
  - Press play to show the Spotify embed player
  - Press pause to return to the song details view
- **Spotify Integration**: Songs with Spotify URLs can be played directly in the app
  - **Note**: Full song playback requires being signed into Spotify
  - Without Spotify authentication, only 30-second previews will be available
  - Sign in to your Spotify account to enable full song playback

### Songs Table
- **Sortable Columns**: Click column headers to sort by title, artist, album, or year
- **Add/Remove Buttons**: Each row has a + button that transforms to a - button when the song is in the dashboard
- **Pagination**: Table shows 10 songs per page with navigation controls
- **Responsive**: Switches to card layout on mobile devices

### Error Handling
- **Skeleton Loading**: Shows loading placeholders while data is being fetched
- **Error States**: Graceful error handling with user-friendly messages when the backend is unavailable
- **Fallback Images**: Cover art shows placeholder when images fail to load

## Technical Implementation

### State Management
- **Dashboard Context**: React Context for managing dashboard songs state
- **Pagination State**: Local state for current page and items per page
- **Sorting State**: Local state for sort key and direction

### Components
- `Dashboard`: Main dashboard component with song grid
- `SongCard`: Individual song card with remove functionality
- `SongsTable`: Sortable table with add/remove buttons and pagination
- `Pagination`: Reusable pagination component
- `DashboardContext`: Context provider for dashboard state

### API Integration
- **SWR**: Data fetching with caching and revalidation
- **Error Boundaries**: Graceful handling of API failures
- **Loading States**: Skeleton components during data fetching

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your backend API URL (default: http://localhost:8000/api)
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Backend Requirements

The frontend expects a Django REST API backend. Configure the backend URL in your `.env` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

**Note:** Customize the port in the API URL if your backend is running on a different port than 8000.

The backend should provide the following endpoints:

- `GET /api/songs/` - List all songs
- `GET /api/songs/{id}/` - Get individual song

Song objects should include:
- `id`: Unique identifier
- `title`: Song title
- `artist`: Artist name
- `album`: Album name
- `year`: Release year
- `duration`: Duration in seconds
- `cover_art_url`: Optional cover art URL
- `spotify_url`: Optional Spotify URL
- `genre`: Optional genre
- `decade`: Optional decade

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
