FROM node:18-alpine AS builder

COPY . .

RUN yarn install --production --frozen-lockfile