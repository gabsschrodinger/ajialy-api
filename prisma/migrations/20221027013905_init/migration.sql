/*
  Warnings:

  - Added the required column `lyrics_jp` to the `Song` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Song" ADD COLUMN     "lyrics_jp" TEXT NOT NULL;
