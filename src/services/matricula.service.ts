// src/services/matricula.service.ts 
import {
  findAulaById,
  findMatriculasByAulaId,
  findAllMatriculas,
  findMatriculaById,
  findEstudianteById,
  findCursoWithAulaById,
  findMatriculaByEstudianteAndCurso,
  countInscritosByCurso,
  insertMatricula,
  updateMatriculaById,
  deleteMatriculaById,
  type CreateMatriculaData,
  type UpdateMatriculaData,
} from "../models/matricula.model";

export const getAllMatriculas = async () => {
  return await findAllMatriculas();
};

export const getMatriculaById = async (id: number) => {
  const matricula = await findMatriculaById(id);

  if (!matricula) {
    throw new Error("Matrícula no encontrada");
  }

  return matricula;
};

export const createMatricula = async (data: CreateMatriculaData) => {
  const { estudianteId, cursoId } = data;

  const [estudiante, curso] = await Promise.all([
    findEstudianteById(estudianteId),
    findCursoWithAulaById(cursoId),
  ]);

  if (!estudiante) {
    throw new Error("El estudiante no existe");
  }

  if (!curso) {
    throw new Error("El curso no existe");
  }

  const yaMatriculado = await findMatriculaByEstudianteAndCurso(
    estudianteId,
    cursoId
  );

  if (yaMatriculado) {
    throw new Error("El estudiante ya se encuentra matriculado en este curso");
  }

  const inscritos = await countInscritosByCurso(cursoId);

  if (inscritos >= curso.aula.capacidad) {
    throw new Error("El curso ya alcanzó la capacidad máxima del aula");
  }

  return await insertMatricula({ estudianteId, cursoId });
};

export const updateMatricula = async (
  id: number,
  data: UpdateMatriculaData
) => {
  const existe = await findMatriculaById(id);

  if (!existe) {
    throw new Error("Matrícula no encontrada");
  }

  return await updateMatriculaById(id, data);
};

export const deleteMatricula = async (id: number) => {
  const existe = await findMatriculaById(id);

  if (!existe) {
    throw new Error("Matrícula no encontrada");
  }

  return await deleteMatriculaById(id);
};

// matriculados x aula
export const getMatriculasByAula = async (aulaId: number) => {
  const aulaConMatriculas = await findMatriculasByAulaId(aulaId);

  if (!aulaConMatriculas) {
    throw new Error("Aula no encontrada");
  }

  return aulaConMatriculas;
};
// fin - src/services/matricula.service.ts 