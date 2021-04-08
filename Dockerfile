# If you want to create a docker image of the current version, you must do a yarn build beforehand and build the docker file.
### BASE
FROM node:15.13.0-alpine3.11 AS base
LABEL maintainer "CuteWisp <sweatpotato13@gmail.com>"
# Set the working directory
WORKDIR /app
# Copy project specification and dependencies lock files
COPY package.json yarn.lock /tmp/

### DEPENDENCIES
FROM base AS dependencies
# Install Node.js dependencies
RUN cd /tmp && yarn install

### RELEASE
FROM base AS development
# Copy app sources
COPY . .
# Copy dependencies
COPY --from=dependencies /tmp/node_modules ./node_modules

CMD ["yarn", "start:dev"]