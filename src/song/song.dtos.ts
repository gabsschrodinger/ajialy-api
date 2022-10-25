import { Song } from '@prisma/client';
import { GetProperties } from 'src/utils/types.utils';

export class SongDto {
  name: string;
  artists: string[];
  englishLyrics: string;
  portugueseLyrics: string;

  constructor({
    name,
    artists,
    englishLyrics,
    portugueseLyrics,
  }: GetProperties<SongDto>) {
    this.name = name;
    this.artists = artists;
    this.englishLyrics = englishLyrics;
    this.portugueseLyrics = portugueseLyrics;
  }

  toSongEntity(): Song {
    return {
      id: undefined,
      name: this.name,
      artists: this.artists,
      lyrics_eng: this.englishLyrics,
      lyrics_por: this.portugueseLyrics,
    };
  }

  static fromEntity({ name, artists, lyrics_eng, lyrics_por }: Song): SongDto {
    return new SongDto({
      name,
      artists,
      englishLyrics: lyrics_eng,
      portugueseLyrics: lyrics_por,
    });
  }
}
