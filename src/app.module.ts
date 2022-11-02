import { Module } from '@nestjs/common';
import { SongModule } from './song/song.module';
import { ArtistModule } from './artist/artist.module';
import { E2eModule } from './e2e/e2e.module';

@Module({
  imports: [SongModule, ArtistModule, E2eModule],
})
export class AppModule {}
