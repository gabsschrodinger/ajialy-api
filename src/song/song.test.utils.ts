import { Song } from '@prisma/client';
import { faker } from '@faker-js/faker';

export function generateMockSong(): Song {
  return {
    id: faker.datatype.number(),
    name: faker.music.songName(),
    artists: [faker.name.fullName()],
    lyrics_eng: faker.lorem.text(),
    lyrics_por: faker.lorem.text(),
  };
}
