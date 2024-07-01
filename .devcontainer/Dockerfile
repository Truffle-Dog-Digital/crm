# Use the official Node.js image as a base
FROM mcr.microsoft.com/vscode/devcontainers/javascript-node:0-18

# Set the working directory
WORKDIR /workspace
RUN npm install

# Change directory to react-frontend and copy its package.json
WORKDIR /workspace/react-frontend
RUN npm install

