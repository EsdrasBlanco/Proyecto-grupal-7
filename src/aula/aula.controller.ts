import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  NotFoundException,
} from '@nestjs/common';
import { AulaService } from './aula.service.js';

@Controller('aula')
export class AulaController {
  constructor(private readonly aulaService: AulaService) {}

  @Get()
  findAll() {
    return this.aulaService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const aula = await this.aulaService.findOne(+id);
    if (!aula) {
      throw new NotFoundException(`El aula con id ${id} no existe`);
    }
    return aula;
  }

  @Post()
  create(@Body() body: any) {
    return this.aulaService.create(body);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    const aula = await this.aulaService.findOne(+id);
    if (!aula) {
      throw new NotFoundException(`El aula con id ${id} no existe`);
    }
    return this.aulaService.update(+id, body);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const aula = await this.aulaService.findOne(+id);
    if (!aula) {
      throw new NotFoundException(`El aula con id ${id} no existe`);
    }
    return this.aulaService.remove(+id);
  }
}