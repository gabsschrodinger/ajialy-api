import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { CreateSongDto } from './dtos/CreateSong.dto';
import { SongResponseDto } from './dtos/SongResponse.dto';
import { SongService } from './song.service';

@Controller('songs')
export class SongController {
  constructor(private readonly songService: SongService) {}

  @Get()
  async getAllSongs(): Promise<SongResponseDto[]> {
    return this.songService.getAllSongs();
  }

  @Get(':id')
  async getSongById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<SongResponseDto> {
    return this.songService.getSongById(id);
  }

  @Post()
  async saveSong(
    @Body(new ValidationPipe({ transform: true }))
    createSongDto: CreateSongDto,
  ): Promise<SongResponseDto> {
    return this.songService.saveSong(createSongDto);
  }
}
