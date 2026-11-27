import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { hash } from 'bcryptjs';
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

  async create(data: CreateDocenteDto) {
    const { password, ...docenteData } = data;
    await this.validarUsuario(docenteData.userId);
    const passwordHash = await hash(password, 10);

    return this.prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: docenteData.userId },
        data: { password: passwordHash },
      });

      return tx.docente.create({
        data: docenteData,
        include: { user: { select: userSelect } },
      });
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

  async update(id: number, data: UpdateDocenteDto) {
    const docente = await this.findOne(id);
    const { password, ...docenteData } = data;
    const targetUserId = docenteData.userId ?? docente.userId;

    if (docenteData.userId !== undefined) {
      await this.validarUsuario(docenteData.userId, id);
    }

    const passwordHash = password ? await hash(password, 10) : undefined;

    return this.prisma.$transaction(async (tx) => {
      if (passwordHash) {
        await tx.user.update({
          where: { id: targetUserId },
          data: { password: passwordHash },
        });
      }

      return tx.docente.update({
        where: { id },
        data: docenteData,
        include: { user: { select: userSelect } },
      });
    });
  }

  async remove(id: number) {
    const docente = await this.findOne(id);
    return this.prisma.user.update({
      where: { id: docente.userId },
      data: { activo: false },
      select: userSelect,
    });
  }

  async deleteGozu(id: number) {
    const docente = await this.findOne(id);
    return this.prisma.user.delete({
      where: { id: docente.userId },
      select: userSelect,
    });
  }
}