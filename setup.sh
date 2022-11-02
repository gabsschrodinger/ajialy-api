#!/bin/bash

sleep 5

yarn database:setup
yarn prisma generate