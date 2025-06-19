# Stereogrid

A music database and API built with Django and React.

## Project Requirements Compliance

This project meets the full-stack coding task requirements with the following interpretation:

### Item Management System
- **Items** = Songs (with title, artist, album, year, duration, etc.)
- **Groups** = Artist (Primary group) and Album (Secondary group)
- **Unique Constraints**: No duplicate song titles within the same artist (Primary group) or same album (Secondary group)

### API Endpoints
- `GET /api/songs/` - List all items (songs)
- `POST /api/songs/` - Create new item (song)
- `PUT /api/songs/{id}/` - Update existing item (song)
- `GET /api/songs/{id}/` - Get specific item (song)

### Business Rules Implementation
The unique constraint logic ensures:
- A song titled "Rock" can exist in Artist A (Primary) AND Album B (Secondary)
- "Rock" cannot exist twice in the same artist (Primary group violation)
- "Rock" cannot exist twice in the same album (Secondary group violation)

This implementation satisfies the requirement: "Each group should contain only unique item names. For example, an item named 'Rock' can appear in both the Primary and Secondary groups, but there can't be two items named 'Rock' in the same group."

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
pip install Django djangorestframework django-cors-headers django-filter python-dotenv psycopg2-binary django-redis django-ratelimit

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

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install @fortawesome/fontawesome-svg-core @fortawesome/free-solid-svg-icons @fortawesome/react-fontawesome @radix-ui/react-alert-dialog @radix-ui/react-dialog @radix-ui/react-label @radix-ui/react-select @radix-ui/react-separator @radix-ui/react-slot class-variance-authority clsx lucide-react next react react-dom react-icons swr tailwind-merge @eslint/eslintrc @tailwindcss/postcss @types/node @types/react @types/react-dom eslint eslint-config-next tailwindcss tw-animate-css typescript

# Start development server
npm run dev
```

## Development

- Backend API runs on http://localhost:8000
- Frontend development server runs on http://localhost:3000
- Redis runs on localhost:6379
- PostgreSQL database is hosted on Neon

## Features

- RESTful API with Django REST Framework
- Redis caching for improved performance
- Rate limiting for API endpoints
- Neon: PostgreSQL database
- React frontend
- Authentication and authorization
- Filtering and search capabilities