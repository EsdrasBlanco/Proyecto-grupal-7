// src/matricula/matricula.service.ts

import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { EstadoMatricula, Prisma } from '../../generated/prisma/client.js';

@Injectable()
export class MatriculaService {
  constructor(private readonly prisma: PrismaService) {}

async findAll(params: {
  page?: number;
  limit?: number;
  estado?: string;
  cursoId?: number;
  buscar?: string;
}) {
  const page = params.page && params.page > 0 ? params.page : 1;
  const limit = params.limit && params.limit > 0 ? params.limit : 3;
  const skip = (page - 1) * limit;

  if (params.estado && !Object.values(EstadoMatricula).includes(params.estado as EstadoMatricula)) {
    throw new BadRequestException(
      `Estado inválido. Valores permitidos: ${Object.values(EstadoMatricula).join(', ')}`,
    );
  }

  const where: Prisma.MatriculaWhereInput = {
    ...(params.estado && { estado: params.estado as EstadoMatricula }),
    ...(params.cursoId && { cursoId: params.cursoId }),
    ...(params.buscar && {
      estudiante: {
        OR: [
          { documentoIdentidad: { contains: params.buscar, mode: 'insensitive' } },
          { user: { nombres: { contains: params.buscar, mode: 'insensitive' } } },
          { user: { apellidos: { contains: params.buscar, mode: 'insensitive' } } },
        ],
      },
    }),
  };

  const [totalRegistros, registros, cursoFiltrado] = await Promise.all([
    this.prisma.matricula.count({ where }),
    this.prisma.matricula.findMany({
      where,
      skip,
      take: limit,
      include: {
        estudiante: {
          include: {
            user: {
              select: { nombres: true, apellidos: true, ecorreo: true },
            },
          },
        },
        // Solo incluimos curso por fila si NO se filtró por cursoId
        ...(!params.cursoId && {
          curso: { select: { nombreCurso: true, horario: true } },
        }),
      },
      orderBy: { id: 'asc' },
    }),
    // Si se filtró por cursoId, traemos el curso UNA sola vez
    params.cursoId
      ? this.prisma.curso.findUnique({
          where: { id: params.cursoId },
          select: { id: true, nombreCurso: true, horario: true },
        })
      : Promise.resolve(null),
  ]);

  const totalPaginas = Math.ceil(totalRegistros / limit);

  return {
    meta: {
      totalRegistros,
      paginaActual: page,
      registrosPorPagina: limit,
      totalPaginas,
      tieneSiguiente: page < totalPaginas,
      tieneAnterior: page > 1,
      filtrosAplicados: {
        estado: params.estado ?? null,
        cursoId: params.cursoId ?? null,
        buscar: params.buscar ?? null,
      },
    },
    ...(cursoFiltrado && { curso: cursoFiltrado }), // Aparece una sola vez arriba
    data: registros.map((item) => ({
      id: item.id,
      estudianteId: item.estudianteId,
      ...(!params.cursoId && { curso: (item as any).curso?.nombreCurso }), // Texto plano compacto
      fechaInscripcion: item.fechaInscripcion,
      calificacionFinal: item.calificacionFinal,
      estado: item.estado,
      estudiante: {
        dni: item.estudiante.documentoIdentidad,
        nombreCompleto: `${item.estudiante.user.nombres} ${item.estudiante.user.apellidos}`,
        ecorreo: item.estudiante.user.ecorreo,
      },
    })),
  };
 }



  async findOne(id: number) {
    const matricula = await this.prisma.matricula.findUnique({
      where: { id },
      include: {
        estudiante: { include: { user: { select: { nombres: true, apellidos: true } } } },
        curso: { include: { aula: true } },
      },
    });
    if (!matricula) throw new NotFoundException(`Matrícula con ID ${id} no encontrada`);
    return matricula;
  }

  async create(data: { estudianteId: number; cursoId: number }) {
    // 1. Validar que el curso exista y verificar la capacidad de su aula
    const curso = await this.prisma.curso.findUnique({
      where: { id: data.cursoId },
      include: { aula: true, _count: { select: { matriculas: true } } },
    });

    if (!curso) throw new NotFoundException('El curso especificado no existe');

    if (curso._count.matriculas >= curso.aula.capacidad) {
      throw new BadRequestException(
        `El aula ${curso.aula.nombreAula} alcanzó su capacidad máxima (${curso.aula.capacidad} alumnos)`,
      );
    }

    // 2. Crear matrícula
    return this.prisma.matricula.create({
      data: {
        estudianteId: data.estudianteId,
        cursoId: data.cursoId,
      },
    });
  }

  async update(id: number, data: { calificacionFinal?: number; estado?: EstadoMatricula }) {
    await this.findOne(id); // Verifica que exista

    // Si envían nota pero no estado, calculamos APROBADO (>= 11) o REPROBADO (< 11)
    let estadoCalculado = data.estado;
    if (data.calificacionFinal !== undefined && !data.estado) {
      estadoCalculado = data.calificacionFinal >= 11 ? 'APROBADO' : 'REPROBADO';
    }

    return this.prisma.matricula.update({
      where: { id },
      data: {
        calificacionFinal: data.calificacionFinal,
        estado: estadoCalculado,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.matricula.delete({ where: { id } });
  }


  // ENDPOINT EXTRA: Dashboard de ocupación de aulas
async getReporteAulas() {
  const aulas = await this.prisma.aula.findMany({
    include: {
      cursos: {
        include: {
          _count: {
            select: {
              // Contamos alumnos activos (excluyendo RETIRADO)
              matriculas: {
                where: { estado: { not: 'RETIRADO' } },
              },
            },
          },
        },
      },
    },
    orderBy: { id: 'asc' },
  });

  const resumenAulas = aulas.map((aula) => {
    const totalInscritos = aula.cursos.reduce(
      (acumulado, curso) => acumulado + curso._count.matriculas,
      0,
    );
    const porcentajeNumerico = Number(((totalInscritos / aula.capacidad) * 100).toFixed(1));
    const cuposDisponibles = aula.capacidad - totalInscritos;

    let estadoOcupacion = 'DISPONIBLE';
    if (porcentajeNumerico >= 100) estadoOcupacion = 'LLENO';
    else if (porcentajeNumerico >= 75) estadoOcupacion = 'CASI LLENO';

    return {
      aulaId: aula.id,
      nombreAula: aula.nombreAula,
      ubicacion: aula.ubicacion,
      capacidadMaxima: aula.capacidad,
      totalInscritos,
      cuposDisponibles,
      porcentajeOcupacion: `${porcentajeNumerico}%`,
      estadoOcupacion,
      cursos: aula.cursos.map((c) => ({
        cursoId: c.id,
        nombreCurso: c.nombreCurso,
        horario: c.horario,
        inscritos: c._count.matriculas,
      })),
    };
  });

  // Totales generales de toda la academia
  const capacidadTotalAcademia = resumenAulas.reduce((sum, a) => sum + a.capacidadMaxima, 0);
  const inscritosTotalesAcademia = resumenAulas.reduce((sum, a) => sum + a.totalInscritos, 0);

  return {
    resumenGeneral: {
      totalAulas: resumenAulas.length,
      capacidadTotalAcademia,
      inscritosTotalesAcademia,
      ocupacionGlobal: `${((inscritosTotalesAcademia / capacidadTotalAcademia) * 100).toFixed(1)}%`,
    },
    aulas: resumenAulas,
  };
 }
}