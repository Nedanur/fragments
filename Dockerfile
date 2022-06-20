# Docker instructions necessary for Docker Engine to build an image of my service

# Use node version 16.15.1
FROM node:18.1.0

LABEL maintainer="Nedanur Basoglu"
LABEL description="Fragments node.js microservice"

# We default to use port 8080 in our service
ENV PORT=8080

# Reduce npm spam when installing within Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#loglevel
ENV NPM_CONFIG_LOGLEVEL=warn

# Disable colour when run inside Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#color
ENV NPM_CONFIG_COLOR=false

# Use /app as our working directory
WORKDIR /app

# Copy the package.json and package-lock.json files into /app
COPY package*.json /app/

# Copy the package.json and package-lock.json files into the working dir (/app)
COPY package*.json ./

# Copy the package.json and package-lock.json files into the working dir (/app)
COPY package*.json ./

# Install node dependencies defined in package-lock.json
RUN npm install

# Copy src/
COPY ./src ./src

# Copy our HTPASSWD file
COPY ./tests/.htpasswd ./tests/.htpasswd

# Run the server
CMD npm start

# We run our service on port 8080
EXPOSE 8080