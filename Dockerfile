# Use the official Node.js image.
# https://hub.docker.com/_/node
FROM node:22-alpine AS build

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

# Copy the build output from the previous stage
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Run Nginx
CMD ["nginx", "-g", "daemon off;"]
