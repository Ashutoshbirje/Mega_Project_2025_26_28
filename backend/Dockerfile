# Use official Node.js LTS image
FROM node:18-alpine

# Set working directory inside container
WORKDIR /app

# Copy package.json and package-lock.json first (for caching layers)
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the application code
COPY . .

# Expose backend port (adjust if your server runs on another port)
EXPOSE 5000

# Set environment variables (optional - container can also load from docker-compose)
ENV NODE_ENV=production

# Run the server
CMD ["node", "server.js"]
