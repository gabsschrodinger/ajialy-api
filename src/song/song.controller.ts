import { Body, Controller, Get, Post, ValidationPipe } from '@nestjs/common';
import { SongDto } from './song.dtos';
import { SongService } from './song.service';

@Controller('songs')
export class SongController {
  constructor(private readonly songService: SongService) {}

  @Get()
  async getAllSongs(): Promise<SongDto[]> {
    return this.songService.getAllSongs();
  }

  @Post()
  async saveSong(
    @Body(new ValidationPipe({ transform: true }))
    song: SongDto,
  ): Promise<SongDto> {
    return this.songService.saveSong(song);
  }
}
