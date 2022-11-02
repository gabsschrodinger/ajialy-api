import { plainToClass } from 'class-transformer';
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
}
