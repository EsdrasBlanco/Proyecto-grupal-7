// src/matriculas/matriculas.controller.ts

import { Controller, Get } from '@nestjs/common';
import { MatriculaService } from './matricula.service.js';

@Controller('matricula')
export class MatriculaController {
  constructor(private readonly matriculaService: MatriculaService) {}

  @Get()
  findAll() {
    return this.matriculaService.findAll();
  }
}
