import { Injectable } from '@nestjs/common';
import { CreateAulaDto } from './dto/create-aula.dto.js';
import { UpdateAulaDto } from './dto/update-aula.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class AulaService {
  constructor(private readonly prisma: PrismaService) {}

  create(createAulaDto: CreateAulaDto) {
    return 'This action adds a new aula';
  }

  findAll() {
    return this.prisma.aula.findMany({
      orderBy: { id: 'asc' },
    });
  }

  findOne(id: number) {
    return this.prisma.aula.findUnique({ where: { id } });
  }

  update(id: number, updateAulaDto: UpdateAulaDto) {
    return `This action updates a #${id} aula`;
  }

  remove(id: number) {
    return `This action removes a #${id} aula`;
  }
}
