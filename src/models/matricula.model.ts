// src/models/matricula.model.ts 
import { prisma } from "../config/prisma";

export type EstadoMatricula =
  | "INSCRITO"
  | "APROBADO"
  | "REPROBADO"
  | "RETIRADO";

export interface CreateMatriculaData {
  estudianteId: number;
  cursoId: number;
}

export interface UpdateMatriculaData {
  calificacionFinal?: number;
  estado?: EstadoMatricula;
}

export const findAllMatriculas = async () => {
  return await prisma.matricula.findMany({
    include: {
      estudiante: {
        include: {
          user: {
            select: {
              nombres: true,
              apellidos: true,
              ecorreo: true,
            },
          },
        },
      },
      curso: {
        select: {
          nombreCurso: true,
          horario: true,
        },
      },
    },
    orderBy: { id: "asc" },
  });
};

export const findMatriculaById = async (id: number) => {
  return await prisma.matricula.findUnique({
    where: { id },
    include: {
      estudiante: {
        include: {
          user: {
            select: {
              nombres: true,
              apellidos: true,
              ecorreo: true,
            },
          },
        },
      },
      curso: true,
    },
  });
};

export const findEstudianteById = async (id: number) => {
  return await prisma.estudiante.findUnique({ where: { id } });
};

export const findCursoWithAulaById = async (id: number) => {
  return await prisma.curso.findUnique({
    where: { id },
    include: { aula: true },
  });
};

export const findMatriculaByEstudianteAndCurso = async (
  estudianteId: number,
  cursoId: number
) => {
  return await prisma.matricula.findUnique({
    where: {
      estudianteId_cursoId: { estudianteId, cursoId },
    },
  });
};

export const countInscritosByCurso = async (cursoId: number) => {
  return await prisma.matricula.count({
    where: { cursoId, estado: "INSCRITO" },
  });
};

export const insertMatricula = async (data: CreateMatriculaData) => {
  return await prisma.matricula.create({ data });
};

export const updateMatriculaById = async (
  id: number,
  data: UpdateMatriculaData
) => {
  return await prisma.matricula.update({
    where: { id },
    data: {
      ...(data.calificacionFinal !== undefined && {
        calificacionFinal: data.calificacionFinal,
      }),
      ...(data.estado && { estado: data.estado }),
    },
  });
};

export const deleteMatriculaById = async (id: number) => {
  return await prisma.matricula.delete({
    where: { id },
  });
};

// aula x id de matriculados

export const findAulaById = async (id: number) => {
  return await prisma.aula.findUnique({ where: { id } });
};

// aula, cursos (nombreCurso, descripcion, duracionHoras y horario una sola vez), 
// y dentro de cada curso la lista de sus matrículas/estudiantes
export const findMatriculasByAulaId = async (aulaId: number) => {
  return await prisma.aula.findUnique({
    where: { id: aulaId },
    include: {
      cursos: {
        select: {
          id: true,
          nombreCurso: true,
          descripcion: true,
          duracionHoras: true,
          horario: true,
          matriculas: {
            select: {
              id: true,
              estudianteId: true,
              fechaInscripcion: true,
              calificacionFinal: true,
              estado: true,
              estudiante: {
                select: {
                  id: true,
                  documentoIdentidad: true,
                  fechaNacimiento: true,
                  user: {
                    select: {
                      id: true,
                      nombres: true,
                      apellidos: true,
                      ecorreo: true,
                    },
                  },
                },
              },
            },
            orderBy: { id: "asc" },
          },
        },
        orderBy: { id: "asc" },
      },
    },
  });
};

/* anterior
export const findMatriculasByAulaId = async (aulaId: number) => {
  return await prisma.matricula.findMany({
    where: {
      curso: { aulaId },
    },
    include: {
      estudiante: {
        include: {
          user: {
            select: {
              id: true,
              nombres: true,
              apellidos: true,
              ecorreo: true,
            },
          },
        },
      },
      curso: {
        include: {
          aula: true,
        },
      },
    },
    orderBy: { id: "asc" },
  });
};*/

// fin - src/models/matricula.model.ts 