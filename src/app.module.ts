// src/app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { AulaModule } from './aula/aula.module.js';
// matriculas
import { MatriculaModule } from './matricula/matricula.module.js'; // Ajusta si tu carpeta es src/matricula

@Module({
  imports: [PrismaModule, AulaModule, MatriculaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
