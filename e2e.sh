#!/bin/bash

export ENVIRONMENT="e2e"

sleep 10

yarn database:setup
yarn prisma generate

yarn jest --config ./test/jest-e2e.json

test_result=$?

docker-compose down

exit $test_result