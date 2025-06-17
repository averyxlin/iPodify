# Stereogrid

A music database and API built with Django and React.

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
pip install -r requirements.txt

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
npm install

# Start development server
npm run dev
```

## Development

- Backend API runs on http://localhost:8000
- Frontend development server runs on http://localhost:3000
- Redis runs on localhost:6379
- PostgreSQL runs on localhost:5432

## Features

- RESTful API with Django REST Framework
- Redis caching for improved performance
- Rate limiting for API endpoints
- PostgreSQL database
- React frontend
- Authentication and authorization
- Filtering and search capabilities