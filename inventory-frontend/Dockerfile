# Use official Node.js image from Docker Hub
FROM node:16-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Copy the .env file (if it's present in your local directory)
COPY .env .env

# Expose port 3000 for the React app
EXPOSE 3000

# Command to start the React app
CMD ["npm", "start"]
