import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { UpdateUserStatusDto } from './dto/update-user-status.dto.js';
import { hash } from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  // Obtener todos los usuarios
  async findAll() {
    return this.prisma.user.findMany({
      orderBy: { id: 'asc' },
      select: {
        id: true,
        nombres: true,
        apellidos: true,
        ecorreo: true,
        telefono: true,
        rol: true,
        activo: true,
        createdAt: true,
      },
    });
  }

  // Crear usuario
  async create(dto: CreateUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { ecorreo: dto.ecorreo },
    });

    if (existingUser) {
      throw new ConflictException('El correo ya está registrado');
    }

    const hashedPassword = await hash(dto.password, 10);

    return this.prisma.user.create({
      data: {
        nombres: dto.nombres,
        apellidos: dto.apellidos,
        ecorreo: dto.ecorreo,
        password: hashedPassword,
        telefono: dto.telefono,
      },
      select: {
        id: true,
        nombres: true,
        apellidos: true,
        ecorreo: true,
        telefono: true,
        rol: true,
        activo: true,
        createdAt: true,
      },
    });
  }

  // Obtener usuario por ID
  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        nombres: true,
        apellidos: true,
        ecorreo: true,
        telefono: true,
        rol: true,
        activo: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return user;
  }

  // Actualizar usuario
  async update(id: number, dto: UpdateUserDto) {
    await this.findOne(id);

    if (dto.ecorreo) {
      const existingUser = await this.prisma.user.findUnique({
        where: { ecorreo: dto.ecorreo },
      });

      if (existingUser && existingUser.id !== id) {
        throw new ConflictException('El correo ya está registrado');
      }
    }

    return this.prisma.user.update({
      where: { id },
      data: dto,
      select: {
        id: true,
        nombres: true,
        apellidos: true,
        ecorreo: true,
        telefono: true,
        rol: true,
        activo: true,
        createdAt: true,
      },
    });
  }

  // Cambiar estado del usuario
  async updateStatus(id: number, dto: UpdateUserStatusDto) {
    await this.findOne(id);

    return this.prisma.user.update({
      where: { id },
      data: { activo: dto.activo },
      select: {
        id: true,
        nombres: true,
        apellidos: true,
        ecorreo: true,
        telefono: true,
        rol: true,
        activo: true,
        createdAt: true,
      },
    });
  }
}