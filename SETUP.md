# Stereogrid Setup Guide

This project consists of a Django backend API and a Next.js frontend. To fix the 404 error you're experiencing, you need to run both servers.

## Backend Setup (Django)

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Create and activate a virtual environment:**
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables:**
   Create a `.env` file in the backend directory with the following variables:
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

5. **Run database migrations:**
   ```bash
   python manage.py migrate
   ```

6. **Start the Django development server:**
   ```bash
   python manage.py runserver 8000
   ```

   The API will be available at `http://localhost:8000/api/songs/`

## Frontend Setup (Next.js)

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

   The frontend will be available at `http://localhost:3000`

## Database Setup

The Django backend requires PostgreSQL. You'll need to:

1. Install PostgreSQL
2. Create a database
3. Update the environment variables with your database credentials

## Redis Setup (Optional)

For caching functionality, install and start Redis:
```bash
# On macOS with Homebrew
brew install redis
brew services start redis

# On Ubuntu/Debian
sudo apt-get install redis-server
sudo systemctl start redis
```

## Testing the API

Once both servers are running, you can test the API:

- **Health check:** `http://localhost:8000/health/`
- **Songs API:** `http://localhost:8000/api/songs/`

The AddSongModal should now work correctly and be able to create new songs through the API. 