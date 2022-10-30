import { HttpStatus, Injectable } from '@nestjs/common';
import {
  BadRequestException,
  NotFoundException,
} from '@nestjs/common/exceptions';
import { Artist, Song } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { CreateSongDto } from './dtos/CreateSong.dto';
import { SongResponseDto } from './dtos/SongResponse.dto';

@Injectable()
export class SongService {
  constructor(private readonly prisma: PrismaService) {}

  private async getSongArtists(song: Song): Promise<Artist[]> {
    return this.prisma.artist.findMany({
      where: { songs: { some: { song_id: song.id } } },
    });
  }

  async getAllSongs(): Promise<SongResponseDto[]> {
    const songs: SongResponseDto[] = [];
    const songEntities = await this.prisma.song.findMany();

    for (const songEntity of songEntities) {
      const songArtists = await this.getSongArtists(songEntity);

      songs.push(SongResponseDto.fromEntities(songEntity, songArtists));
    }

    return songs;
  }

  async getSongById(id: number): Promise<SongResponseDto> {
    const songEntity = await this.prisma.song.findUnique({ where: { id } });

    if (!songEntity) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        error: `Song with ID ${id} was not found`,
      });
    }

    const songArtists = await this.getSongArtists(songEntity);
    return SongResponseDto.fromEntities(songEntity, songArtists);
  }

  async saveSong(song: CreateSongDto): Promise<SongResponseDto> {
    const artistEntities = await this.prisma.artist.findMany({
      where: { OR: song.artists.map((name) => ({ name })) },
    });

    if (artistEntities.length !== song.artists.length) {
      throw new BadRequestException({
        status: HttpStatus.BAD_REQUEST,
        error: 'Invalid artist',
      });
    }

    const songEntity = await this.prisma.song.create({
      data: {
        ...song.toSongEntity(),
        artists: {
          createMany: {
            data: artistEntities.map(({ id }) => ({ artist_id: id })),
          },
        },
      },
    });

    return SongResponseDto.fromSongEntity(songEntity);
  }
}
