# syntax=docker/dockerfile:1

# ==============================
# 1) Build stage
# ==============================
FROM node:22-alpine AS build
WORKDIR /app

ARG VITE_API_BASE_URL=http://localhost:5000/api
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# Copy dependency manifests first for better cache usage
COPY package*.json ./
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

# Copy source and build
COPY . .
RUN npm run build

# ==============================
# 2) Runtime stage (Nginx)
# ==============================
FROM nginx:1.27-alpine AS runtime
WORKDIR /usr/share/nginx/html

# Remove default static assets and copy built app
RUN rm -rf ./*
COPY --from=build /app/dist ./

# SPA routing configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
