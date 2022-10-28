import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { SongDto } from './song.dtos';
import { SongService } from './song.service';

@Controller('songs')
export class SongController {
  constructor(private readonly songService: SongService) {}

  @Get()
  async getAllSongs(): Promise<SongDto[]> {
    return this.songService.getAllSongs();
  }

  @Get(':id')
  async getSongById(@Param('id', ParseIntPipe) id: number): Promise<SongDto> {
    return this.songService.getSongById(id);
  }

  @Post()
  async saveSong(
    @Body(new ValidationPipe({ transform: true }))
    song: SongDto,
  ): Promise<SongDto> {
    return this.songService.saveSong(song);
  }
}
