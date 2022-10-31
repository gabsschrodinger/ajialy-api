import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { plainToClass } from 'class-transformer';
import { PrismaService } from '../prisma.service';
import { CreateSongDto } from './dtos/CreateSong.dto';
import { SongResponseDto } from './dtos/SongResponse.dto';
import { SongController } from './song.controller';
import { SongService } from './song.service';
import { generateMockSong } from '../utils/test.utils';

describe('SongController', () => {
  let songService: SongService;
  let songController: SongController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SongController],
      providers: [SongService, PrismaService],
    }).compile();

    songService = module.get<SongService>(SongService);
    songController = module.get<SongController>(SongController);
  });

  describe('get all songs', () => {
    const mockedSongs = [generateMockSong()];

    it('should return the service response', async () => {
      songService.getAllSongs = jest.fn().mockResolvedValue(mockedSongs);

      const foundSongs = await songController.getAllSongs();

      expect(songService.getAllSongs).toHaveBeenCalled();
      expect(foundSongs).toEqual(mockedSongs);
    });
  });

  describe('get song by id', () => {
    const randomId = faker.datatype.number();
    const mockedSong = generateMockSong({ id: randomId });

    it('should return the service response', async () => {
      songService.getSongById = jest.fn().mockResolvedValue(mockedSong);

      const foundSong = await songController.getSongById(randomId);

      expect(songService.getSongById).toHaveBeenCalledWith(randomId);
      expect(foundSong).toEqual(mockedSong);
    });
  });

  describe('save song', () => {
    const songMock = generateMockSong();
    const createSongRequest = plainToClass(CreateSongDto, {
      name: songMock.name,
      japaneseLyrics: songMock.lyrics_jp,
      englishLyrics: songMock.lyrics_eng,
      portugueseLyrics: songMock.lyrics_por,
      originalLyrics: songMock.original_lyrics,
    });

    it('should return the service response', async () => {
      songService.saveSong = jest
        .fn()
        .mockImplementation(
          async ({
            name,
            artists,
            japaneseLyrics,
            englishLyrics,
            portugueseLyrics,
            originalLyrics,
          }: CreateSongDto) =>
            Promise.resolve(
              plainToClass(SongResponseDto, {
                id: faker.datatype.number(),
                name,
                artists,
                japaneseLyrics,
                englishLyrics,
                portugueseLyrics,
                originalLyrics,
              }),
            ),
        );

      const savedSong = await songController.saveSong(createSongRequest);

      expect(songService.saveSong).toHaveBeenCalledWith(createSongRequest);
      expect(savedSong).toEqual({
        id: expect.any(Number),
        ...createSongRequest,
      });
    });
  });
});
