import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { hash } from 'bcryptjs';
import { CreateEstudianteDto } from './dto/create-estudiante.dto.js';
import { UpdateEstudianteDto } from './dto/update-estudiante.dto.js';
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
export class EstudianteService {
  constructor(private readonly prisma: PrismaService) {}

  private async validar(
    dto: { userId?: number; documentoIdentidad?: string },
    estudianteId?: number,
  ) {
    if (dto.userId !== undefined) {
      const user = await this.prisma.user.findUnique({
        where: { id: dto.userId },
      });
      if (!user) {
        throw new NotFoundException(`El usuario #${dto.userId} no existe`);
      }
      const porUsuario = await this.prisma.estudiante.findUnique({
        where: { userId: dto.userId },
      });
      if (porUsuario && porUsuario.id !== estudianteId) {
        throw new ConflictException(
          `El usuario #${dto.userId} ya está registrado como estudiante`,
        );
      }
    }
    if (dto.documentoIdentidad !== undefined) {
      const porDocumento = await this.prisma.estudiante.findUnique({
        where: { documentoIdentidad: dto.documentoIdentidad },
      });
      if (porDocumento && porDocumento.id !== estudianteId) {
        throw new ConflictException(
          `El documento ${dto.documentoIdentidad} ya está registrado`,
        );
      }
    }
  }

  async create(dto: CreateEstudianteDto) {
    const { password, ...estudianteData } = dto;
    await this.validar(estudianteData);
    const passwordHash = await hash(password, 10);

    return this.prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: estudianteData.userId },
        data: { password: passwordHash },
      });

      return tx.estudiante.create({
        data: estudianteData,
        include: { user: { select: userSelect } },
      });
    });
  }

  findAll() {
    return this.prisma.estudiante.findMany({
      orderBy: { id: 'asc' },
      include: { user: { select: userSelect } },
    });
  }

  async findOne(id: number) {
    const estudiante = await this.prisma.estudiante.findUnique({
      where: { id },
      include: { user: { select: userSelect }, matriculas: true },
    });
    if (!estudiante) {
      throw new NotFoundException(`El estudiante #${id} no existe`);
    }
    return estudiante;
  }

  async update(id: number, dto: UpdateEstudianteDto) {
    const estudiante = await this.findOne(id);
    const { password, ...estudianteData } = dto;
    const targetUserId = estudianteData.userId ?? estudiante.userId;

    await this.validar(estudianteData, id);
    const passwordHash = password ? await hash(password, 10) : undefined;

    return this.prisma.$transaction(async (tx) => {
      if (passwordHash) {
        await tx.user.update({
          where: { id: targetUserId },
          data: { password: passwordHash },
        });
      }

      return tx.estudiante.update({
        where: { id },
        data: estudianteData,
        include: { user: { select: userSelect } },
      });
    });
  }

  async remove(id: number) {
    const estudiante = await this.findOne(id);
    return this.prisma.user.update({
      where: { id: estudiante.userId },
      data: { activo: false },
      select: userSelect,
    });
  }

  async deleteGozu(id: number) {
    const estudiante = await this.findOne(id);
    return this.prisma.user.delete({
      where: { id: estudiante.userId },
      select: userSelect,
    });
  }
}
