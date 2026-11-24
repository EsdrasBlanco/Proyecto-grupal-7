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
import { DocenteService } from './docente.service.js';
import { CreateDocenteDto } from './dto/create-docente.dto.js';
import { UpdateDocenteDto } from './dto/update.docente.dto.js';

@Controller('docente')
@UsePipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }),
)
export class DocenteController {
  constructor(private readonly docenteService: DocenteService) {}

  @Post()
  create(@Body() createDocenteDto: CreateDocenteDto) {
    return this.docenteService.create(createDocenteDto);
  }

  @Get()
  findAll() {
    return this.docenteService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.docenteService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDocenteDto: UpdateDocenteDto,
  ) {
    return this.docenteService.update(id, updateDocenteDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.docenteService.remove(id);
  }
}