import { Artist, Song } from '@prisma/client';
import { plainToClass } from 'class-transformer';
import { OriginalLyrics } from 'src/song/enums/OriginalLyrics';
import { SongResponseDto } from '../../song/dtos/SongResponse.dto';
import { PropsExcept } from '../../utils/types.utils';
import { ArtistWithSongs } from '../artist.types';

export class ArtistResponseDto {
  id: number;
  name: string;
  image: string;
  songs: PropsExcept<SongResponseDto, 'artists'>[];

  static fromArtistEntity(artist: ArtistWithSongs): ArtistResponseDto {
    const mapped = {
      id: artist.id,
      name: artist.name,
      image: artist.image,
      songs: artist.songs.map(({ song }) => ({
        id: song.id,
        name: song.name,
        japaneseLyrics: song.lyrics_jp,
        englishLyrics: song.lyrics_eng,
        portugueseLyrics: song.lyrics_por,
        originalLyrics: song.original_lyrics,
      })),
    };

    return plainToClass(ArtistResponseDto, mapped);
  }

  static fromEntites(
    { id, name, image }: Artist,
    songEntities: Song[] = [],
  ): ArtistResponseDto {
    const mapped: ArtistResponseDto = {
      id,
      name,
      image,
      songs: songEntities.map((song) => ({
        id: song.id,
        name: song.name,
        japaneseLyrics: song.lyrics_jp,
        englishLyrics: song.lyrics_eng,
        portugueseLyrics: song.lyrics_por,
        originalLyrics: song.original_lyrics as OriginalLyrics,
      })),
    };

    return plainToClass(ArtistResponseDto, mapped);
  }
}
