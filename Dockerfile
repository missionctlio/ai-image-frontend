# Use the official Node.js image.
# https://hub.docker.com/_/node
FROM node:22-alpine AS build
# Set environment variables
ENV PATH="/venv/bin:${PATH}"
ENV PYTHONHOME="/venv"
# Set the working directory
WORKDIR /app

# Install dependencies
COPY package.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

ENV NODE_OPTIONS=--openssl-legacy-provider 
# Build the application
RUN npm run build

# Serve the application
FROM nginx:alpine

# Install Certbot and Nginx Certbot plugin
RUN apk add python3 python3-dev py3-pip build-base libressl-dev musl-dev libffi-dev rust cargo
RUN python3 -m venv /venv && \
    . /venv/bin/activate && \
    pip install --upgrade pip && \
    pip install certbot-nginx && \
    mkdir -p /etc/letsencrypt

# Copy the build output from the previous stage
COPY --from=build /app/build /usr/share/nginx/html

# Copy the custom Nginx configuration
COPY nginx/nginx.conf /etc/nginx/nginx.conf

# Expose ports 80 and 443
EXPOSE 80 443

# Run Certbot and Nginx
CMD ["sh", "-c", "certbot --nginx -d dev.aesync.com --agree-tos --email chris+letsencrypt@aesync.com && nginx -g 'daemon off;'"]
