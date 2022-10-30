import { Song } from '@prisma/client';
import { plainToClass } from 'class-transformer';
import { IsArray, IsEnum, IsString } from 'class-validator';
import { OriginalLyrics } from './enums/OriginalLyrics';

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

  @IsEnum(OriginalLyrics)
  originalLyrics: OriginalLyrics;

  toSongEntity(): Song {
    return {
      id: undefined,
      name: this.name,
      lyrics_jp: this.japaneseLyrics,
      lyrics_eng: this.englishLyrics,
      lyrics_por: this.portugueseLyrics,
      original_lyrics: this.originalLyrics,
    };
  }

  static fromSongEntity({
    name,
    lyrics_jp,
    lyrics_eng,
    lyrics_por,
    original_lyrics,
  }: Song): SongDto {
    const mapped = {
      name,
      artists: [],
      japaneseLyrics: lyrics_jp,
      englishLyrics: lyrics_eng,
      portugueseLyrics: lyrics_por,
      originalLyrics: original_lyrics,
    };

    return plainToClass(SongDto, mapped);
  }
}
