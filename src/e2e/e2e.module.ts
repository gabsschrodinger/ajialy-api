import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { E2eService } from './e2e.service';
import { E2eController } from './e2e.controller';
import { E2eTestsMiddleware } from '../middlewares/e2eTests.middleware';
import { PrismaService } from '../prisma.service';

@Module({
  providers: [E2eService, PrismaService],
  controllers: [E2eController],
})
export class E2eModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(E2eTestsMiddleware).forRoutes(E2eController);
  }
}
