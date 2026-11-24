import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class AulaService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: any) {
    return this.prisma.aula.create({ data });
  }

findAll() {
  return this.prisma.aula.findMany({
    orderBy: { id: 'asc' },
    include: {
      cursos: true,
    },
  });
}

findOne(id: number) {
  return this.prisma.aula.findUnique({
    where: { id },
    include: {
      cursos: true,
    },
  });
}

  update(id: number, data: any) {
    return this.prisma.aula.update({
      where: { id },
      data,
    });
  }

  remove(id: number) {
    return this.prisma.aula.delete({
      where: { id },
    });
  }
}