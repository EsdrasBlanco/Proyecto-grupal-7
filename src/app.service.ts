import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'API Academia con NestJS';
  }

  getHealth(): { status: string } {
    return { status: 'ok' };
  }
}
