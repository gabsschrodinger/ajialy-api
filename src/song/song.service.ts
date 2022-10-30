import { HttpStatus, Injectable } from '@nestjs/common';
import {
  BadRequestException,
  NotFoundException,
} from '@nestjs/common/exceptions';
import { PrismaService } from '../prisma.service';
import { CreateSongDto } from './dtos/CreateSong.dto';
import { SongResponseDto } from './dtos/SongResponse.dto';
import { SongDto } from './song.dtos';

@Injectable()
export class SongService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllSongs(): Promise<SongResponseDto[]> {
    const songs: SongResponseDto[] = [];
    const songEntities = await this.prisma.song.findMany();

    for (const songEntity of songEntities) {
      const songArtists = await this.prisma.artist.findMany({
        where: { songs: { some: { song_id: songEntity.id } } },
      });

      songs.push(SongResponseDto.fromEntities(songEntity, songArtists));
    }

    return songs;
  }

  async getSongById(id: number): Promise<SongDto> {
    const songEntity = await this.prisma.song.findUnique({ where: { id } });

    if (!songEntity) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        error: `Song with ID ${id} was not found`,
      });
    }

    return SongDto.fromSongEntity(songEntity);
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
