import type { Request, Response } from "express";
import {
  getAllCursosModel,
  getCursoByIdModel,
  getDocenteByIdModel,
  createCursoModel,
  updateCursoModel,
  deleteCursoModel,
} from "../models/curso.model";
import { getAulaByIdModel } from "../models/aula.model";

export async function getCursos(req: Request, res: Response) {
  try {
    const cursos = await getAllCursosModel();
    res.status(200).json({ data: cursos });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      error: "error al obtener los cursos",
      details: error.message || error.mesagge,
    });
  }
}

export async function getCursoById(req: Request, res: Response) {
  const idBuscado = Number(req.params.id);
  try {
    const curso = await getCursoByIdModel(idBuscado);
    if (!curso) {
      return res
        .status(404)
        .json({ message: "el curso con este id no existe :C" });
    }
    res.status(200).json({
      status: "ok",
      data: curso,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      error: "error al obtener el curso",
      details: error.message || error.mesagge,
    });
  }
}

export async function createCurso(req: Request, res: Response) {
  const { nombreCurso, descripcion, duracionHoras, horario, docenteId, aulaId } = req.body;
  try {
    const docenteEncontrado = await getDocenteByIdModel(Number(docenteId));
    if (!docenteEncontrado) {
      return res.status(400).json({
        message: "no existe un docente con ese id",
      });
    }

    const aulaEncontrada = await getAulaByIdModel(Number(aulaId));
    if (!aulaEncontrada) {
      return res.status(400).json({
        message: "no existe un aula con ese id",
      });
    }

    const newCurso = await createCursoModel({
      nombreCurso,
      descripcion,
      duracionHoras: Number(duracionHoras),
      horario,
      docenteId: Number(docenteId),
      aulaId: Number(aulaId),
    });

    res.status(201).json({
      status: "ok",
      data: newCurso,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      error: "error al crear el curso",
      details: error.message || error.mesagge,
    });
  }
}

export async function putCurso(req: Request, res: Response) {
  const idBuscado = Number(req.params.id);
  const { nombreCurso, descripcion, duracionHoras, horario, docenteId, aulaId } = req.body;
  try {
    const cursoExistente = await getCursoByIdModel(idBuscado);
    if (!cursoExistente) {
      return res
        .status(404)
        .json({ message: "el curso con este id no existe :C" });
    }

    if (docenteId !== undefined) {
      const docenteEncontrado = await getDocenteByIdModel(Number(docenteId));
      if (!docenteEncontrado) {
        return res.status(400).json({
          message: "no existe un docente con ese id",
        });
      }
    }

    if (aulaId !== undefined) {
      const aulaEncontrada = await getAulaByIdModel(Number(aulaId));
      if (!aulaEncontrada) {
        return res.status(400).json({
          message: "no existe un aula con ese id",
        });
      }
    }

    const updateCurso = await updateCursoModel(idBuscado, {
      nombreCurso,
      descripcion,
      duracionHoras: duracionHoras !== undefined ? Number(duracionHoras) : undefined,
      horario,
      docenteId: docenteId !== undefined ? Number(docenteId) : undefined,
      aulaId: aulaId !== undefined ? Number(aulaId) : undefined,
    });

    res.status(200).json({
      message: "curso actualizado con exito",
      data: updateCurso,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      error: "error al actualizar el curso",
      details: error.message || error.mesagge,
    });
  }
}

export async function deleteCurso(req: Request, res: Response) {
  const idBuscado = Number(req.params.id);
  try {
    const cursoExistente = await getCursoByIdModel(idBuscado);
    if (!cursoExistente) {
      return res
        .status(404)
        .json({ message: "el curso con este id no existe :C" });
    }

    const cursoDelete = await deleteCursoModel(idBuscado);

    res.status(200).json({
      message: "curso eliminado con exito",
      data: cursoDelete,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      error: "error al eliminar el curso",
      details: error.message || error.mesagge,
    });
  }
}

export const updateCurso = putCurso;
