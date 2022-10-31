import { Artist, Song } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { OriginalLyrics } from '../song/enums/OriginalLyrics';
import { PrismaService } from '../prisma.service';
import { mock } from 'jest-mock-extended';

export function generateMockSong({ id }: Partial<Song> = {}): Song {
  return {
    id: id ?? faker.datatype.number(),
    name: faker.music.songName(),
    lyrics_jp: faker.lorem.text(),
    lyrics_eng: faker.lorem.text(),
    lyrics_por: faker.lorem.text(),
    original_lyrics: faker.helpers.objectValue(OriginalLyrics),
  };
}

export function generateMockArtist({ id }: Partial<Artist> = {}): Artist {
  return {
    id: id ?? faker.datatype.number(),
    name: faker.name.firstName(),
    image: faker.image.imageUrl(),
  };
}

export function generateMockPrisma(): PrismaService {
  return mock<PrismaService>({
    song: {
      findMany: jest.fn().mockResolvedValue([]),
      findUnique: jest.fn().mockResolvedValue({}),
      create: jest.fn().mockResolvedValue({}),
    },
    artist: {
      findMany: jest.fn().mockResolvedValue([]),
      findUnique: jest.fn().mockResolvedValue({}),
      create: jest.fn().mockResolvedValue({}),
    },
  });
}
