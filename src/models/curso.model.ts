import { prisma } from "../config/prisma";

export async function getAllCursosModel() {
  return await prisma.curso.findMany({
    orderBy: { id: "asc" },
    include: {
      docente: {
        select: {
          id: true,
          especialidad: true,
          user: {
            select: {
              nombres: true,
              apellidos: true,
              ecorreo: true,
            },
          },
        },
      },
      aula: true,
      matriculas: {
        select: {
          id: true,
          estado: true,
          estudiante: {
            select: {
              id: true,
              documentoIdentidad: true,
              user: {
                select: {
                  nombres: true,
                  apellidos: true,
                  ecorreo: true,
                },
              },
            },
          },
        },
      },
    }
  });
}

export async function getCursoByIdModel(id: number) {
  return await prisma.curso.findUnique({
    where: { id },
    include: {
      docente: {
        select: {
          id: true,
          especialidad: true,
          user: {
            select: {
              nombres: true,
              apellidos: true,
              ecorreo: true,
            },
          },
        },
      },
      aula: true,
      matriculas: {
        select: {
          id: true,
          estado: true,
          estudiante: {
            select: {
              id: true,
              documentoIdentidad: true,
              user: {
                select: {
                  nombres: true,
                  apellidos: true,
                  ecorreo: true,
                },
              },
            },
          },
        },
      },
    }
  });
}

export async function getDocenteByIdModel(id: number) {
  return await prisma.docente.findUnique({
    where: { id },
    include: { user: true },
  });
}

export async function createCursoModel(data: {
  nombreCurso: string;
  descripcion?: string | null;
  duracionHoras: number;
  horario: string;
  docenteId: number;
  aulaId: number;
}) {
  return await prisma.curso.create({
    data,
    include: {
      docente: true,
      aula: true,
    },
  });
}

export async function updateCursoModel(
  id: number,
  data: Partial<{
    nombreCurso: string;
    descripcion: string | null;
    duracionHoras: number;
    horario: string;
    docenteId: number;
    aulaId: number;
  }>
) {
  return await prisma.curso.update({
    where: { id },
    data,
    include: {
      docente: true,
      aula: true,
    },
  });
}

export async function deleteCursoModel(id: number) {
  return await prisma.curso.delete({
    where: { id },
  });
}
