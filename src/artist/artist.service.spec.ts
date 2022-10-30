import { faker } from '@faker-js/faker';
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Artist } from '@prisma/client';
import { plainToClass } from 'class-transformer';
import { generateMockArtist } from '../utils/test.utils';
import { PrismaService } from '../prisma.service';
import { ArtistService } from './artist.service';
import { ArtistResponseDto } from './dtos/ArtistResponse.dto';
import { CreateArtistDto } from './dtos/CreateArtist.dto';

describe('ArtistService', () => {
  let artistService: ArtistService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ArtistService, PrismaService],
    }).compile();

    artistService = module.get<ArtistService>(ArtistService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(artistService).toBeDefined();
  });

  describe('get all artists', () => {
    it('should get all artist entities from the database', async () => {
      prismaService.artist.findMany = jest.fn().mockResolvedValue([]);
      prismaService.song.findMany = jest.fn().mockResolvedValue([]);

      await artistService.getAllArtists();

      expect(prismaService.artist.findMany).toHaveBeenCalled();
    });

    it('should return all artist entities converted to dto', async () => {
      const mockedArtists = [generateMockArtist()];
      prismaService.artist.findMany = jest
        .fn()
        .mockResolvedValue(mockedArtists);
      prismaService.song.findMany = jest.fn().mockResolvedValue([]);

      const foundArtists = await artistService.getAllArtists();

      expect(foundArtists).toEqual(
        mockedArtists.map((artist) => ArtistResponseDto.fromEntites(artist)),
      );
    });
  });

  describe('save artist', () => {
    const mockedArtist = generateMockArtist();

    it('should save the received artist in the database', async () => {
      prismaService.artist.create = jest
        .fn()
        .mockImplementation(async ({ data }: { data: Artist }) =>
          Promise.resolve(data),
        );
      prismaService.song.findMany = jest.fn().mockResolvedValue([]);
      const createArtistDto = plainToClass(CreateArtistDto, {
        name: mockedArtist.name,
        image: mockedArtist.image,
      });

      await artistService.saveArtist(createArtistDto);

      expect(prismaService.artist.create).toHaveBeenCalledWith({
        data: createArtistDto.toArtistEntity(),
      });
    });

    it('should return the saved artist response dto', async () => {
      prismaService.artist.create = jest
        .fn()
        .mockImplementation(async ({ data }: { data: Artist }) =>
          Promise.resolve(data),
        );
      prismaService.song.findMany = jest.fn().mockResolvedValue([]);
      const createArtistDto = plainToClass(CreateArtistDto, {
        name: mockedArtist.name,
        image: mockedArtist.image,
      });

      const savedArtist = await artistService.saveArtist(createArtistDto);

      expect(savedArtist).toEqual(expect.objectContaining(createArtistDto));
    });
  });

  describe('get artist by id', () => {
    const randomId = faker.datatype.number();

    it('should get artist entities from the database', async () => {
      prismaService.artist.findUnique = jest.fn().mockResolvedValue({});
      prismaService.song.findMany = jest.fn().mockResolvedValue([]);

      await artistService.getArtistById(randomId);

      expect(prismaService.artist.findUnique).toHaveBeenCalledWith({
        where: { id: randomId },
      });
    });

    it('should return artist entities converted to dto', async () => {
      const mockedArtist = generateMockArtist({ id: randomId });
      prismaService.artist.findUnique = jest
        .fn()
        .mockResolvedValue(mockedArtist);
      prismaService.song.findMany = jest.fn().mockResolvedValue([]);

      const foundArtist = await artistService.getArtistById(randomId);

      expect(foundArtist).toEqual(ArtistResponseDto.fromEntites(mockedArtist));
    });

    it('should throw Not Found when no artist is found', async () => {
      prismaService.artist.findUnique = jest.fn().mockResolvedValue(undefined);
      prismaService.song.findMany = jest.fn().mockResolvedValue([]);

      await expect(artistService.getArtistById(randomId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
