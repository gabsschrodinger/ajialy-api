import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma.service';
import { SongController } from './song.controller';
import { SongDto } from './song.dtos';
import { SongService } from './song.service';
import { generateMockSong } from './song.test.utils';

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

  it('should be defined', () => {
    expect(songController).toBeDefined();
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

  describe('save song', () => {
    const mockedSongDto = SongDto.fromEntity(generateMockSong());

    it('should return the service response', async () => {
      songService.saveSong = jest
        .fn()
        .mockImplementation(async (song: SongDto) => Promise.resolve(song));

      const savedSong = await songController.saveSong(mockedSongDto);

      expect(songService.saveSong).toHaveBeenCalledWith(mockedSongDto);
      expect(savedSong).toEqual(mockedSongDto);
    });
  });
});
