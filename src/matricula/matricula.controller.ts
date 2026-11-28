// src/matricula/matricula.controller.ts

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { MatriculaService } from './matricula.service.js';
import { CreateMatriculaDto } from './dto/create-matricula.dto.js';
import { UpdateMatriculaDto } from './dto/update-matricula.dto.js';
import { EstadoMatricula } from '../../generated/prisma/client.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';

@ApiTags('Matrículas')
@ApiBearerAuth()
@Controller('matricula')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MatriculaController {
  constructor(private readonly matriculaService: MatriculaService) {}

  @Get()
  @ApiOperation({ summary: 'Listar matrículas con paginación y filtros' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 3 })
  @ApiQuery({ name: 'estado', required: false, enum: EstadoMatricula })
  @ApiQuery({ name: 'cursoId', required: false, example: 1 })
  @ApiQuery({ name: 'buscar', required: false })
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('estado') estado?: string,
    @Query('cursoId') cursoId?: string,
    @Query('buscar') buscar?: string,
  ) {
    return this.matriculaService.findAll({
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 3,
      estado: estado?.toUpperCase(),
      cursoId: cursoId ? Number(cursoId) : undefined,
      buscar: buscar?.trim(),
    });
  }

  @Get('reporte-aulas')
  @ApiOperation({ summary: 'Obtener reporte de ocupación de aulas por curso' })
  getReporteAulas() {
    return this.matriculaService.getReporteAulas();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener detalle de una matrícula por ID' })
  @ApiParam({ name: 'id', example: 1 })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.matriculaService.findOne(id);
  }

  @Post()
  @Roles('ESTUDIANTE', 'DIRECTOR')
  @ApiOperation({ summary: 'Registrar una nueva matrícula' })
  create(@Body() body: CreateMatriculaDto) {
    return this.matriculaService.create(body);
  }

  @Patch(':id')
  @Roles('DOCENTE', 'DIRECTOR')
  @ApiOperation({ summary: 'Actualizar calificación o estado de una matrícula' })
  @ApiParam({ name: 'id', example: 1 })
  update(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateMatriculaDto) {
    return this.matriculaService.update(id, body);
  }

  @Delete(':id')
  @Roles('DIRECTOR')
  @ApiOperation({ summary: 'Eliminar una matrícula por ID' })
  @ApiParam({ name: 'id', example: 1 })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.matriculaService.remove(id);
  }
}
