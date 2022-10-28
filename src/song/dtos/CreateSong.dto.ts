import { Song } from '@prisma/client';
import { IsString } from 'class-validator';

export class CreateSongDto {
  @IsString()
  name: string;

  @IsString({ each: true })
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
}
