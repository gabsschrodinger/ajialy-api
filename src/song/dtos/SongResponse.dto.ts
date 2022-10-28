import { Song } from '@prisma/client';
import { plainToClass } from 'class-transformer';

export class SongResponseDto {
  id: number;
  name: string;
  artists: string[];
  japaneseLyrics: string;
  englishLyrics: string;
  portugueseLyrics: string;

  static fromSongEntity({
    id,
    name,
    artists,
    lyrics_jp,
    lyrics_eng,
    lyrics_por,
  }: Song): SongResponseDto {
    const mapped = {
      id,
      name,
      artists,
      japaneseLyrics: lyrics_jp,
      englishLyrics: lyrics_eng,
      portugueseLyrics: lyrics_por,
    };

    return plainToClass(SongResponseDto, mapped);
  }
}
