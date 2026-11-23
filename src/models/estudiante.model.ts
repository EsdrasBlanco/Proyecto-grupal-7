import { prisma } from "../config/prisma";

const userSelect = {
  id: true,
  nombres: true,
  apellidos: true,
  ecorreo: true,
  telefono: true,
  rol: true,
  activo: true,
} as const;

export async function getAllEstudiantesModel() {
  return await prisma.estudiante.findMany({
    include: { user: { select: userSelect } },
    orderBy: { id: "asc" },
  });
}

export async function getEstudianteByIdModel(id: number) {
  return await prisma.estudiante.findUnique({
    where: { id },
    include: {
      user: { select: userSelect },
      matriculas: { include: { curso: true } },
    },
  });
}

export async function getEstudianteByDocumentoModel(documentoIdentidad: string) {
  return await prisma.estudiante.findUnique({ where: { documentoIdentidad } });
}

export async function createEstudianteModel(data: {
  documentoIdentidad: string;
  fechaNacimiento?: Date | null;
  userId: number;
}) {
  return await prisma.estudiante.create({ data });
}

export async function updateEstudianteModel(
  id: number,
  data: { documentoIdentidad?: string; fechaNacimiento?: Date | null }
) {
  return await prisma.estudiante.update({ where: { id }, data });
}

export async function deleteEstudianteModel(id: number) {
  return await prisma.estudiante.delete({ where: { id } });
}
