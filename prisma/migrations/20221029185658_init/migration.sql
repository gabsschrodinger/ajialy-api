/*
  Warnings:

  - You are about to drop the column `artists` on the `Song` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Song" DROP COLUMN "artists";

-- CreateTable
CREATE TABLE "Artist" (
    "id" SERIAL NOT NULL,
    "image" TEXT NOT NULL,

    CONSTRAINT "Artist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArtistsOnSongs" (
    "song_id" INTEGER NOT NULL,
    "artist_id" INTEGER NOT NULL,

    CONSTRAINT "ArtistsOnSongs_pkey" PRIMARY KEY ("song_id","artist_id")
);

-- AddForeignKey
ALTER TABLE "ArtistsOnSongs" ADD CONSTRAINT "ArtistsOnSongs_song_id_fkey" FOREIGN KEY ("song_id") REFERENCES "Song"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArtistsOnSongs" ADD CONSTRAINT "ArtistsOnSongs_artist_id_fkey" FOREIGN KEY ("artist_id") REFERENCES "Artist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
