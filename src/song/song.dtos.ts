import { Song } from '@prisma/client';
import { IsArray, IsString } from 'class-validator';
import { GetProperties } from 'src/utils/types.utils';

export class SongDto {
  @IsString()
  name: string;

  @IsArray()
  artists: string[];

  @IsString()
  japaneseLyrics: string;

  @IsString()
  englishLyrics: string;

  @IsString()
  portugueseLyrics: string;

  constructor({
    name,
    artists,
    japaneseLyrics,
    englishLyrics,
    portugueseLyrics,
  }: GetProperties<SongDto>) {
    this.name = name;
    this.artists = artists;
    this.japaneseLyrics = japaneseLyrics;
    this.englishLyrics = englishLyrics;
    this.portugueseLyrics = portugueseLyrics;
  }

  toSongEntity(): Song {
    return {
      id: undefined,
      name: this.name,
      artists: this.artists,
      lyrics_jp: this.japaneseLyrics,
      lyrics_eng: this.englishLyrics,
      lyrics_por: this.portugueseLyrics,
    };
  }

  static fromSongEntity({
    name,
    artists,
    lyrics_jp,
    lyrics_eng,
    lyrics_por,
  }: Song): SongDto {
    return new SongDto({
      name,
      artists,
      japaneseLyrics: lyrics_jp,
      englishLyrics: lyrics_eng,
      portugueseLyrics: lyrics_por,
    });
  }
}
