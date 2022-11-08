import { INestApplication } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import { generateMockArtist } from '../src/utils/test.utils';
import * as request from 'supertest';
import { ArtistResponseDto } from '../src/artist/dtos/ArtistResponse.dto';
import { Song } from '@prisma/client';

export class E2eApp {
  constructor(private readonly app: INestApplication) {}

  async close(): Promise<void> {
    await request(this.app.getHttpServer()).delete('/e2e');

    await this.app.close();
  }

  async createArtistRequest(artist: object): Promise<request.Response> {
    return request(this.app.getHttpServer()).post('/artists').send(artist);
  }

  async setRandomArtist(): Promise<ArtistResponseDto> {
    const artist = generateMockArtist();
    const response = await this.createArtistRequest({
      name: artist.name,
      image: artist.image,
    });

    return response.body;
  }

  async createSongRequest(song: object): Promise<request.Response> {
    return request(this.app.getHttpServer()).post('/songs').send(song);
  }

  async createSongFromEntity(
    song: Song,
    artistId: number,
  ): Promise<request.Response> {
    return request(this.app.getHttpServer())
      .post('/songs')
      .send({
        name: song.name,
        artistIds: [artistId],
        englishLyrics: song.lyrics_eng,
        portugueseLyrics: song.lyrics_por,
        japaneseLyrics: song.lyrics_jp,
        originalLyrics: song.original_lyrics,
      });
  }

  async getAllArtistsRequest(): Promise<request.Response> {
    return request(this.app.getHttpServer()).get('/artists');
  }

  async getAllSongsRequest(): Promise<request.Response> {
    return request(this.app.getHttpServer()).get('/songs');
  }

  async getArtistByIdRequest(id: number): Promise<request.Response> {
    return request(this.app.getHttpServer()).get(`/artists/${id}`);
  }

  async getSongByIdRequest(id: number): Promise<request.Response> {
    return request(this.app.getHttpServer()).get(`/songs/${id}`);
  }

  static async fromTestingModule(module: TestingModule): Promise<E2eApp> {
    const app = module.createNestApplication();
    await app.init();

    return new E2eApp(app);
  }
}
