# syntax=docker/dockerfile:1

# ==============================
# 1) Build stage
# ==============================
FROM node:22-alpine AS build
WORKDIR /app

# Copy dependency manifests first for better cache usage
COPY package*.json ./
RUN npm install --no-audit --no-fund

# Copy source and build
COPY . .
RUN npm run build

# ==============================
# 2) Runtime stage (Nginx)
# ==============================
FROM nginx:1.27-alpine AS runtime
WORKDIR /usr/share/nginx/html

RUN rm -rf ./*
COPY --from=build /app/dist ./
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
