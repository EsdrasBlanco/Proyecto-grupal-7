// src/matricula/matricula.controller.ts

import { Body, Controller, Delete, Get, Param, Query, ParseIntPipe, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { MatriculaService } from './matricula.service.js';
import { CreateMatriculaDto } from './dto/create-matricula.dto.js';
import { UpdateMatriculaDto } from './dto/update-matricula.dto.js';
import { EstadoMatricula } from '../../generated/prisma/client.js';

@ApiTags('Matrículas')
@Controller('matricula')
export class MatriculaController {
  constructor(private readonly matriculaService: MatriculaService) {}

  @Get()
  @ApiOperation({ summary: 'Listar matrículas con paginación y filtros' })
  @ApiQuery({ name: 'page', required: false, example: 1, description: 'Número de página (por defecto 1)' })
  @ApiQuery({ name: 'limit', required: false, example: 3, description: 'Cantidad por página (por defecto 3)' })
  @ApiQuery({ name: 'estado', required: false, enum: EstadoMatricula, description: 'Filtrar por estado de matrícula' })
  @ApiQuery({ name: 'cursoId', required: false, example: 1, description: 'Filtrar por ID del curso' })
  @ApiQuery({ name: 'buscar', required: false, description: 'Buscar por nombre, apellido o documento del estudiante' })
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
  @ApiParam({ name: 'id', example: 1, description: 'ID de la matrícula' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.matriculaService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Registrar una nueva matrícula' })
  create(@Body() body: CreateMatriculaDto) {
    return this.matriculaService.create(body);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar calificación o estado de una matrícula' })
  @ApiParam({ name: 'id', example: 1, description: 'ID de la matrícula' })
  update(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateMatriculaDto) {
    return this.matriculaService.update(id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una matrícula por ID' })
  @ApiParam({ name: 'id', example: 1, description: 'ID de la matrícula' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.matriculaService.remove(id);
  }
}
