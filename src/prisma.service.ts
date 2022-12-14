import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }

  /**
   * Implementation from harryhorton (https://github.com/prisma/docs/issues/451)
   */
  async clearDatabase(): Promise<void> {
    const models = Reflect.ownKeys(this).filter((key) => key[0] !== '_');

    await Promise.all(
      models.map((modelKey) => {
        try {
          return this[modelKey].deleteMany();
        } catch (e) {
          return;
        }
      }),
    );
  }
}
