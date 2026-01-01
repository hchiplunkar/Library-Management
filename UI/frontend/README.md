# Library Management System

A comprehensive, production-ready Library Management System built with React, TypeScript, Material-UI, and Vite, with Nginx reverse proxy support.

## 🎯 Features

### Core Functionality
- **Users Management** - Create, read, update, delete library members with membership tracking
- **Books Management** - Complete catalog management with ISBN, publication details
- **Categories** - Organize books by categories
- **Authors** - Manage author information and biographies
- **Publishers** - Track publisher details and contact information
- **Borrow/Return System** - Track book borrowing, returns, and overdue books
- **Dashboard** - Real-time statistics and quick navigation
- **Settings** - System configuration and preferences

### Technical Features
- 🚀 **Vite** - Lightning-fast build tool and dev server
- ⚛️ **React 18** - Modern React with hooks and functional components
- 📘 **TypeScript** - Type-safe development
- 🎨 **Material-UI (MUI)** - Professional UI components
- 🔌 **React Router** - Client-side routing
- 🐳 **Docker & Docker Compose** - Containerized deployment
- 🔒 **Nginx Reverse Proxy** - Production-ready reverse proxy with SSL/TLS support
- 📊 **DataGrid** - Powerful data grid for CRUD operations
- 📱 **Responsive Design** - Mobile-friendly interface

## 📋 Prerequisites

- **Node.js** 18+ (for local development)
- **Docker & Docker Compose** (for containerized deployment)
- **Git** (for cloning the repository)

## 🚀 Quick Start

### Option 1: Docker Compose (Recommended - Production Ready)

```bash
# Clone the repository
git clone https://github.com/hchiplunkar/Library-Management.git
cd Library-Management

# Start with Nginx reverse proxy
docker-compose up --build

# Application available at http://localhost
```

### Option 2: Local Development

```bash
# Clone the repository
git clone https://github.com/hchiplunkar/Library-Management.git
cd Library-Management

# Install dependencies
npm install

# Start development server
npm run dev

# Application available at http://localhost:5173
```

### Option 3: Production Deployment

```bash
# Using production docker-compose with HTTPS support
docker-compose -f docker-compose.prod.yml up --build

# For HTTPS, prepare SSL certificates in ./ssl directory first
```

## 📁 Project Structure

```
Library-Management/
├── src/
│   ├── library/                    # Library Management System
│   │   ├── components/             # Reusable components
│   │   ├── pages/                  # CRUD pages (Users, Books, etc.)
│   │   ├── data/                   # Mock data
│   │   └── LibraryDashboard.tsx   # Main dashboard
│   ├── crm/                        # CRM System (bonus)
│   ├── shared-theme/               # Shared styling
│   └── App.tsx                     # Main app routing
├── nginx/                          # Nginx reverse proxy
│   ├── Dockerfile                  # Nginx container config
│   ├── nginx.conf                  # Nginx configuration
│   └── README.md                   # Nginx-specific docs
├── Dockerfile                      # App container config
├── docker-compose.yml              # Development setup
├── docker-compose.prod.yml         # Production setup
├── DOCKER_SETUP.md                 # Docker documentation
├── NGINX_SETUP.md                  # Nginx documentation
└── package.json                    # Node dependencies
```

## 🔧 Configuration

### Environment Variables

```bash
# .env (create if needed)
NODE_ENV=production
```

### Nginx Configuration

See [NGINX_SETUP.md](./NGINX_SETUP.md) for:
- Reverse proxy setup
- SSL/TLS configuration
- Load balancing
- Security headers
- Performance tuning

### Docker Setup

See [DOCKER_SETUP.md](./DOCKER_SETUP.md) for:
- Docker and Docker Compose usage
- Container management
- Health checks
- Logging configuration

## 📖 Usage

### Accessing the Application

- **With Docker Compose**: `http://localhost` (via Nginx proxy)
- **Local Development**: `http://localhost:5173`
- **Direct Container**: `http://localhost:3000`

### Using the Library System

#### Dashboard
- View statistics (total books, active users, borrowed books, overdue books)
- Quick navigation to all modules
- System health overview

#### Users Management
- Add new library members
- Edit user details
- Deactivate inactive members
- Track borrowed books per user

#### Books Management
- Add new books to catalog
- Update book information
- Track available quantity
- Link to authors, categories, publishers

#### Borrow/Return
- Create borrow records
- Track due dates
- Process returns
- Monitor overdue books

#### Categories, Authors, Publishers
- Manage all library entities
- Full CRUD operations
- Filter and search capabilities

## 🔌 API Mock Data

The system uses mock data for demonstration. To integrate with a backend:

1. Replace `src/library/data/mockData.ts` with API calls
2. Use React Query or SWR for state management
3. Update components to use real API endpoints

Example:

```typescript
// Before: Mock data
const [rows, setRows] = useState<User[]>(mockUsers);

// After: API call
const [rows, setRows] = useState<User[]>([]);

useEffect(() => {
  fetch('/api/users')
    .then(res => res.json())
    .then(data => setRows(data));
}, []);
```

## 🐳 Docker Commands

### Building

```bash
# Build with docker-compose
docker-compose build

# Build specific service
docker-compose build app
docker-compose build nginx
```

### Running

```bash
# Start all services
docker-compose up

# Start in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Monitoring

```bash
# View running containers
docker-compose ps

# Check container logs
docker-compose logs nginx
docker-compose logs app

# Execute command in container
docker-compose exec app npm run build
```

## 🔒 Security Features

- ✅ Security headers (X-Frame-Options, CSP, etc.)
- ✅ HTTPS/SSL support
- ✅ Rate limiting (10 req/s general, 30 req/s API)
- ✅ Input validation
- ✅ CORS headers
- ✅ Health checks and monitoring

## 📊 Available NPM Scripts

```bash
# Development
npm run dev           # Start Vite dev server

# Production
npm run build         # Build for production
npm run preview       # Preview production build
npm run lint          # Run ESLint

# Docker
docker-compose up     # Start with docker-compose
docker build .        # Build Docker image
```

## 🚀 Deployment

### Heroku

```bash
# Create Dockerfile in root
docker build -t library-management:latest .

# Deploy to Heroku
heroku container:push web
heroku container:release web
```

### AWS ECS

```bash
# Build and push to ECR
aws ecr get-login-password | docker login --username AWS --password-stdin <account>.dkr.ecr.<region>.amazonaws.com

docker tag library-management:latest <account>.dkr.ecr.<region>.amazonaws.com/library-management:latest
docker push <account>.dkr.ecr.<region>.amazonaws.com/library-management:latest
```

### DigitalOcean, Linode, or Self-hosted

```bash
# Using docker-compose
docker-compose -f docker-compose.prod.yml up -d
```

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Change port in docker-compose.yml
ports:
  - "8080:80"  # Map to 8080 instead
```

### Build Failures

```bash
# Clear cache and rebuild
docker-compose down -v
docker-compose build --no-cache
docker-compose up
```

### App Not Responding

```bash
# Check logs
docker-compose logs app
docker-compose logs nginx

# Verify network
docker-compose exec app curl http://localhost:3000/health
```

## 📚 Documentation

- [DOCKER_SETUP.md](./DOCKER_SETUP.md) - Detailed Docker configuration
- [NGINX_SETUP.md](./NGINX_SETUP.md) - Nginx reverse proxy setup
- [nginx/README.md](./nginx/README.md) - Nginx-specific documentation
- [Material-UI Documentation](https://mui.com/)
- [Vite Documentation](https://vitejs.dev/)
- [Docker Documentation](https://docs.docker.com/)

## 🤝 Contributing

Contributions are welcome! Please feel free to:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the MIT License.

## 👥 Support

For issues, questions, or suggestions:

1. Check existing issues on GitHub
2. Create a new issue with detailed description
3. Include error logs and reproduction steps
4. Specify your environment (Docker version, Node version, OS)

## 🎉 Acknowledgments

- Built with [Material-UI](https://mui.com/)
- Powered by [React](https://react.dev/) and [TypeScript](https://www.typescriptlang.org/)
- Containerized with [Docker](https://www.docker.com/)
- Proxied with [Nginx](https://nginx.org/)

---

**Made with ❤️ for library management**
