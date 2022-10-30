import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { plainToClass } from 'class-transformer';
import { PrismaService } from '../prisma.service';
import { generateMockArtist } from '../utils/test.utils';
import { ArtistController } from './artist.controller';
import { ArtistService } from './artist.service';
import { ArtistResponseDto } from './dtos/ArtistResponse.dto';
import { CreateArtistDto } from './dtos/CreateArtist.dto';

describe('ArtistController', () => {
  let artistController: ArtistController;
  let artistService: ArtistService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArtistController],
      providers: [ArtistService, PrismaService],
    }).compile();

    artistController = module.get<ArtistController>(ArtistController);
    artistService = module.get<ArtistService>(ArtistService);
  });

  it('should be defined', () => {
    expect(artistController).toBeDefined();
  });

  describe('get all artists', () => {
    const mockedArtists = [generateMockArtist()];

    it('should return the service response', async () => {
      artistService.getAllArtists = jest.fn().mockResolvedValue(mockedArtists);

      const foundArtists = await artistController.getAllArtists();

      expect(artistService.getAllArtists).toHaveBeenCalled();
      expect(foundArtists).toEqual(mockedArtists);
    });
  });

  describe('get artist by id', () => {
    const randomId = faker.datatype.number();
    const mockedArtist = generateMockArtist({ id: randomId });

    it('should return the service response', async () => {
      artistService.getArtistById = jest.fn().mockResolvedValue(mockedArtist);

      const foundArtist = await artistController.getArtistById(randomId);

      expect(artistService.getArtistById).toHaveBeenCalledWith(randomId);
      expect(foundArtist).toEqual(mockedArtist);
    });
  });

  describe('save artist', () => {
    const artistMock = generateMockArtist();
    const createArtistRequest = plainToClass(CreateArtistDto, {
      name: artistMock.name,
      image: artistMock.image,
    });

    it('should return the service response', async () => {
      artistService.saveArtist = jest
        .fn()
        .mockImplementation(async ({ name, image }: CreateArtistDto) =>
          Promise.resolve(
            plainToClass(ArtistResponseDto, {
              id: faker.datatype.number(),
              name,
              image,
            }),
          ),
        );

      const savedArtist = await artistController.saveArtist(
        createArtistRequest,
      );

      expect(artistService.saveArtist).toHaveBeenCalledWith(
        createArtistRequest,
      );
      expect(savedArtist).toEqual({
        id: expect.any(Number),
        ...createArtistRequest,
      });
    });
  });
});
