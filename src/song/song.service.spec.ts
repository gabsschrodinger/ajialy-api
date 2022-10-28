import { faker } from '@faker-js/faker';
import { NotFoundException } from '@nestjs/common/exceptions';
import { Test, TestingModule } from '@nestjs/testing';
import { Song } from '@prisma/client';
import { plainToClass } from 'class-transformer';
import { PrismaService } from '../prisma.service';
import { CreateSongDto } from './dtos/CreateSong.dto';
import { SongDto } from './song.dtos';
import { SongService } from './song.service';
import { generateMockSong } from './song.test.utils';

describe('SongService', () => {
  let prismaService: PrismaService;
  let songService: SongService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SongService, PrismaService],
    }).compile();

    songService = module.get<SongService>(SongService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(songService).toBeDefined();
  });

  describe('get all songs', () => {
    it('should get all song entities from the database', async () => {
      prismaService.song.findMany = jest.fn().mockResolvedValue([]);

      await songService.getAllSongs();

      expect(prismaService.song.findMany).toHaveBeenCalled();
    });

    it('should return all song entities converted to dto', async () => {
      const mockedSongs = [generateMockSong()];
      prismaService.song.findMany = jest.fn().mockResolvedValue(mockedSongs);

      const foundSongs = await songService.getAllSongs();

      expect(foundSongs).toEqual(
        mockedSongs.map((song) => SongDto.fromSongEntity(song)),
      );
    });
  });

  describe('save song', () => {
    const mockedSong = generateMockSong();

    it('should save the received song in the database', async () => {
      prismaService.song.create = jest
        .fn()
        .mockImplementation(async ({ data }: { data: Song }) =>
          Promise.resolve(data),
        );
      const createSongDto = plainToClass(CreateSongDto, {
        name: mockedSong.name,
        artists: mockedSong.artists,
        japaneseLyrics: mockedSong.lyrics_jp,
        englishLyrics: mockedSong.lyrics_eng,
        portugueseLyrics: mockedSong.lyrics_por,
        originalLyrics: mockedSong.original_lyrics,
      });

      await songService.saveSong(createSongDto);

      expect(prismaService.song.create).toHaveBeenCalledWith({
        data: createSongDto.toSongEntity(),
      });
    });

    it('should return the saved song response dto', async () => {
      prismaService.song.create = jest
        .fn()
        .mockImplementation(async ({ data }: { data: Song }) =>
          Promise.resolve(data),
        );
      const createSongDto = plainToClass(CreateSongDto, {
        name: mockedSong.name,
        artists: mockedSong.artists,
        japaneseLyrics: mockedSong.lyrics_jp,
        englishLyrics: mockedSong.lyrics_eng,
        portugueseLyrics: mockedSong.lyrics_por,
        originalLyrics: mockedSong.original_lyrics,
      });

      const savedSong = await songService.saveSong(createSongDto);

      expect(savedSong).toEqual(createSongDto);
    });
  });

  describe('get song by id', () => {
    const randomId = faker.datatype.number();

    it('should get song entities from the database', async () => {
      prismaService.song.findUnique = jest.fn().mockResolvedValue({});

      await songService.getSongById(randomId);

      expect(prismaService.song.findUnique).toHaveBeenCalledWith({
        where: { id: randomId },
      });
    });

    it('should return song entities converted to dto', async () => {
      const mockedSong = generateMockSong({ id: randomId });
      prismaService.song.findUnique = jest.fn().mockResolvedValue(mockedSong);

      const foundSong = await songService.getSongById(randomId);

      expect(foundSong).toEqual(SongDto.fromSongEntity(mockedSong));
    });

    it('should throw Not Found when no song is found', async () => {
      prismaService.song.findUnique = jest.fn().mockResolvedValue(undefined);

      await expect(songService.getSongById(randomId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
