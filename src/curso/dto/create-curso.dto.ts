import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateCursoDto {
  @ApiProperty({ example: 'Backend con Node.js y Prisma' })
  @IsString()
  @IsNotEmpty()
  nombreCurso!: string;

  @ApiPropertyOptional({
    example: 'APIs REST con TypeScript',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiProperty({ example: 48 })
  @IsInt()
  @IsPositive()
  duracionHoras!: number;

  @ApiProperty({ example: 'Lun y Mié 18:00 - 21:00' })
  @IsString()
  @IsNotEmpty()
  horario!: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  @IsPositive()
  docenteId!: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  @IsPositive()
  aulaId!: number;
}
