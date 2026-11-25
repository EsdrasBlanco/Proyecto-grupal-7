import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCursoDto } from './dto/create-curso.dto.js';
import { UpdateCursoDto } from './dto/update-curso.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class CursoService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateCursoDto) {
    const docente = await this.prisma.docente.findUnique({
      where: { id: data.docenteId },
    });
    if (!docente) {
      throw new NotFoundException('el docente no existe');
    }

    const aula = await this.prisma.aula.findUnique({
      where: { id: data.aulaId },
    });
    if (!aula) {
      throw new NotFoundException('el aula no existe');
    }

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

  async findOne(id: number) {
    const curso = await this.prisma.curso.findUnique({
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
    if (!curso) {
      throw new NotFoundException(`El curso con id ${id} no existe`);
    }
    return curso;
  }

  async update(id: number, data: UpdateCursoDto) {
    await this.findOne(id);
    return this.prisma.curso.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.curso.delete({
      where: { id },
    });
  }
}
