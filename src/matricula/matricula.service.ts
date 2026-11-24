// src/matriculas/matriculas.service.ts

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class MatriculaService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.matricula.findMany({
      include: {
        estudiante: {
          include: {
            user: {
              select: {
                nombres: true,
                apellidos: true,
                ecorreo: true,
              },
            },
          },
        },
        curso: {
          select: {
            nombreCurso: true,
            horario: true,
          },
        },
      },
      orderBy: { id: 'asc' },
    });
  }
}
