// src/matriculas/matriculas.controller.ts

import {  Body, Controller, Delete, Get, Param, Query, ParseIntPipe, Post, Put  } from '@nestjs/common';
import { MatriculaService } from './matricula.service.js';

@Controller('matricula')
export class MatriculaController {
  constructor(private readonly matriculaService: MatriculaService) {}

  @Get()
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
  getReporteAulas() {
    return this.matriculaService.getReporteAulas();
  }


  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.matriculaService.findOne(id);
  }

  @Post()
  create(@Body() body: any) {
    return this.matriculaService.create(body);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    return this.matriculaService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.matriculaService.remove(id);
  }
}

