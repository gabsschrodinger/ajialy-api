import { Module } from '@nestjs/common';
import { SongModule } from './song/song.module';
import { ArtistModule } from './artist/artist.module';

@Module({
  imports: [SongModule, ArtistModule],
})
export class AppModule {}
