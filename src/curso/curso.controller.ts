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
import { CursoService } from './curso.service.js';

@Controller('curso')
export class CursoController {
  constructor(private readonly cursoService: CursoService) {}

  @Get()
  findAll() {
    return this.cursoService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const curso = await this.cursoService.findOne(+id);
    if (!curso) {
      throw new NotFoundException(`El curso con id ${id} no existe`);
    }
    return curso;
  }

  @Post()
  create(@Body() body: any) {
    return this.cursoService.create(body);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    const curso = await this.cursoService.findOne(+id);
    if (!curso) {
      throw new NotFoundException(`El curso con id ${id} no existe`);
    }
    return this.cursoService.update(+id, body);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const curso = await this.cursoService.findOne(+id);
    if (!curso) {
      throw new NotFoundException(`El curso con id ${id} no existe`);
    }
    return this.cursoService.remove(+id);
  }
}