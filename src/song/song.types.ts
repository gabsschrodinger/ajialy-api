import { Artist, Song } from '@prisma/client';

export type SongWithArtists = Song & { artists: { artist: Artist }[] };
