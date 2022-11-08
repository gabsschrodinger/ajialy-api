import { HttpStatus, Injectable } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common/exceptions';
import { PrismaService } from '../prisma.service';
import { CreateSongDto } from './dtos/CreateSong.dto';
import { SongResponseDto } from './dtos/SongResponse.dto';

@Injectable()
export class SongService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllSongs(): Promise<SongResponseDto[]> {
    const songEntities = await this.prisma.song.findMany({
      include: { artists: { select: { artist: true } } },
    });

    return songEntities.map((song) => SongResponseDto.fromSongEntity(song));
  }

  async getSongById(id: number): Promise<SongResponseDto> {
    const songEntity = await this.prisma.song.findUnique({
      where: { id },
      include: { artists: { select: { artist: true } } },
    });

    if (!songEntity) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        error: `Song with ID ${id} was not found`,
      });
    }

    return SongResponseDto.fromSongEntity(songEntity);
  }

  async saveSong(song: CreateSongDto): Promise<SongResponseDto> {
    const songEntity = await this.prisma.song.create({
      data: {
        ...song.toSongEntity(),
        artists: {
          create: song.artistIds.map((id) => ({
            artist: { connect: { id } },
          })),
        },
      },
      include: { artists: { select: { artist: true } } },
    });

    return SongResponseDto.fromSongEntity(songEntity);
  }
}
