import { Artist, Song } from '@prisma/client';

export type ArtistWithSongs = Artist & { songs: { song: Song }[] };
