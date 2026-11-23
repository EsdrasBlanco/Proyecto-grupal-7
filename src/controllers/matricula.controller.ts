// src/controllers/matricula.controller.ts 
//import { prisma } from "../config/prisma";
import type { Request, Response } from "express";
import {
  getAllMatriculas,
  getMatriculasByAula,
  getMatriculaById,
  createMatricula,
  updateMatricula,
  deleteMatricula,
} from "../services/matricula.service";

// GET /api/matriculas
export const getMatriculasController = async (
  _req: Request,
  res: Response
) => {
  try {
    const matriculas = await getAllMatriculas();
    return res.status(200).json({
      message: "Matrículas obtenidas correctamente",
      data: matriculas,
    });
  } catch (error) {
    console.error("Error al consultar matrículas:", error);
    return res.status(500).json({
      message: "Error interno al consultar las matrículas",
    });
  }
};

// GET /api/matriculas/:id
export const getMatriculaByIdController = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ message: "El ID debe ser un número válido" });
    }

    const matricula = await getMatriculaById(id);
    return res.status(200).json({
      message: "Matrícula obtenida correctamente",
      data: matricula,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Matrícula no encontrada") {
      return res.status(404).json({ message: error.message });
    }
    console.error("Error al consultar matrícula:", error);
    return res.status(500).json({
      message: "Error interno al consultar la matrícula",
    });
  }
};

// POST /api/matriculas
export const createMatriculaController = async (
  req: Request,
  res: Response
) => {
  try {
    const matricula = await createMatricula(req.body);
    return res.status(201).json({
      message: "Matrícula registrada correctamente",
      data: matricula,
    });
  } catch (error) {
    if (error instanceof Error) {
      if (
        error.message === "El estudiante no existe" ||
        error.message === "El curso no existe"
      ) {
        return res.status(404).json({ message: error.message });
      }
      if (
        error.message ===
          "El estudiante ya se encuentra matriculado en este curso" ||
        error.message === "El curso ya alcanzó la capacidad máxima del aula"
      ) {
        return res.status(409).json({ message: error.message });
      }
    }
    console.error("Error al crear matrícula:", error);
    return res.status(500).json({
      message: "Error interno al registrar la matrícula",
    });
  }
};

// PATCH /api/matriculas/:id
export const updateMatriculaController = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ message: "El ID debe ser un número válido" });
    }

    const matricula = await updateMatricula(id, req.body);
    return res.status(200).json({
      message: "Matrícula actualizada correctamente",
      data: matricula,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Matrícula no encontrada") {
      return res.status(404).json({ message: error.message });
    }
    console.error("Error al actualizar matrícula:", error);
    return res.status(500).json({
      message: "Error interno al actualizar la matrícula",
    });
  }
};

// DELETE /api/matriculas/:id
export const deleteMatriculaController = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ message: "El ID debe ser un número válido" });
    }

    await deleteMatricula(id);
    return res.status(200).json({
      message: "Matrícula eliminada correctamente",
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Matrícula no encontrada") {
      return res.status(404).json({ message: error.message });
    }
    console.error("Error al eliminar matrícula:", error);
    return res.status(500).json({
      message: "Error interno al eliminar la matrícula",
    });
  }
};

// matriculas x aula // GET /api/matriculas/aula/:aulaId
export const getMatriculasByAulaController = async (
  req: Request,
  res: Response
) => {
  try {
    const aulaId = Number(req.params.aulaId);
    if (isNaN(aulaId) || aulaId <= 0) {
      return res
        .status(400)
        .json({ message: "El ID del aula debe ser un número válido" });
    }

    const matriculas = await getMatriculasByAula(aulaId);

    return res.status(200).json({
      message: "Matrículas por aula obtenidas correctamente",
      data: matriculas,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Aula no encontrada") {
      return res.status(404).json({ message: error.message });
    }
    console.error("Error al consultar matrículas por aula:", error);
    return res.status(500).json({
      message: "Error interno al consultar las matrículas por aula",
    });
  }
};
// fin - src/controllers/matricula.controller.ts 