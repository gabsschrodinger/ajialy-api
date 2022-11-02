<h1 align="center">Ajialy API</h1>
<p align="center">A REST API for songs and artists in Portuguese, Japanese and English.</p>

## Description

The API provides endpoints to create and read songs and artists.

## Endpoints

- `GET /songs`: Get all songs
- `GET /songs/:id`: Get song by ID
- `POST /songs`: Create new song
- `GET /artists`: Get all artists
- `GET /artists/:id`: Get artist by ID
- `POST /artists`: Create new artist

## Stack

- TypeScript
- NestJS
- Prisma

## Running the app

Requirements: `docker` and `docker-compose`. To run the app locally, run:

```bash
yarn local
```

## Test

### Setup

```bash
yarn install && sh setup.sh
```

### Unit tests

```bash
yarn test
```

### E2E tests

```bash
yarn test:e2e
```

## Contact

- [Twitter](https://twitter.com/_gabsfernandes)

## License

UNLICENSED
