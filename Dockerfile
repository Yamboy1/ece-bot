# Use Node.js 18 base image
FROM node:18-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --only=prod

# Copy source code
COPY . .

# Set environment variables
ENV DISCORD_CLIENT_ID=
ENV DISCORD_TOKEN=

# Start the bot
CMD ["node", "."]
