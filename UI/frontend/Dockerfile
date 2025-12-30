# # FROM node:20-alpine AS build

# # WORKDIR /app
# # COPY package*.json ./
# # #RUN npm install
# # RUN npm install -g npm@11.7.0 --no-fund
# # COPY . .
# # RUN npm run build

# # # Serve with lightweight web server
# # FROM nginx:alpine
# # COPY --from=build /app/build /usr/share/nginx/html

# # EXPOSE 80
# # CMD ["nginx", "-g", "daemon off;"]
# # Stage 1: Build React app
# # Stage 1: Build
# FROM node:20-alpine AS build

# WORKDIR /app

# # Upgrade npm (optional)
# RUN npm install -g npm@11.7.0 --no-fund

# # Copy package.json and lock file
# COPY package*.json ./

# # Install all dependencies
# RUN npm install

# # Copy source
# COPY . .

# # Build with npx to ensure react-scripts binary is found
# RUN npx react-scripts build

# # Stage 2: Serve with Nginx
# FROM nginx:alpine
# COPY --from=build /app/build /usr/share/nginx/html
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]
# =========================
# 1️⃣ Build stage
# =========================
FROM node:25-alpine AS build

WORKDIR /app

#NEW
RUN npm install -g npm@11.7.0 --no-fund

# Install deps first (better layer caching)
COPY package.json ./
#RUN npm ci

RUN npm install
RUN npm install react@latest react-dom@latest @mui/material@latest @mui/icons-material@latest @tanstack/react-query@latest react-router-dom@latest axios@latest
# Copy source
COPY . .

# Build for production
RUN npm run build

# =========================
# 2️⃣ Runtime stage
# =========================
FROM nginx:stable-alpine

# Remove default Nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy our Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
