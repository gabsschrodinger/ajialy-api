import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from './../src/app.module';
import { generateMockSong } from '../src/utils/test.utils';
import { E2eApp } from './e2eTests.utils';
import { faker } from '@faker-js/faker';
import { Song } from '@prisma/client';
import { ArtistResponseDto } from 'src/artist/dtos/ArtistResponse.dto';

describe('Song Controller (e2e)', () => {
  let app: E2eApp;
  let createdArtist: ArtistResponseDto;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = await E2eApp.fromTestingModule(moduleFixture);
    createdArtist = await app.setRandomArtist();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('GET /songs', () => {
    it('should get empty list when there are no songs', async () => {
      const response = await app.getAllSongsRequest();

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual([]);
    });

    xit('should get all created songs', async () => {
      const firstSong = generateMockSong();
      const secondSong = generateMockSong();

      await app.createSongFromEntity(firstSong, createdArtist.id);
      await app.createSongFromEntity(secondSong, createdArtist.id);

      const response = await app.getAllSongsRequest();

      expect(response.statusCode).toBe(200);
      expect(response.body).toContainEqual({
        id: expect.any(Number),
        name: firstSong.name,
        artists: [
          {
            id: expect.any(Number),
            name: createdArtist.name,
            image: createdArtist.image,
          },
        ],
        japaneseLyrics: firstSong.lyrics_jp,
        englishLyrics: firstSong.lyrics_eng,
        portugueseLyrics: firstSong.lyrics_por,
        originalLyrics: firstSong.original_lyrics,
      });
      expect(response.body).toContainEqual({
        id: expect.any(Number),
        name: secondSong.name,
        artists: [
          {
            id: expect.any(Number),
            name: createdArtist.name,
            image: createdArtist.image,
          },
        ],
        japaneseLyrics: secondSong.lyrics_jp,
        englishLyrics: secondSong.lyrics_eng,
        portugueseLyrics: secondSong.lyrics_por,
        originalLyrics: secondSong.original_lyrics,
      });
    });
  });

  describe('GET /songs/:id', () => {
    xit('should return an existing song by id', async () => {
      const song = generateMockSong();
      const createdSong = await app.createSongRequest({
        name: song.name,
        artistIds: [createdArtist.id],
        englishLyrics: song.lyrics_eng,
        portugueseLyrics: song.lyrics_por,
        japaneseLyrics: song.lyrics_jp,
        originalLyrics: song.original_lyrics,
      });

      const response = await app.getSongByIdRequest(createdSong.body.id);

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        id: expect.any(Number),
        name: song.name,
        artists: [
          {
            id: expect.any(Number),
            name: createdArtist.name,
            image: createdArtist.image,
          },
        ],
        japaneseLyrics: song.lyrics_jp,
        englishLyrics: song.lyrics_eng,
        portugueseLyrics: song.lyrics_por,
        originalLyrics: song.original_lyrics,
      });
    });

    it('should return NOT FOUND error for unexisting song', async () => {
      const response = await app.getSongByIdRequest(99999);

      expect(response.statusCode).toBe(404);
      expect({
        status: 404,
        error: 'Song with ID 1 was not found',
      });
    });

    it('should return BAD REQUEST for invalid id type', async () => {
      const invalidId = faker.random.word() as unknown as number;

      const response = await app.getSongByIdRequest(invalidId);

      expect(response.statusCode).toBe(400);
      expect(response.body).toEqual({
        statusCode: 400,
        message: 'Validation failed (numeric string is expected)',
        error: 'Bad Request',
      });
    });
  });

  describe('POST /songs', () => {
    let song: Song;

    beforeEach(() => {
      song = generateMockSong();
    });

    describe('BAD REQUEST', () => {
      it('should throw an error for wrong type in the "name" field', async () => {
        const response = await app.createSongRequest({
          name: faker.datatype.number(),
          artistIds: [createdArtist.id],
          englishLyrics: song.lyrics_eng,
          portugueseLyrics: song.lyrics_por,
          japaneseLyrics: song.lyrics_jp,
          originalLyrics: song.original_lyrics,
        });

        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({
          statusCode: 400,
          message: ['name must be a string'],
          error: 'Bad Request',
        });
      });

      it('should throw an error for wrong type in the "englishLyrics" field', async () => {
        const response = await app.createSongRequest({
          name: song.name,
          artistIds: [createdArtist.id],
          englishLyrics: faker.datatype.boolean(),
          portugueseLyrics: song.lyrics_por,
          japaneseLyrics: song.lyrics_jp,
          originalLyrics: song.original_lyrics,
        });

        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({
          statusCode: 400,
          message: ['englishLyrics must be a string'],
          error: 'Bad Request',
        });
      });

      it('should throw an error for wrong type in the "portugueseLyrics" field', async () => {
        const response = await app.createSongRequest({
          name: song.name,
          artistIds: [createdArtist.id],
          englishLyrics: song.lyrics_eng,
          portugueseLyrics: faker.datatype.array(5),
          japaneseLyrics: song.lyrics_jp,
          originalLyrics: song.original_lyrics,
        });

        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({
          statusCode: 400,
          message: ['portugueseLyrics must be a string'],
          error: 'Bad Request',
        });
      });

      it('should throw an error for wrong type in the "japaneseLyrics" field', async () => {
        const response = await app.createSongRequest({
          name: song.name,
          artistIds: [createdArtist.id],
          englishLyrics: song.lyrics_eng,
          portugueseLyrics: song.lyrics_por,
          japaneseLyrics: faker.datatype.float(),
          originalLyrics: song.original_lyrics,
        });

        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({
          statusCode: 400,
          message: ['japaneseLyrics must be a string'],
          error: 'Bad Request',
        });
      });
    });

    it('should return the created song', async () => {
      const response = await app.createSongFromEntity(song, createdArtist.id);

      expect(response.statusCode).toBe(201);
      expect(response.body).toEqual({
        id: expect.any(Number),
        name: song.name,
        artists: [
          {
            id: expect.any(Number),
            name: createdArtist.name,
            image: createdArtist.image,
          },
        ],
        japaneseLyrics: song.lyrics_jp,
        englishLyrics: song.lyrics_eng,
        portugueseLyrics: song.lyrics_por,
        originalLyrics: song.original_lyrics,
      });
    });
  });
});
