import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class E2eService {
  constructor(private readonly prisma: PrismaService) {}

  async clearDatabase(): Promise<void> {
    await this.prisma.clearDatabase();
  }
}
