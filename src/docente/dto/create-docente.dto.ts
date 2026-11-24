import { Transform, Type } from 'class-transformer';
import { IsInt, IsPositive, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateDocenteDto {
  @IsString()
  @Transform(({ value }) => value?.trim())
  @MinLength(1)
  @MaxLength(100)
  especialidad: string;

  @Type(() => Number)
  @IsInt()
  @IsPositive()
  userId: number;
}