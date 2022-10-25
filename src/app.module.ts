import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SongService } from './song/song.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, SongService],
})
export class AppModule {}
