import { faker } from '@faker-js/faker';
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Artist } from '@prisma/client';
import { plainToClass } from 'class-transformer';
import {
  generateMockArtistWithSongs,
  generateMockPrisma,
} from '../utils/test.utils';
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
    })
      .overrideProvider(PrismaService)
      .useValue(generateMockPrisma())
      .compile();

    artistService = module.get<ArtistService>(ArtistService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('get all artists', () => {
    it('should get all artist entities from the database', async () => {
      await artistService.getAllArtists();

      expect(prismaService.artist.findMany).toHaveBeenCalled();
    });

    it('should return all artist entities converted to dto', async () => {
      const mockedArtists = [generateMockArtistWithSongs()];
      prismaService.artist.findMany = jest
        .fn()
        .mockResolvedValue(mockedArtists);

      const foundArtists = await artistService.getAllArtists();

      expect(foundArtists).toEqual(
        mockedArtists.map((artist) =>
          ArtistResponseDto.fromArtistEntity(artist),
        ),
      );
    });
  });

  describe('save artist', () => {
    const mockedArtist = generateMockArtistWithSongs();

    it('should save the received artist in the database', async () => {
      prismaService.artist.create = jest
        .fn()
        .mockImplementation(async ({ data }: { data: Artist }) =>
          Promise.resolve(generateMockArtistWithSongs(data)),
        );
      const createArtistDto = plainToClass(CreateArtistDto, {
        name: mockedArtist.name,
        image: mockedArtist.image,
      });

      await artistService.saveArtist(createArtistDto);

      expect(prismaService.artist.create).toHaveBeenCalledWith({
        data: createArtistDto.toArtistEntity(),
        include: { songs: { select: { song: true } } },
      });
    });

    it('should return the saved artist response dto', async () => {
      prismaService.artist.create = jest
        .fn()
        .mockImplementation(async ({ data }: { data: Artist }) =>
          Promise.resolve(generateMockArtistWithSongs(data)),
        );
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
      await artistService.getArtistById(randomId);

      expect(prismaService.artist.findUnique).toHaveBeenCalledWith({
        where: { id: randomId },
        include: { songs: { select: { song: true } } },
      });
    });

    it('should return artist entities converted to dto', async () => {
      const mockedArtist = generateMockArtistWithSongs({ id: randomId });
      prismaService.artist.findUnique = jest
        .fn()
        .mockResolvedValue(mockedArtist);

      const foundArtist = await artistService.getArtistById(randomId);

      expect(foundArtist).toEqual(
        ArtistResponseDto.fromArtistEntity(mockedArtist),
      );
    });

    it('should throw Not Found when no artist is found', async () => {
      prismaService.artist.findUnique = jest.fn().mockResolvedValue(undefined);

      await expect(artistService.getArtistById(randomId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
