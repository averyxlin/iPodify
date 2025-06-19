# iPodify

A modern music database and API built with Django and React, featuring an iPod-inspired interface with Spotify integration.

## Project Requirements Compliance

This project meets the full-stack coding task requirements with the following implementation:

### Item Management System
- **Items** = Songs (with title, artist, album, year, duration, etc.)
- **Groups** = Artist (Primary group) and Album (Secondary group)
- **Unique Constraints**: No duplicate song titles within the same artist (Primary group) AND no duplicate song titles within the same album (Secondary group)

### API Endpoints
- `GET /api/songs/` - List all items (songs) with pagination and filtering
- `POST /api/songs/` - Create new item (song)
- `PUT /api/songs/{id}/` - Update existing item (song) - full update
- `PATCH /api/songs/{id}/` - Update existing item (song) - partial update
- `GET /api/songs/{id}/` - Get specific item (song)
- `DELETE /api/songs/{id}/` - Delete item (song)

### Business Rules Implementation
The unique constraint logic ensures:
- A song titled "Rock" can exist in Artist A (Primary) AND Artist B (Primary)
- A song titled "Rock" can exist in Album X (Secondary) AND Album Y (Secondary)
- "Rock" cannot exist twice in the same artist (Primary group violation)
- "Rock" cannot exist twice in the same album (Secondary group violation)
- The same title can appear across different artists and albums

**How This Satisfies the Requirements:**

The task requires: *"Each group should contain only unique item names. For example, an item named 'Rock' can appear in both the Primary and Secondary groups, but there can't be two items named 'Rock' in the same group."*

**Our Implementation:**
- **Primary Group (Artist)**: `unique_together = [('title', 'artist')]` ensures no duplicate song titles within the same artist
- **Secondary Group (Album)**: `unique_together = [('title', 'album')]` ensures no duplicate song titles within the same album
- **Combined Constraints**: `unique_together = [('title', 'artist'), ('title', 'album')]` enforces both constraints simultaneously

**Why This Works:**
1. **Artist as Primary Group**: Each artist is a unique "group" - you can't have two songs with the same title by the same artist
2. **Album as Secondary Group**: Each album is a unique "group" - you can't have two songs with the same title in the same album
3. **Cross-Group Duplicates Allowed**: The same song title can exist across different artists (different primary groups) and different albums (different secondary groups)

**Example Scenarios:**
✅ **Allowed:**
- "Bohemian Rhapsody" by Queen (Artist: Queen, Album: A Night at the Opera)
- "Bohemian Rhapsody" by Panic! at the Disco (Artist: Panic! at the Disco, Album: Bohemian Rhapsody - Single)
- "Rock" by Artist A (Artist: Artist A, Album: Album X)
- "Rock" by Artist B (Artist: Artist B, Album: Album Y)

❌ **Blocked by Constraint:**
- Two songs titled "Rock" by the same Artist A (Primary group violation)
- Two songs titled "Rock" in the same Album X, even by different artists (Secondary group violation)

This implementation satisfies the requirement: "Each group should contain only unique item names. For example, an item named 'Rock' can appear in both the Primary and Secondary groups, but there can't be two items named 'Rock' in the same group."

## Technical Stack

### Backend (Django)
- **Django 5.2.3**: Modern Python web framework
- **Django REST Framework**: Powerful API development
- **PostgreSQL**: Robust relational database
- **Redis**: High-performance caching layer
- **Django CORS Headers**: Cross-origin resource sharing
- **Django Filter**: Advanced filtering capabilities
- **Django Rate Limit**: API rate limiting protection

### Frontend (React/Next.js)
- **Next.js 15.3.3**: React framework with SSR capabilities
- **TypeScript**: Type-safe JavaScript development
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Modern component library
- **SWR**: Data fetching and caching
- **React Spotify Embed**: Spotify integration
- **FontAwesome**: Icon library

### Development Tools
- **ESLint**: Code quality and consistency
- **PostCSS**: CSS processing
- **Autoprefixer**: CSS vendor prefixing

## Prerequisites

- Python 3.x
- pip (Python package manager)
- Redis
- PostgreSQL

## Setup

### 1. Install Dependencies

#### macOS
```bash
# Install Python (if not already installed)
brew install python

# Install Redis
brew install redis

# Install PostgreSQL (if not already installed)
brew install postgresql
```

#### Ubuntu/Debian
```bash
# Install Python (if not already installed)
sudo apt-get update
sudo apt-get install python3 python3-pip

# Install Redis
sudo apt-get install redis-server

# Install PostgreSQL (if not already installed)
sudo apt-get install postgresql postgresql-contrib
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate

# Install Python dependencies
source venv/bin/activate && pip3 install -r requirements.txt

# Start Redis server
# For macOS:
brew services start redis
# For Ubuntu/Debian:
sudo systemctl start redis

# Set up environment variables
cp .env.example .env  # Create .env file from example
# Edit .env with your configuration

# Run migrations
python manage.py migrate

# Create superuser (optional)
python manage.py createsuperuser

# Start development server
python manage.py runserver
```

**⚠️ Important: The backend server must be running before starting the frontend!**

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install all dependencies from package.json
npm install

# Set up environment variables
cp .env.example .env  # Create .env file from example
# Edit .env with your backend API URL and port

# Start development server
npm run dev
```

## Environment Configuration

### Backend (.env)
Create a `.env` file in the `backend/` directory with your database and Redis configuration:

```env
DJANGO_SECRET_KEY=your-secret-key-here
DJANGO_DEBUG=True
PGDATABASE=your-database-name
PGUSER=your-database-user
PGPASSWORD=your-database-password
PGHOST=localhost
PGPORT=5432
REDIS_URL=redis://127.0.0.1:6379/1
```

### Frontend (.env)
Create a `.env` file in the `frontend/` directory with your backend API URL:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

**Note:** Customize the port in the API URL if your backend is running on a different port than 8000.

## Running the Application

1. **Start the backend server first:**
   ```bash
   cd backend
   source venv/bin/activate
   python manage.py runserver
   ```
   The API will be available at `http://localhost:8000/api/`

2. **Start the frontend server:**
   ```bash
   cd frontend
   npm run dev
   ```
   The frontend will be available at `http://localhost:3000`

**Remember:** Both servers must be running simultaneously for the application to work properly.

## 🎯 Usage Guide

### Adding Songs
1. Click the "Add Song" button in the top bar
2. Fill in the song details (title, artist, album, year, duration, Spotify URL, cover art URL, genre)
3. Click "Add Song" to save

### Managing Songs
- **View Songs**: Browse through the paginated song list in the sidebar
- **Select Songs**: Click on a song to view its details and cover art
- **Edit Songs**: Select a song and click "Edit" to modify its details
- **Delete Songs**: Select a song and click "Delete" to remove it

### Spotify Integration
- **Play Music**: Click on a song with a Spotify URL to play it directly
- **URL Format**: Use Spotify track URLs in the format `https://open.spotify.com/track/...`
- **Fallback**: If Spotify URL is unavailable, the app displays cover art and song details

### Navigation
- **Sidebar**: Toggle the sidebar to show/hide the song list
- **Pagination**: Navigate through pages of songs
- **Search**: Use the filtering capabilities to find specific songs

## 🔧 API Documentation

### Endpoints
- `GET /api/songs/` - List all songs with pagination and filtering
- `POST /api/songs/` - Create a new song
- `GET /api/songs/{id}/` - Get a specific song by ID
- `PUT /api/songs/{id}/` - Update a song (full update)
- `PATCH /api/songs/{id}/` - Update a song (partial update)
- `DELETE /api/songs/{id}/` - Delete a song

### Query Parameters
- `?title=song_title` - Search by title (case-insensitive)
- `?artist=queen` - Search by artist (case-insensitive)
- `?genre=Rock` - Filter by exact genre
- `?decade=80s` - Filter by exact decade
- `?year=1985` - Filter by exact year
- `?year_min=1980&year_max=1989` - Filter by year range
- `?page=2` - Navigate to specific page
- `?page_size=20` - Set items per page (max 100)

### Response Format
All API responses follow a consistent format:
```json
{
  "status": "success|error",
  "code": 200,
  "data": [...],
  "message": "Optional message",
  "timestamp": "2024-01-01T00:00:00Z"
}
```