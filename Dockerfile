# If you want to create a docker image of the current version, you must do a yarn build beforehand and build the docker file.
### BASE
FROM node:14.13.1-alpine3.12 AS base
LABEL maintainer "Cute_Wisp <sweatpotato13@gmail.com>"
# Set the working directory
WORKDIR /app
# Copy project specification and dependencies lock files
COPY package.json yarn.lock tsconfig.json /tmp/

### DEPENDENCIES
FROM base AS dependencies
# Install Node.js dependencies
#RUN cd /tmp && yarn --ignore-engines

### RELEASE
FROM base AS development
# Copy app sources
COPY ./dist ./dist
COPY ./tsconfig.json .
COPY ./package.json .
COPY ./tsconfig-paths-bootstrap.js .
COPY ./node_modules ./node_modules
# Copy dependencies
#COPY --from=dependencies /tmp/node_modules ./node_modules

# Expose application port
EXPOSE 8000

CMD ["yarn", "start:prod"]