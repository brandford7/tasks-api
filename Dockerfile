# Step 1: Base image
FROM node:alpine

# Step 2: Set working directory
WORKDIR /app

# Step 3: Copy package files and install deps
COPY package*.json ./
RUN npm install

# Step 4: Copy source code
COPY . .

# Step 5: Build the app
RUN npm run build

# Step 6: Expose port and start app
EXPOSE 3000
CMD ["npm", "run", "start:prod"]
