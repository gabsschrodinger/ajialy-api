import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { ArtistService } from './artist.service';
import { ArtistResponseDto } from './dtos/ArtistResponse.dto';
import { CreateArtistDto } from './dtos/CreateArtist.dto';

@Controller('artists')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @Get()
  async getAllArtists(): Promise<ArtistResponseDto[]> {
    return this.artistService.getAllArtists();
  }

  @Get(':id')
  async getArtistById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ArtistResponseDto> {
    return this.artistService.getArtistById(id);
  }

  @Post()
  async saveArtist(
    @Body(new ValidationPipe({ transform: true }))
    createArtistDto: CreateArtistDto,
  ): Promise<ArtistResponseDto> {
    return this.artistService.saveArtist(createArtistDto);
  }
}
