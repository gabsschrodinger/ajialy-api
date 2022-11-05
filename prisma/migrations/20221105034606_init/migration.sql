-- DropForeignKey
ALTER TABLE "ArtistsOnSongs" DROP CONSTRAINT "ArtistsOnSongs_artist_id_fkey";

-- DropForeignKey
ALTER TABLE "ArtistsOnSongs" DROP CONSTRAINT "ArtistsOnSongs_song_id_fkey";

-- AddForeignKey
ALTER TABLE "ArtistsOnSongs" ADD CONSTRAINT "ArtistsOnSongs_song_id_fkey" FOREIGN KEY ("song_id") REFERENCES "Song"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArtistsOnSongs" ADD CONSTRAINT "ArtistsOnSongs_artist_id_fkey" FOREIGN KEY ("artist_id") REFERENCES "Artist"("id") ON DELETE CASCADE ON UPDATE CASCADE;
