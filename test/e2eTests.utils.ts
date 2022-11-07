import { INestApplication } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

export class E2eApp {
  constructor(private readonly app: INestApplication) {}

  async close(): Promise<void> {
    await request(this.app.getHttpServer()).delete('/e2e');

    await this.app.close();
  }

  async createArtistRequest(artist: object): Promise<request.Response> {
    return request(this.app.getHttpServer()).post('/artists').send(artist);
  }

  async createSongRequest(song: object): Promise<request.Response> {
    return request(this.app.getHttpServer()).post('/songs').send(song);
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
