import { Request, Response, NextFunction } from "express";
import {
  createDocenteSchema,
  updateDocenteSchema,
  docenteIdParamSchema,
} from "../schemas/docente.schema";
import { validateBody, validateParams } from "./validate.middleware";
import { prisma } from "../config/prisma";

export const validateCreateDocente = validateBody(createDocenteSchema);
export const validateUpdateDocente = validateBody(updateDocenteSchema);
export const validateDocenteId = validateParams(docenteIdParamSchema);

export const verifyDocenteExists = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id) || id <= 0) {
      res.status(400).json({ message: "ID de docente inválido" });
      return;
    }

    const docente = await prisma.docente.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!docente) {
      res.status(404).json({ message: "Docente no encontrado" });
      return;
    }

    next();
  } catch (error) {
    res.status(500).json({
      message: "Error al verificar la existencia del docente",
      error: error instanceof Error ? error.message : error,
    });
  }
};
