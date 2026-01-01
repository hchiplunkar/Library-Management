# Nginx Reverse Proxy Setup Guide

This guide explains how to set up and configure Nginx as a reverse proxy for the Library Management System.

## Architecture

```
Internet
   ↓
 [Nginx Proxy] Port 80/443
   ↓
 [Node.js App] Port 3000 (Internal only)
```

## Quick Start

### Using Docker Compose (Recommended)

The Nginx proxy is automatically included in the docker-compose setup:

```bash
docker-compose up --build
```

This will:
1. Build the Nginx reverse proxy
2. Build the Node.js application
3. Start both services
4. Nginx listens on port 80
5. Access the app at `http://localhost`

### Manual Nginx Setup

```bash
# Build Nginx image
docker build -t library-management-nginx:latest ./nginx

# Build app image
docker build -t library-management-app:latest .

# Create network
docker network create library-network

# Run app
docker run -d \
  --name library-app \
  --network library-network \
  -e NODE_ENV=production \
  library-management-app:latest

# Run Nginx
docker run -d \
  --name library-nginx \
  --network library-network \
  -p 80:80 \
  -p 443:443 \
  -v $(pwd)/nginx/nginx.conf:/etc/nginx/nginx.conf:ro \
  library-management-nginx:latest
```

## Configuration Details

### Main Features

1. **Reverse Proxy**: Routes all requests to the Node.js backend
2. **Load Balancing**: Uses least connections algorithm
3. **Gzip Compression**: Reduces response sizes
4. **Security Headers**: Implements security best practices
5. **Rate Limiting**: Prevents abuse
6. **Health Checks**: Monitors backend availability
7. **Static Asset Caching**: 365-day cache for assets
8. **HTTPS Ready**: Supports SSL/TLS with certificate

### Key Endpoints

| Endpoint | Purpose |
|----------|---------|
| `/health` | Health check endpoint (no logging) |
| `/` | Main application proxy |
| `/api/*` | API endpoint routing |
| `.*\.js\|css\|png\|...` | Static assets with caching |

## Production Deployment

### 1. Using Let's Encrypt SSL Certificate

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Generate certificate
sudo certbot certonly --standalone -d yourdomain.com

# Copy certificates
mkdir -p ./ssl
sudo cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem ./ssl/cert.pem
sudo cp /etc/letsencrypt/live/yourdomain.com/privkey.pem ./ssl/key.pem
sudo chown $USER:$USER ./ssl/*
```

### 2. Configure HTTPS in nginx.conf

Uncomment the HTTPS section in `nginx/nginx.conf`:

```nginx
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # ... rest of configuration
}
```

### 3. Update docker-compose.yml for SSL

Uncomment the volumes section:

```yaml
volumes:
  - ./ssl:/etc/nginx/ssl:ro
```

### 4. Start with SSL

```bash
docker-compose up --build
```

Access via: `https://yourdomain.com`

## Nginx Configuration Breakdown

### Rate Limiting Zones

```nginx
limit_req_zone $binary_remote_addr zone=general:10m rate=10r/s;
limit_req_zone $binary_remote_addr zone=api:10m rate=30r/s;
```

- **general**: 10 requests/second for general traffic
- **api**: 30 requests/second for API traffic

Adjust rates based on your needs.

### Security Headers

| Header | Purpose |
|--------|---------|
| `X-Frame-Options: SAMEORIGIN` | Prevent clickjacking |
| `X-Content-Type-Options: nosniff` | Prevent MIME type sniffing |
| `X-XSS-Protection` | XSS protection |
| `Content-Security-Policy` | Prevent injection attacks |
| `Referrer-Policy` | Control referrer information |

### Proxy Settings

```nginx
proxy_set_header Host $host;
proxy_set_header X-Real-IP $remote_addr;
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
proxy_set_header X-Forwarded-Proto $scheme;
```

These headers are forwarded to the backend so your app knows:
- The original client IP
- The original scheme (http/https)
- The original host

## Monitoring

### Health Check

Nginx performs health checks on the backend:

```
/health endpoint → Returns 200 OK
```

If the app fails 3 consecutive checks (within 30 seconds), Nginx removes it from the pool.

### View Nginx Logs

```bash
# Real-time access logs
docker logs -f library-management-nginx

# Inside container
docker exec library-management-nginx tail -f /var/log/nginx/access.log
```

### View Error Logs

```bash
docker exec library-management-nginx tail -f /var/log/nginx/error.log
```

## Performance Tuning

### 1. Increase Worker Connections (for high traffic)

Edit `nginx/nginx.conf`:

```nginx
events {
    worker_connections 4096;  # Increase from 1024
}
```

### 2. Adjust Gzip Compression Level

```nginx
gzip_comp_level 6;  # 1-9, higher = more compression but slower
```

### 3. Increase Client Max Body Size

```nginx
client_max_body_size 100M;  # For larger file uploads
```

### 4. Enable Caching for API Responses

```nginx
location /api/ {
    proxy_cache_valid 200 1m;
    proxy_cache_key "$scheme$request_method$host$request_uri";
    # ... rest of config
}
```

## Troubleshooting

### 502 Bad Gateway

**Cause**: Backend server is down or not responding

```bash
# Check if app is running
docker ps | grep library-app

# Check app logs
docker logs library-management-app
```

### 503 Service Unavailable

**Cause**: All backend servers are down

```bash
# Verify network connectivity
docker exec library-management-nginx ping app
```

### Connection Timeout

**Cause**: Slow backend or timeout too short

```bash
# Increase timeouts in nginx.conf
proxy_connect_timeout 120s;
proxy_send_timeout 120s;
proxy_read_timeout 120s;
```

### Port Already in Use

```bash
# Check what's using port 80
sudo lsof -i :80

# Use different port
docker run -p 8080:80 library-management-nginx:latest
```

## File Structure

```
nginx/
├── Dockerfile          # Nginx container configuration
├── nginx.conf          # Main Nginx configuration
└── .dockerignore       # Files to exclude from Docker build

docker-compose.yml     # Docker Compose configuration with Nginx service
NGINX_SETUP.md         # This documentation
```

## Advanced Configuration

### Custom Error Pages

```nginx
error_page 404 /404.html;
error_page 500 502 503 504 /50x.html;

location = /50x.html {
    root /usr/share/nginx/html;
}
```

### URL Rewriting

```nginx
rewrite ^/old-path/(.*)$ /new-path/$1 permanent;
```

### Basic Authentication

```nginx
location /admin/ {
    auth_basic "Admin Area";
    auth_basic_user_file /etc/nginx/.htpasswd;
    
    proxy_pass http://app_backend;
}
```

## Support

For issues with Nginx configuration, refer to:
- [Nginx Official Documentation](https://nginx.org/en/docs/)
- [Nginx Admin Guide](https://nginx.org/en/docs/admin/)

For Docker-related issues:
- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
