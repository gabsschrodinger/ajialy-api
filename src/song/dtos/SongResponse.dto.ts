import { Song } from '@prisma/client';
import { plainToClass } from 'class-transformer';
import { OriginalLyrics } from '../enums/OriginalLyrics';

export class SongResponseDto {
  id: number;
  name: string;
  artists: string[];
  japaneseLyrics: string;
  englishLyrics: string;
  portugueseLyrics: string;
  originalLyrics: OriginalLyrics;

  static fromSongEntity({
    id,
    name,
    lyrics_jp,
    lyrics_eng,
    lyrics_por,
    original_lyrics,
  }: Song): SongResponseDto {
    const mapped = {
      id,
      name,
      artists: [],
      japaneseLyrics: lyrics_jp,
      englishLyrics: lyrics_eng,
      portugueseLyrics: lyrics_por,
      originalLyrics: original_lyrics,
    };

    return plainToClass(SongResponseDto, mapped);
  }
}
