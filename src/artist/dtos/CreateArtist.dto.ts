import { Artist } from '@prisma/client';
import { IsString } from 'class-validator';

export class CreateArtistDto {
  @IsString()
  name: string;

  @IsString()
  image: string;

  toArtistEntity(): Artist {
    return {
      id: undefined,
      name: this.name,
      image: this.image,
    };
  }
}
