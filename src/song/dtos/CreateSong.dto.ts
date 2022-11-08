import { Song } from '@prisma/client';
import { IsEnum, IsNumber, IsString } from 'class-validator';
import { OriginalLyrics } from '../enums/OriginalLyrics';

export class CreateSongDto {
  @IsString()
  name: string;

  @IsNumber(undefined, { each: true })
  artistIds: number[];

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
}
