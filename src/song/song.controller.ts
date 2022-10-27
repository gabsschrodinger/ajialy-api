import { Body, Controller, Get, Post } from '@nestjs/common';
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
  async saveSong(@Body() song: SongDto): Promise<SongDto> {
    return this.songService.saveSong(new SongDto(song));
  }
}
