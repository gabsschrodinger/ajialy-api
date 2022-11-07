import { Artist, Song } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { OriginalLyrics } from '../song/enums/OriginalLyrics';
import { PrismaService } from '../prisma.service';
import { mock } from 'jest-mock-extended';
import { ArtistWithSongs } from 'src/artist/artist.types';
import { SongWithArtists } from 'src/song/song.types';

export function generateMockSong(song: Partial<Song> = {}): Song {
  return {
    id: faker.datatype.number(),
    name: faker.music.songName(),
    lyrics_jp: faker.lorem.text(),
    lyrics_eng: faker.lorem.text(),
    lyrics_por: faker.lorem.text(),
    original_lyrics: faker.helpers.objectValue(OriginalLyrics),
    ...song,
  };
}

export function generateMockSongWithArtists(
  song: Partial<SongWithArtists> = {},
): SongWithArtists {
  return {
    artists: Array.from(
      { length: faker.datatype.number({ min: 1, max: 10 }) },
      () => ({
        artist: generateMockArtist(),
      }),
    ),
    ...generateMockSong(song),
  };
}

export function generateMockArtist(artist: Partial<Artist> = {}): Artist {
  return {
    id: faker.datatype.number(),
    name: faker.name.firstName(),
    image: faker.image.imageUrl(),
    ...artist,
  };
}

export function generateMockArtistWithSongs(
  artist: Partial<ArtistWithSongs> = {},
): ArtistWithSongs {
  return {
    songs: Array.from(
      { length: faker.datatype.number({ min: 1, max: 10 }) },
      () => ({
        song: generateMockSong(),
      }),
    ),
    ...generateMockArtist(artist),
  };
}

export function generateMockPrisma(): PrismaService {
  return mock<PrismaService>({
    song: {
      findMany: jest.fn().mockResolvedValue([]),
      findUnique: jest.fn().mockResolvedValue(generateMockSong()),
      create: jest.fn().mockResolvedValue(generateMockSongWithArtists()),
    },
    artist: {
      findMany: jest.fn().mockResolvedValue([]),
      findUnique: jest.fn().mockResolvedValue(generateMockArtistWithSongs()),
      create: jest.fn().mockResolvedValue(generateMockArtistWithSongs()),
    },
    clearDatabase: jest.fn().mockResolvedValue(undefined),
  });
}
