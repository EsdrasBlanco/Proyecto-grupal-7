import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateAulaDto {
  @ApiProperty({ example: 'Aula 101' })
  @IsString()
  @IsNotEmpty()
  nombreAula!: string;

  @ApiProperty({ example: 30 })
  @IsInt()
  @IsPositive()
  capacidad!: number;

  @ApiPropertyOptional({
    example: 'Piso 1',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  ubicacion?: string;
}
