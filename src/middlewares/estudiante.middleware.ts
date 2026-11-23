import { Request, Response, NextFunction } from "express";
import {
  createEstudianteSchema,
  updateEstudianteSchema,
  estudianteIdParamSchema,
} from "../schemas/estudiante.schema";
import { validateBody, validateParams } from "./validate.middleware";
import { prisma } from "../config/prisma";

export const validateCreateEstudiante = validateBody(createEstudianteSchema);
export const validateUpdateEstudiante = validateBody(updateEstudianteSchema);
export const validateEstudianteId = validateParams(estudianteIdParamSchema);

export const verifyEstudianteExists = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id) || id <= 0) {
      res.status(400).json({ message: "ID de estudiante inválido" });
      return;
    }

    const estudiante = await prisma.estudiante.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!estudiante) {
      res.status(404).json({ message: "Estudiante no encontrado" });
      return;
    }

    next();
  } catch (error) {
    res.status(500).json({
      message: "Error al verificar la existencia del estudiante",
      error: error instanceof Error ? error.message : error,
    });
  }
};
