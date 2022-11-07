import { Artist, Song } from '@prisma/client';
import { plainToClass } from 'class-transformer';
import { ArtistResponseDto } from '../../artist/dtos/ArtistResponse.dto';
import { PropsExcept } from '../../utils/types.utils';
import { OriginalLyrics } from '../enums/OriginalLyrics';
import { SongWithArtists } from '../song.types';

export class SongResponseDto {
  id: number;
  name: string;
  artists: PropsExcept<ArtistResponseDto, 'songs'>[];
  japaneseLyrics: string;
  englishLyrics: string;
  portugueseLyrics: string;
  originalLyrics: OriginalLyrics;

  static fromEntities(
    songEntity: Song,
    artistEntities: Artist[] = [],
  ): SongResponseDto {
    const mapped: SongResponseDto = {
      id: songEntity.id,
      name: songEntity.name,
      artists: artistEntities,
      japaneseLyrics: songEntity.lyrics_jp,
      englishLyrics: songEntity.lyrics_eng,
      portugueseLyrics: songEntity.lyrics_por,
      originalLyrics: songEntity.original_lyrics as OriginalLyrics,
    };

    return plainToClass(SongResponseDto, mapped);
  }

  static fromSongEntity({
    id,
    name,
    lyrics_jp,
    lyrics_eng,
    lyrics_por,
    original_lyrics,
    artists,
  }: SongWithArtists): SongResponseDto {
    const mapped: SongResponseDto = {
      id,
      name,
      artists: artists.map(({ artist }) => ({
        id: artist.id,
        name: artist.name,
        image: artist.image,
      })),
      japaneseLyrics: lyrics_jp,
      englishLyrics: lyrics_eng,
      portugueseLyrics: lyrics_por,
      originalLyrics: original_lyrics as OriginalLyrics,
    };

    return plainToClass(SongResponseDto, mapped);
  }
}
