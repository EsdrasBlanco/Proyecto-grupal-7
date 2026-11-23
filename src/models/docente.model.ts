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

export async function getAllDocentesModel() {
  return await prisma.docente.findMany({
    include: { user: { select: userSelect } },
    orderBy: { id: "asc" },
  });
}

export async function getDocenteByIdModel(id: number) {
  return await prisma.docente.findUnique({
    where: { id },
    include: { user: { select: userSelect }, cursos: true },
  });
}

export async function getDocenteByUserIdModel(userId: number) {
  return await prisma.docente.findUnique({ where: { userId } });
}

export async function createDocenteModel(data: { especialidad: string; userId: number }) {
  return await prisma.docente.create({ data });
}

export async function updateDocenteModel(id: number, data: { especialidad?: string }) {
  return await prisma.docente.update({ where: { id }, data });
}

export async function deleteDocenteModel(id: number) {
  return await prisma.docente.delete({ where: { id } });
}
