#!/bin/bash

docker compose up database --build -d

sleep 5

yarn database:setup
yarn prisma generate