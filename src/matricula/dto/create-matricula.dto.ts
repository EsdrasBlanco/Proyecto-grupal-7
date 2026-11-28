//  src/matriculas/dto/create-matricula.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive } from 'class-validator';

export class CreateMatriculaDto {
  @ApiProperty({ example: 1, description: 'ID del estudiante a matricular' })
  @IsInt({ message: 'El estudianteId debe ser un número entero' })
  @IsPositive()
  estudianteId: number;

  @ApiProperty({ example: 1, description: 'ID del curso en el que se matricula' })
  @IsInt({ message: 'El cursoId debe ser un número entero' })
  @IsPositive()
  cursoId: number;
}