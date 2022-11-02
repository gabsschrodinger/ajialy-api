import { Test, TestingModule } from '@nestjs/testing';
import { generateMockPrisma } from '../utils/test.utils';
import { PrismaService } from '../prisma.service';
import { E2eController } from './e2e.controller';
import { E2eService } from './e2e.service';

describe('E2eController', () => {
  let e2eController: E2eController;
  let e2eService: E2eService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [E2eController],
      providers: [E2eService, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(generateMockPrisma())
      .compile();

    e2eController = module.get<E2eController>(E2eController);
    e2eService = module.get<E2eService>(E2eService);
  });

  describe('Clear database', () => {
    it('should clear database using the e2e service', async () => {
      e2eService.clearDatabase = jest.fn();

      await e2eController.clearDatabase();

      expect(e2eService.clearDatabase).toHaveBeenCalled();
    });
  });
});
