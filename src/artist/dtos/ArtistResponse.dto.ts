import { Artist, Song } from '@prisma/client';
import { plainToClass } from 'class-transformer';
import { OriginalLyrics } from 'src/song/enums/OriginalLyrics';
import { SongResponseDto } from '../../song/dtos/SongResponse.dto';
import { PropsExcept } from '../../utils/types.utils';

export class ArtistResponseDto {
  id: number;
  name: string;
  image: string;
  songs: PropsExcept<SongResponseDto, 'artists'>[];

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
