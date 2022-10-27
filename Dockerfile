FROM node:18-alpine AS builder
COPY . .
RUN yarn install
RUN rm -rf prisma/migrations