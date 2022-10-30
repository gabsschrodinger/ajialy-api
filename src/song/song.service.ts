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

  async getAllSongs(): Promise<SongDto[]> {
    const songEntities = await this.prisma.song.findMany();

    return songEntities.map((entity) => SongDto.fromSongEntity(entity));
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
