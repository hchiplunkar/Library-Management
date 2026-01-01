# Nginx Reverse Proxy

This directory contains the Nginx reverse proxy configuration for the Library Management System.

## Files

- **Dockerfile** - Nginx container image configuration
- **nginx.conf** - Main Nginx configuration file
- **.dockerignore** - Files to exclude from Docker build

## Quick Start

### Using Docker Compose

```bash
cd ..
docker-compose up --build
```

The application will be available at `http://localhost`

### Using Docker Directly

```bash
# Build the Nginx image
docker build -t library-management-nginx:latest .

# Run the container
docker run -d \
  --name library-nginx \
  -p 80:80 \
  -p 443:443 \
  -v $(pwd)/nginx.conf:/etc/nginx/nginx.conf:ro \
  library-management-nginx:latest
```

## Configuration

### Default Settings

- **HTTP Port**: 80
- **HTTPS Port**: 443 (requires SSL certificates)
- **Backend**: Proxies to `http://app:3000`
- **Gzip**: Enabled for text-based content
- **Rate Limiting**: 10 req/s for general, 30 req/s for API
- **Security Headers**: Implemented

### Modifying Configuration

Edit `nginx.conf` to customize:

1. **Port numbers**
   ```nginx
   listen 80;
   listen [::]:80;
   ```

2. **Backend server**
   ```nginx
   upstream app_backend {
       server app:3000;
   }
   ```

3. **Rate limits**
   ```nginx
   limit_req_zone $binary_remote_addr zone=general:10m rate=10r/s;
   ```

4. **Headers**
   ```nginx
   add_header X-Frame-Options "SAMEORIGIN" always;
   ```

## SSL/TLS Setup

### For Production

1. Place your SSL certificates in a directory:
   ```bash
   mkdir ssl
   cp /path/to/cert.pem ssl/
   cp /path/to/key.pem ssl/
   ```

2. Update `docker-compose.yml`:
   ```yaml
   volumes:
     - ./ssl:/etc/nginx/ssl:ro
   ```

3. Uncomment HTTPS section in `nginx.conf`

4. Start containers:
   ```bash
   docker-compose up --build
   ```

### Using Let's Encrypt

See [NGINX_SETUP.md](../NGINX_SETUP.md#1-using-lets-encrypt-ssl-certificate) in the root directory for detailed steps.

## Health Checks

The Nginx container includes health checks:

```
GET /health → 200 OK "healthy\n"
```

This endpoint is not logged and returns immediately.

## Logs

### View Logs

```bash
# Docker Compose
docker-compose logs -f nginx

# Docker
docker logs -f library-nginx

# Inside container
docker exec library-nginx tail -f /var/log/nginx/access.log
docker exec library-nginx tail -f /var/log/nginx/error.log
```

### Log Format

```
$remote_addr - $remote_user [$time_local] "$request" $status $body_bytes_sent "$http_referer" "$http_user_agent" "$http_x_forwarded_for"
```

## Performance Tips

### 1. Increase Worker Connections

For high traffic (>1000 concurrent connections):

```nginx
events {
    worker_connections 4096;
}
```

### 2. Enable Caching

```nginx
location ~* \.(js|css|png|jpg)$ {
    expires 365d;
    add_header Cache-Control "public, immutable";
    proxy_cache_valid 200 365d;
}
```

### 3. Adjust Timeouts

```nginx
proxy_connect_timeout 60s;
proxy_send_timeout 60s;
proxy_read_timeout 60s;
```

## Troubleshooting

### 502 Bad Gateway

Backend server is down. Check:

```bash
docker ps | grep app
docker logs library-management-app
```

### 503 Service Unavailable

All backends are down. Verify connectivity:

```bash
docker exec library-nginx ping app
```

### Connection Refused

Nginx can't reach backend. Ensure they're on the same Docker network:

```bash
docker network ls
docker network inspect library-network
```

## Security

The configuration includes:

- X-Frame-Options: SAMEORIGIN (prevents clickjacking)
- X-Content-Type-Options: nosniff (prevents MIME sniffing)
- CSP: default-src 'self' (prevents injection attacks)
- Rate limiting (prevents abuse)
- HTTPS support (secure communication)

## Resources

- [Nginx Documentation](https://nginx.org/en/docs/)
- [Docker Documentation](https://docs.docker.com/)
- [Nginx Best Practices](https://kubernetes.io/docs/concepts/configuration/overview/)

## Support

For detailed configuration help, see:
- [NGINX_SETUP.md](../NGINX_SETUP.md) - Comprehensive setup guide
- [DOCKER_SETUP.md](../DOCKER_SETUP.md) - Docker integration guide
