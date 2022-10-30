import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { Artist, Song } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { ArtistResponseDto } from './dtos/ArtistResponse.dto';
import { CreateArtistDto } from './dtos/CreateArtist.dto';

@Injectable()
export class ArtistService {
  constructor(private readonly prisma: PrismaService) {}

  private async getArtistSongs(artist: Artist): Promise<Song[]> {
    return this.prisma.song.findMany({
      where: { artists: { some: { artist_id: artist.id } } },
    });
  }

  async getAllArtists(): Promise<ArtistResponseDto[]> {
    const artists: ArtistResponseDto[] = [];
    const artistEntities = await this.prisma.artist.findMany();

    for (const artistEntity of artistEntities) {
      const artistSongs = await this.getArtistSongs(artistEntity);

      artists.push(ArtistResponseDto.fromEntites(artistEntity, artistSongs));
    }

    return artists;
  }

  async getArtistById(id: number): Promise<ArtistResponseDto> {
    const artistEntity = await this.prisma.artist.findUnique({ where: { id } });

    if (!artistEntity) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        error: `Artist with ID ${id} was not found`,
      });
    }

    const songEntities = await this.getArtistSongs(artistEntity);
    return ArtistResponseDto.fromEntites(artistEntity, songEntities);
  }

  async saveArtist(
    createArtistDto: CreateArtistDto,
  ): Promise<ArtistResponseDto> {
    const artistEntity = await this.prisma.artist.create({
      data: createArtistDto.toArtistEntity(),
    });

    return ArtistResponseDto.fromEntites(artistEntity);
  }
}
