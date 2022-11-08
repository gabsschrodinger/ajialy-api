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
