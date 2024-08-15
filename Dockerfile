# Use the official Node.js image.
# https://hub.docker.com/_/node
FROM node:22-alpine

# Set the working directory
WORKDIR /app

# Install dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm install


# Copy the rest of the application code
COPY . .

# Expose port 3000 for React development server
EXPOSE 3000

# Start the development server
CMD ["npm", "start"]
