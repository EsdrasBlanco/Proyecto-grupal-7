import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class CursoService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: any) {
    return this.prisma.curso.create({ data });
  }

findAll() {
  return this.prisma.curso.findMany({
    orderBy: { id: 'asc' },
    include: {
      docente: {
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
      aula: true,
    },
  });
}

findOne(id: number) {
  return this.prisma.curso.findUnique({
    where: { id },
    include: {
      docente: {
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
      aula: true,
    },
  });
}

  update(id: number, data: any) {
    return this.prisma.curso.update({
      where: { id },
      data,
    });
  }

  remove(id: number) {
    return this.prisma.curso.delete({
      where: { id },
    });
  }
}