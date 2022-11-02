import { Controller, Delete } from '@nestjs/common';
import { E2eService } from './e2e.service';

@Controller('e2e')
export class E2eController {
  constructor(private readonly e2eService: E2eService) {}

  @Delete()
  async clearDatabase(): Promise<void> {
    await this.e2eService.clearDatabase();
  }
}
