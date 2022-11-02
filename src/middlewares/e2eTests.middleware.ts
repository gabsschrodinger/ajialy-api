import { Injectable, NestMiddleware, NotFoundException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class E2eTestsMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (process.env.ENVIRONMENT !== 'e2e') {
      throw new NotFoundException();
    }

    next();
  }
}
