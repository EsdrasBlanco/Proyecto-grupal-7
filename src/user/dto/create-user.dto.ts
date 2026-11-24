import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Transform(({ value }) => value?.trim())
  @MinLength(1)
  @MaxLength(100)
  nombres: string;

  @IsString()
  @Transform(({ value }) => value?.trim())
  @MinLength(1)
  @MaxLength(100)
  apellidos: string;

  @IsEmail()
  @Transform(({ value }) => value?.trim().toLowerCase())
  @MaxLength(100)
  ecorreo: string;

  @IsString()
  @MinLength(8)
  @MaxLength(72)
  password: string;

  @IsString()
  @Transform(({ value }) => value?.trim())
  @MaxLength(20)
  telefono?: string;
}