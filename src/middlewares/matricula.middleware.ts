// src/middlewares/matricula.middleware.ts
import type { Request, Response, NextFunction } from "express";
import {
  createMatriculaSchema,
  updateMatriculaSchema,
} from "../schemas/matricula.schema";

export const validateCreateMatricula = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const result = createMatriculaSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      message: "Error de validación",
      errors: result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
  }

  req.body = result.data;
  next();
};

export const validateUpdateMatricula = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const result = updateMatriculaSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      message: "Error de validación",
      errors: result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
  }

  req.body = result.data;
  next();
};
