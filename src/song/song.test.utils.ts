import { Song } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { OriginalLyrics } from './enums/OriginalLyrics';

export function generateMockSong({ id }: Partial<Song> = {}): Song {
  return {
    id: id ?? faker.datatype.number(),
    name: faker.music.songName(),
    artists: [faker.name.fullName()],
    lyrics_jp: faker.lorem.text(),
    lyrics_eng: faker.lorem.text(),
    lyrics_por: faker.lorem.text(),
    original_lyrics: faker.helpers.objectValue(OriginalLyrics),
  };
}
