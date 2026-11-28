// src/matricula/dto/update-matricula.dto.ts

import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, Max, Min } from 'class-validator';
import { EstadoMatricula } from '../../../generated/prisma/client.js';

export class UpdateMatriculaDto {
  @ApiPropertyOptional({
    example: 16.5,
    minimum: 0,
    maximum: 20,
    description: 'Calificación final del estudiante (0 a 20, máximo 2 decimales)',
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'La calificación debe tener máximo 2 decimales' })
  @Min(0, { message: 'La nota mínima es 0' })
  @Max(20, { message: 'La nota máxima es 20' })
  calificacionFinal?: number;

  @ApiPropertyOptional({
    enum: EstadoMatricula,
    example: EstadoMatricula.APROBADO,
    description: 'Estado actual de la matrícula',
  })
  @IsOptional()
  @IsEnum(EstadoMatricula, {
    message: 'Estado inválido. Valores permitidos: INSCRITO, APROBADO, REPROBADO, RETIRADO',
  })
  estado?: EstadoMatricula;
}
