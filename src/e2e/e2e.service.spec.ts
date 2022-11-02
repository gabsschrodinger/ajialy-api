import { Test, TestingModule } from '@nestjs/testing';
import { generateMockPrisma } from '../utils/test.utils';
import { PrismaService } from '../prisma.service';
import { E2eService } from './e2e.service';

describe('E2eService', () => {
  let e2eService: E2eService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [E2eService, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(generateMockPrisma())
      .compile();

    prismaService = module.get<PrismaService>(PrismaService);
    e2eService = module.get<E2eService>(E2eService);
  });

  describe('clear database', () => {
    it('should clear database', async () => {
      await e2eService.clearDatabase();

      expect(prismaService.clearDatabase).toHaveBeenCalled();
    });
  });
});
