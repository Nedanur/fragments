FROM node:16.15.0

LABEL maintainer="Nedanur Basoglu"
LABEL description="Fragments node.js microservice"

ENV NODE_ENV=production

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
COPY package.json package-lock.json ./

# Copy the package.json and package-lock.json files into the working dir (/app)
COPY package*.json ./

RUN npm ci --only=production && \
    npm uninstall sharp && \
    npm install --platform=linuxmusl sharp@0.30.3

# # Install node dependencies defined in package-lock.json
# RUN npm install

# Copy src/
COPY ./src ./src

# Copy our HTPASSWD file
COPY ./tests/.htpasswd ./tests/.htpasswd

# # Stage 1..
# FROM node:16.15.0-alpine3.14@sha256:98a87dfa76dde784bb4fe087518c839697ce1f0e4f55e6ad0b49f0bfd5fbe52c AS main

# RUN apk update && apk add --no-cache dumb-init

# ENV NODE_ENV=production

# WORKDIR /app

# # Copy cached dependencies from previous stage so we don't have to download
# COPY --chown=node:node --from=dependencies /app /app/

# # Copy source code into the image
# COPY --chown=node:node ./src ./src

# # Copy our HTPASSWD file
# COPY --chown=node:node ./tests/.htpasswd ./tests/.htpasswd

# USER node

# ENTRYPOINT ["/usr/bin/dumb-init", "--"]
# Start the container by running our server
CMD ["npm", "start"]

# We run our service on port 8080
# The EXPOSE instruction is mostly for documentation
EXPOSE 8080
