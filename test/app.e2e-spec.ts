import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { generateMockArtist } from '../src/utils/test.utils';
import { faker } from '@faker-js/faker';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('/artists', () => {
    const artist = generateMockArtist();
    const artist2 = generateMockArtist();

    it('/ (GET) - Get empty artist list', () => {
      return request(app.getHttpServer())
        .get('/artists/')
        .expect(200)
        .expect([]);
    });

    it('/ (POST) - BAD REQUEST: name', () => {
      return request(app.getHttpServer())
        .post('/artists/')
        .send({ name: faker.datatype.number(), image: artist.image })
        .expect(400)
        .expect({
          statusCode: 400,
          message: ['name must be a string'],
          error: 'Bad Request',
        });
    });

    it('/ (POST) - BAD REQUEST: image', () => {
      return request(app.getHttpServer())
        .post('/artists/')
        .send({ name: artist.image, image: faker.datatype.array() })
        .expect(400)
        .expect({
          statusCode: 400,
          message: ['image must be a string'],
          error: 'Bad Request',
        });
    });

    it('/ (POST) - Create new artist', () => {
      return request(app.getHttpServer())
        .post('/artists/')
        .send({ name: artist.name, image: artist.image })
        .expect(201)
        .expect({
          id: 1,
          name: artist.name,
          image: artist.image,
          songs: [],
        });
    });

    it('/:id (GET) - Get first artist by id', () => {
      return request(app.getHttpServer()).get('/artists/1').expect(200).expect({
        id: 1,
        name: artist.name,
        image: artist.image,
        songs: [],
      });
    });

    it('/ (POST) - Create one more artist', () => {
      return request(app.getHttpServer())
        .post('/artists/')
        .send({ name: artist2.name, image: artist2.image })
        .expect(201)
        .expect({
          id: 2,
          name: artist2.name,
          image: artist2.image,
          songs: [],
        });
    });

    it('/ (GET) - Get all created artists', () => {
      return request(app.getHttpServer())
        .get('/artists/')
        .expect(200)
        .expect([
          {
            id: 1,
            name: artist.name,
            image: artist.image,
            songs: [],
          },
          {
            id: 2,
            name: artist2.name,
            image: artist2.image,
            songs: [],
          },
        ]);
    });
  });
});
