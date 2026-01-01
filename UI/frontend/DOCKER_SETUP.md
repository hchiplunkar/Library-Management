# Docker Setup Guide

This guide explains how to build and run the Library Management System using Docker.

## Prerequisites

- Docker and Docker Compose installed on your system
- Git installed (for cloning the repository)

## Quick Start with Docker Compose (Recommended)

The easiest way to run the application with Nginx reverse proxy is using Docker Compose:

```bash
# Clone the repository
git clone https://github.com/hchiplunkar/Library-Management.git
cd Library-Management

# Build and start the application with Nginx proxy
docker-compose up --build

# The application will be available at http://localhost
# (Nginx reverse proxy on port 80)
```

This setup includes:
- **Nginx Reverse Proxy** (Port 80/443)
- **Node.js Application** (Port 3000, internal only)
- **Docker Network** for secure inter-service communication

To stop the container:

```bash
docker-compose down
```

## Nginx Reverse Proxy

The application now includes **Nginx reverse proxy** for production-ready deployment:

- **Handles HTTP/HTTPS** traffic on ports 80/443
- **Reverse proxies** requests to the Node.js backend
- **Load balancing** with health checks
- **Gzip compression** for faster content delivery
- **Security headers** for enhanced security
- **Static asset caching** with 365-day expiration
- **Rate limiting** to prevent abuse

See [NGINX_SETUP.md](./NGINX_SETUP.md) for detailed Nginx configuration and HTTPS setup.

## Building and Running Manually with Docker

### Option 1: With Nginx Reverse Proxy (Production Ready)

```bash
# Create docker network
docker network create library-network

# Build Nginx image
docker build -t library-management-nginx:latest ./nginx

# Build app image
docker build -t library-management:latest .

# Run the app
docker run -d \
  --name library-app \
  --network library-network \
  -e NODE_ENV=production \
  library-management:latest

# Run Nginx proxy
docker run -d \
  --name library-nginx \
  --network library-network \
  -p 80:80 \
  -p 443:443 \
  -v $(pwd)/nginx/nginx.conf:/etc/nginx/nginx.conf:ro \
  library-management-nginx:latest
```

Access at: `http://localhost`

### Option 2: Direct (Development Only)

```bash
# Build the Docker image
docker build -t library-management:latest .

# Run the container
docker run -p 3000:3000 --name library-app library-management:latest
```

Access at: `http://localhost:3000`

## Docker Image Details

- **Base Image**: `node:20-alpine` (lightweight Node.js image)
- **Build Tool**: Vite (fast build tool for modern web apps)
- **Runtime Server**: `serve` (static file server)
- **Port**: 3000
- **Health Check**: Enabled (checks every 30 seconds)

## Production Deployment

### Recommended: Docker Compose with Nginx

The simplest and most production-ready approach:

```bash
# Clone repository
git clone https://github.com/hchiplunkar/Library-Management.git
cd Library-Management

# Start with Nginx reverse proxy
docker-compose up -d --build

# Check status
docker-compose ps
```

This includes:
- Nginx on port 80/443
- Node.js app on internal port 3000
- Automatic health checks
- Auto-restart on failure
- Network isolation

### Manual Docker Setup with Nginx

1. **Prepare SSL certificates** (optional for HTTPS):
   ```bash
   mkdir -p ./ssl
   # Copy your cert.pem and key.pem here
   ```

2. **Build images**:
   ```bash
   docker build -t library-management:latest .
   docker build -t library-management-nginx:latest ./nginx
   ```

3. **Create network and run**:
   ```bash
   docker network create library-network

   docker run -d \
     --name library-app \
     --network library-network \
     -e NODE_ENV=production \
     --restart unless-stopped \
     library-management:latest

   docker run -d \
     --name library-nginx \
     --network library-network \
     -p 80:80 \
     -p 443:443 \
     -v $(pwd)/nginx/nginx.conf:/etc/nginx/nginx.conf:ro \
     -v $(pwd)/ssl:/etc/nginx/ssl:ro \
     --restart unless-stopped \
     library-management-nginx:latest
   ```

### Environment Variables

The application currently supports:

- `NODE_ENV`: Set to `production` (default in Dockerfile)

### HTTPS/SSL Setup

See [NGINX_SETUP.md - Production Deployment](./NGINX_SETUP.md#production-deployment) for complete SSL/TLS setup with Let's Encrypt.

### Domain Configuration

Update your DNS records to point to your server:
```
yourdomain.com  A  <your-server-ip>
```

Nginx will automatically handle HTTP requests and (if configured) redirect to HTTPS.

## Useful Docker Commands

### View running containers
```bash
docker ps
```

### View logs
```bash
docker logs library-app
```

### Stop the container
```bash
docker stop library-app
```

### Remove the container
```bash
docker rm library-app
```

### View image size
```bash
docker images | grep library-management
```

## Troubleshooting

### Port already in use
If port 3000 is already in use, map to a different port:
```bash
docker run -p 8080:3000 library-management:latest
```

### Build failures
Ensure you have sufficient disk space and RAM. The build requires:
- ~500MB for dependencies
- ~200MB for the built application

### Application not starting
Check the logs:
```bash
docker logs library-app
```

## File Structure

- `Dockerfile` - Multi-stage Docker build configuration
- `.dockerignore` - Files to exclude from Docker build context
- `docker-compose.yml` - Docker Compose configuration for easy orchestration
- `DOCKER_SETUP.md` - This documentation

## Additional Notes

- The application uses a multi-stage Docker build for optimal image size
- Alpine Linux is used as the base image for smaller image footprint
- Health checks are configured to monitor application health
- The container restarts automatically unless manually stopped

## Support

For issues related to Docker setup, please refer to the main README.md or create an issue on GitHub.
