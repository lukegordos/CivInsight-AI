#!/bin/bash

# CivInsight AI - Development Setup Script

set -e

echo "🚀 Setting up CivInsight AI development environment..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create environment files from examples
echo "📄 Creating environment files..."
if [ ! -f backend/.env ]; then
    cp backend/.env.example backend/.env
    echo "✅ Created backend/.env from template"
fi

if [ ! -f frontend/.env.local ]; then
    cp frontend/.env.example frontend/.env.local
    echo "✅ Created frontend/.env.local from template"
fi

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p logs
mkdir -p uploads
mkdir -p data/postgres
mkdir -p data/redis

# Start the services
echo "🐳 Starting Docker services..."
docker-compose up -d db redis

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
sleep 10

# Run database migrations
echo "🗄️ Running database migrations..."
docker-compose run --rm backend alembic upgrade head

# Start all services
echo "🚀 Starting all services..."
docker-compose up -d

echo ""
echo "✅ CivInsight AI setup complete!"
echo ""
echo "🌐 Services are available at:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:8000"
echo "   API Docs: http://localhost:8000/v1/docs"
echo ""
echo "📊 To view logs:"
echo "   docker-compose logs -f"
echo ""
echo "🛑 To stop services:"
echo "   docker-compose down"
echo ""
echo "📝 Next steps:"
echo "   1. Configure your Hugging Face API token in backend/.env"
echo "   2. Add your Mapbox token to frontend/.env.local"
echo "   3. Configure AWS S3 credentials for media storage"
echo ""
