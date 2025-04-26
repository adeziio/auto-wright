# Use Node.js base image
FROM node:18-slim

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Install Playwright browsers
RUN npx playwright install --with-deps

# Copy the rest of the app
COPY . .

# Build the Next.js app
RUN npm run build

# Expose port for Next.js
EXPOSE 3000

# Start the production server
CMD ["npm", "start"]
