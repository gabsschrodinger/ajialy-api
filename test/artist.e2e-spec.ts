import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from './../src/app.module';
import { generateMockArtist } from '../src/utils/test.utils';
import { E2eApp } from './e2eTests.utils';
import { faker } from '@faker-js/faker';

describe('Artist Controller (e2e)', () => {
  let app: E2eApp;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = await E2eApp.fromTestingModule(moduleFixture);
  });

  afterEach(async () => {
    await app.close();
  });

  describe('GET /artists', () => {
    it('should get empty list when there are no artists', async () => {
      const response = await app.getAllArtistsRequest();

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual([]);
    });

    it('should get all created artists', async () => {
      const firstArtist = generateMockArtist();
      const secondArtist = generateMockArtist();

      await app.createArtistRequest({
        name: firstArtist.name,
        image: firstArtist.image,
      });

      await app.createArtistRequest({
        name: secondArtist.name,
        image: secondArtist.image,
      });

      const response = await app.getAllArtistsRequest();

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual([
        {
          id: expect.any(Number),
          name: firstArtist.name,
          image: firstArtist.image,
          songs: [],
        },
        {
          id: expect.any(Number),
          name: secondArtist.name,
          image: secondArtist.image,
          songs: [],
        },
      ]);
    });
  });

  describe('GET /artists/:id', () => {
    it('should return an existing artist by id', async () => {
      const artist = generateMockArtist();
      const createdArtist = await app.createArtistRequest({
        name: artist.name,
        image: artist.image,
      });

      const response = await app.getArtistByIdRequest(createdArtist.body.id);

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        id: createdArtist.body.id,
        name: artist.name,
        image: artist.image,
        songs: [],
      });
    });

    it('should return NOT FOUND error for unexisting artist', async () => {
      const response = await app.getArtistByIdRequest(99999);

      expect(response.statusCode).toBe(404);
      expect({
        status: 404,
        error: 'Artist with ID 1 was not found',
      });
    });

    it('should return BAD REQUEST for invalid id type', async () => {
      const invalidId = faker.random.word() as unknown as number;

      const response = await app.getArtistByIdRequest(invalidId);

      expect(response.statusCode).toBe(400);
      expect(response.body).toEqual({
        statusCode: 400,
        message: 'Validation failed (numeric string is expected)',
        error: 'Bad Request',
      });
    });
  });

  describe('POST /artists', () => {
    const artist = generateMockArtist();

    describe('BAD REQUEST', () => {
      it('should throw an error for wrong type in the "name" field', async () => {
        const response = await app.createArtistRequest({
          name: faker.datatype.number(),
          image: artist.image,
        });

        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({
          statusCode: 400,
          message: ['name must be a string'],
          error: 'Bad Request',
        });
      });

      it('should throw an error for wrong type in the "image" field', async () => {
        const response = await app.createArtistRequest({
          name: artist.image,
          image: faker.datatype.array(),
        });

        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({
          statusCode: 400,
          message: ['image must be a string'],
          error: 'Bad Request',
        });
      });
    });

    it('should return the created artist', async () => {
      const response = await app.createArtistRequest({
        name: artist.name,
        image: artist.image,
      });

      expect(response.statusCode).toBe(201);
      expect(response.body).toEqual({
        id: expect.any(Number),
        name: artist.name,
        image: artist.image,
        songs: [],
      });
    });
  });
});
