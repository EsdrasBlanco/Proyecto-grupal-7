import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @MinLength(1)
  @MaxLength(100)
  nombres?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @MinLength(1)
  @MaxLength(100)
  apellidos?: string;

  @IsOptional()
  @IsEmail()
  @Transform(({ value }) => value?.trim().toLowerCase())
  @MaxLength(100)
  ecorreo?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @MaxLength(20)
  telefono?: string | null;
}