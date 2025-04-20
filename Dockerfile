# Using the official Node.js image as the base image
FROM node:16

# Set the working directory in the container
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

# Copy the rest of the application code to the container
COPY . .

EXPOSE 3000

# Set the command to start the server
CMD ["node", "server.js"]