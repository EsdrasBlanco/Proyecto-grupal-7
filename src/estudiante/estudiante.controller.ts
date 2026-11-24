import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { EstudianteService } from './estudiante.service.js';
import { CreateEstudianteDto } from './dto/create-estudiante.dto.js';
import { UpdateEstudianteDto } from './dto/update-estudiante.dto.js';

@Controller('estudiante')
@UsePipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }),
)
export class EstudianteController {
  constructor(private readonly estudianteService: EstudianteService) {}

  @Post()
  create(@Body() createEstudianteDto: CreateEstudianteDto) {
    return this.estudianteService.create(createEstudianteDto);
  }

  @Get()
  findAll() {
    return this.estudianteService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.estudianteService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEstudianteDto: UpdateEstudianteDto,
  ) {
    return this.estudianteService.update(id, updateEstudianteDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.estudianteService.remove(id);
  }
}
