import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { AulaModule } from './aula/aula.module.js';
import { UserModule } from './user/user.module.js';

@Module({
  imports: [PrismaModule, AulaModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
