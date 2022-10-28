import { Song } from '@prisma/client';
import { plainToClass } from 'class-transformer';
import { IsArray, IsString } from 'class-validator';

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
    const mapped = {
      name,
      artists,
      japaneseLyrics: lyrics_jp,
      englishLyrics: lyrics_eng,
      portugueseLyrics: lyrics_por,
    };

    return plainToClass(SongDto, mapped);
  }
}
