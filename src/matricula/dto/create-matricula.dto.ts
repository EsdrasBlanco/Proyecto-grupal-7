//  src/matriculas/dto/create-matricula.dto.ts

import { IsInt, IsPositive } from 'class-validator';

export class CreateMatriculaDto {
  @IsInt({ message: 'El estudianteId debe ser un número entero' })
  @IsPositive()
  estudianteId: number;

  @IsInt({ message: 'El cursoId debe ser un número entero' })
  @IsPositive()
  cursoId: number;
}
