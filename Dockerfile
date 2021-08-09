# Step 1
FROM node:14.17-alpine3.14 AS builder

LABEL maintainer "Cute_Wisp <sweatpotato13@gmail.com>"

WORKDIR /app

COPY . .

RUN yarn
RUN yarn build


# Step 2
FROM node:14.17-alpine3.14

WORKDIR /app

COPY --from=builder /app ./

CMD ["yarn", "start:prod"]
