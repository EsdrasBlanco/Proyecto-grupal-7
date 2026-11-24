//  src/matriculas/dto/update-matricula.dto.ts

import { IsEnum, IsNumber, IsOptional, Max, Min } from 'class-validator';
import { EstadoMatricula } from '../../../generated/prisma/client.js';

export class UpdateMatriculaDto {
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'La calificación debe tener máximo 2 decimales' })
  @Min(0, { message: 'La nota mínima es 0' })
  @Max(20, { message: 'La nota máxima es 20' })
  calificacionFinal?: number;

  @IsOptional()
  @IsEnum(EstadoMatricula, {
    message: 'Estado inválido. Valores permitidos: INSCRITO, APROBADO, REPROBADO, RETIRADO',
  })
  estado?: EstadoMatricula;
}
