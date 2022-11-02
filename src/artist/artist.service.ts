import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ArtistResponseDto } from './dtos/ArtistResponse.dto';
import { CreateArtistDto } from './dtos/CreateArtist.dto';

@Injectable()
export class ArtistService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllArtists(): Promise<ArtistResponseDto[]> {
    const artistEntities = await this.prisma.artist.findMany({
      include: { songs: { select: { song: true } } },
    });

    return artistEntities.map((artist) =>
      ArtistResponseDto.fromArtistEntity(artist),
    );
  }

  async getArtistById(id: number): Promise<ArtistResponseDto> {
    const artistEntity = await this.prisma.artist.findUnique({
      where: { id },
      include: { songs: { select: { song: true } } },
    });

    if (!artistEntity) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        error: `Artist with ID ${id} was not found`,
      });
    }

    return ArtistResponseDto.fromArtistEntity(artistEntity);
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
