import { faker } from '@faker-js/faker';
import { NotFoundException } from '@nestjs/common/exceptions';
import { Test, TestingModule } from '@nestjs/testing';
import { Song } from '@prisma/client';
import { plainToClass } from 'class-transformer';
import { PrismaService } from '../prisma.service';
import { CreateSongDto } from './dtos/CreateSong.dto';
import { SongResponseDto } from './dtos/SongResponse.dto';
import { SongService } from './song.service';
import {
  generateMockPrisma,
  generateMockSong,
  generateMockSongWithArtists,
} from '../utils/test.utils';

describe('SongService', () => {
  let prismaService: PrismaService;
  let songService: SongService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SongService, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(generateMockPrisma())
      .compile();

    songService = module.get<SongService>(SongService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('get all songs', () => {
    it('should get all song entities from the database', async () => {
      await songService.getAllSongs();

      expect(prismaService.song.findMany).toHaveBeenCalled();
    });

    it('should return all song entities converted to dto', async () => {
      const mockedSongs = [generateMockSongWithArtists()];
      prismaService.song.findMany = jest.fn().mockResolvedValue(mockedSongs);

      const foundSongs = await songService.getAllSongs();

      expect(foundSongs).toEqual(
        mockedSongs.map((song) => SongResponseDto.fromSongEntity(song)),
      );
    });
  });

  describe('save song', () => {
    const mockedSong = generateMockSong();

    it('should save the received song in the database', async () => {
      prismaService.song.create = jest
        .fn()
        .mockImplementation(async ({ data }: { data: Song }) =>
          Promise.resolve(
            generateMockSongWithArtists({
              id: data.id,
              name: data.name,
              lyrics_eng: data.lyrics_eng,
              lyrics_por: data.lyrics_por,
              lyrics_jp: data.lyrics_jp,
              original_lyrics: data.original_lyrics,
              artists: [],
            }),
          ),
        );
      const createSongDto = plainToClass(CreateSongDto, {
        name: mockedSong.name,
        artistIds: [],
        japaneseLyrics: mockedSong.lyrics_jp,
        englishLyrics: mockedSong.lyrics_eng,
        portugueseLyrics: mockedSong.lyrics_por,
        originalLyrics: mockedSong.original_lyrics,
      });

      await songService.saveSong(createSongDto);

      expect(prismaService.song.create).toHaveBeenCalledWith({
        data: expect.objectContaining(createSongDto.toSongEntity()),
        include: { artists: { select: { artist: true } } },
      });
    });

    it('should return the saved song response dto', async () => {
      prismaService.song.create = jest
        .fn()
        .mockImplementation(async ({ data }: { data: Song }) =>
          Promise.resolve(
            generateMockSongWithArtists({
              id: data.id,
              name: data.name,
              lyrics_eng: data.lyrics_eng,
              lyrics_por: data.lyrics_por,
              lyrics_jp: data.lyrics_jp,
              original_lyrics: data.original_lyrics,
              artists: [],
            }),
          ),
        );
      const createSongDto = plainToClass(CreateSongDto, {
        name: mockedSong.name,
        artistIds: [],
        japaneseLyrics: mockedSong.lyrics_jp,
        englishLyrics: mockedSong.lyrics_eng,
        portugueseLyrics: mockedSong.lyrics_por,
        originalLyrics: mockedSong.original_lyrics,
      });

      const savedSong = await songService.saveSong(createSongDto);

      expect(savedSong).toEqual({
        ...createSongDto,
        artists: [],
        artistIds: undefined,
      });
    });
  });

  describe('get song by id', () => {
    const randomId = faker.datatype.number();

    it('should get song entities from the database', async () => {
      await songService.getSongById(randomId);

      expect(prismaService.song.findUnique).toHaveBeenCalledWith({
        where: { id: randomId },
        include: { artists: { select: { artist: true } } },
      });
    });

    it('should return song entities converted to dto', async () => {
      const mockedSong = generateMockSongWithArtists({ id: randomId });
      prismaService.song.findUnique = jest.fn().mockResolvedValue(mockedSong);

      const foundSong = await songService.getSongById(randomId);

      expect(foundSong).toEqual(
        expect.objectContaining(SongResponseDto.fromSongEntity(mockedSong)),
      );
    });

    it('should throw Not Found when no song is found', async () => {
      prismaService.song.findUnique = jest.fn().mockResolvedValue(undefined);

      await expect(songService.getSongById(randomId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
