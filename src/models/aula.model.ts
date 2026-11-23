import { prisma } from "../config/prisma";

export async function getAllAulasModel() {
  return await prisma.aula.findMany({
    orderBy: { id: "asc" },
    include: {
      cursos: {
        select: {
          id: true,
          nombreCurso: true,
          horario: true,
          duracionHoras: true,
          docente: {
            select: {
              id: true,
              especialidad: true,
              user: {
                select: {
                  nombres: true,
                  apellidos: true,
                },
              },
            },
          },
        },
      }
    }
  });
}

export async function getAulaByIdModel(id: number) {
  return await prisma.aula.findUnique({
    where: { id },
    include: {
      cursos: {
        select: {
          id: true,
          nombreCurso: true,
          horario: true,
          duracionHoras: true,
          docente: {
            select: {
              id: true,
              especialidad: true,
              user: {
                select: {
                  nombres: true,
                  apellidos: true,
                },
              },
            },
          },
        },
      }
    }
  });
}

export async function getAulaByNameModel(nombreAula: string) {
  return await prisma.aula.findUnique({
    where: { nombreAula },
  });
}

export async function createAulaModel(data: {
  nombreAula: string;
  capacidad: number;
  ubicacion?: string | null;
}) {
  return await prisma.aula.create({
    data,
  });
}

export async function updateAulaModel(
  id: number,
  data: {
    nombreAula?: string;
    capacidad?: number;
    ubicacion?: string | null;
  }
) {
  return await prisma.aula.update({
    where: { id },
    data,
  });
}

export async function deleteAulaModel(id: number) {
  return await prisma.aula.delete({
    where: { id },
  });
}
