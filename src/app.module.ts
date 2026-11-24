// src/app.module.ts

import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { AulaModule } from './aula/aula.module.js';
import { MatriculaModule } from './matricula/matricula.module.js';
import { CursoModule } from './curso/curso.module.js';
import { UserModule } from './user/user.module.js';
import { AuthModule } from './auth/auth.module.js';
import { EstudianteModule } from './estudiante/estudiante.module.js';
import { DocenteModule } from './docente/docente.module.js';
import { MatriculaModule } from './matricula/matricula.module.js';

@Module({
  imports: [
    PrismaModule,
    AulaModule,
    MatriculaModule,
    CursoModule,
    UserModule,
    Authmodule,
    EstudianteModule,
    DocenteModule,
    MatriculaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}