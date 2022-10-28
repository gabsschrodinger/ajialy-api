import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
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

    return SongDto.fromSongEntity(songEntity);
  }

  async saveSong(song: SongDto): Promise<SongDto> {
    const songEntity = await this.prisma.song.create({
      data: song.toSongEntity(),
    });

    return SongDto.fromSongEntity(songEntity);
  }
}
