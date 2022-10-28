import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { Song } from '@prisma/client';
import { PrismaService } from '../prisma.service';
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
      const songDto = SongDto.fromSongEntity(mockedSong);

      await songService.saveSong(songDto);

      expect(prismaService.song.create).toHaveBeenCalledWith({
        data: songDto.toSongEntity(),
      });
    });

    it('should return the saved song dto', async () => {
      prismaService.song.create = jest
        .fn()
        .mockImplementation(async ({ data }: { data: Song }) =>
          Promise.resolve(data),
        );
      const songDto = SongDto.fromSongEntity(mockedSong);

      const savedSong = await songService.saveSong(songDto);

      expect(savedSong).toEqual(songDto);
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
  });
});
