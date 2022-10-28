/*
  Warnings:

  - Added the required column `original_lyrics` to the `Song` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Song" ADD COLUMN     "original_lyrics" TEXT NOT NULL;
