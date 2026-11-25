import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateAulaDto } from './dto/create-aula.dto.js';
import { UpdateAulaDto } from './dto/update-aula.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class AulaService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateAulaDto) {
    const aula = await this.prisma.aula.findUnique({
      where: { nombreAula: data.nombreAula },
    });
    if (aula) {
      throw new BadRequestException('El nombre de esta aula ya existe');
    }
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

  async findOne(id: number) {
    const aula = await this.prisma.aula.findUnique({
      where: { id },
      include: {
        cursos: true,
      },
    });
    if (!aula) {
      throw new NotFoundException(`El aula con id ${id} no existe`);
    }
    return aula;
  }

  async update(id: number, data: UpdateAulaDto) {
    await this.findOne(id);
    return this.prisma.aula.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.aula.delete({
      where: { id },
    });
  }
}
