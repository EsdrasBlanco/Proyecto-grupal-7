import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateDocenteDto } from './dto/create-docente.dto.js';
import { UpdateDocenteDto } from './dto/update.docente.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';

const userSelect = {
  id: true,
  nombres: true,
  apellidos: true,
  ecorreo: true,
  telefono: true,
  rol: true,
  activo: true,
};

@Injectable()
export class DocenteService {
  constructor(private readonly prisma: PrismaService) {}

  private async validarUsuario(userId: number, docenteId?: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`El usuario #${userId} no existe`);
    }
    const existente = await this.prisma.docente.findUnique({
      where: { userId },
    });
    if (existente && existente.id !== docenteId) {
      throw new ConflictException(
        `El usuario #${userId} ya está registrado como docente`,
      );
    }
  }

  async create(dto: CreateDocenteDto) {
    await this.validarUsuario(dto.userId);
    return this.prisma.docente.create({
      data: dto,
      include: { user: { select: userSelect } },
    });
  }

  findAll() {
    return this.prisma.docente.findMany({
      orderBy: { id: 'asc' },
      include: { user: { select: userSelect } },
    });
  }

  async findOne(id: number) {
    const docente = await this.prisma.docente.findUnique({
      where: { id },
      include: { user: { select: userSelect }, cursos: true },
    });
    if (!docente) {
      throw new NotFoundException(`El docente #${id} no existe`);
    }
    return docente;
  }

  async update(id: number, dto: UpdateDocenteDto) {
    await this.findOne(id);
    if (dto.userId !== undefined) {
      await this.validarUsuario(dto.userId, id);
    }
    return this.prisma.docente.update({
      where: { id },
      data: dto,
      include: { user: { select: userSelect } },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.docente.delete({ where: { id } });
  }
}