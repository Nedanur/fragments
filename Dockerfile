# Docker instructions necessary for Docker Engine to build an image of my service

# Use node version 16.15.1
FROM node:16.15.0

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
COPY package.json package-lock.json ./

# Install node dependencies defined in package-lock.json
RUN npm install

# Copy src/
COPY ./src ./src

# Copy our HTPASSWD file
COPY ./tests/.htpasswd ./tests/.htpasswd

# Run the server
CMD ["node", "src/index.js"]

# We run our service on port 8080
EXPOSE 8080 

# # Dockerfile for https://github.com/Seneca-ICTOER/Intro2C

# # Stage 0: Install alpine Linux + node + yarn + dependencies
# FROM node:16.14-alpine@sha256:2c6c59cf4d34d4f937ddfcf33bab9d8bbad8658d1b9de7b97622566a52167f2b AS dependencies

# ENV NODE_ENV=production

# WORKDIR /app

# # copy dep files and install the production deps
# COPY package.json yarn.lock ./
# RUN yarn

# #######################################################################

# # Stage 1: use dependencies to build the site
# FROM node:16.14-alpine@sha256:2c6c59cf4d34d4f937ddfcf33bab9d8bbad8658d1b9de7b97622566a52167f2b AS builder

# WORKDIR /app
# # Copy cached dependencies from previous stage so we don't have to download
# COPY --from=dependencies /app /app
# # Copy source code into the image
# COPY . .
# # Build the site to build/
# RUN yarn build

# ########################################################################

# # Stage 2: nginx web server to host the built site
# FROM nginx:stable-alpine@sha256:74694f2de64c44787a81f0554aa45b281e468c0c58b8665fafceda624d31e556 AS deploy

# # Put our build/ into /usr/share/nginx/html/ and host static files
# COPY --from=builder /app/build/ /usr/share/nginx/html/

# EXPOSE 80

# HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
#   CMD curl --fail localhost:80 || exit 1 