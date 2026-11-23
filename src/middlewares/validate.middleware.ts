import { Request, Response, NextFunction } from "express";
import { ZodTypeAny, ZodError } from "zod";

export const validateBody = (schema: ZodTypeAny) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const error = result.error as ZodError;
      res.status(400).json({
        message: "Error de validación en el cuerpo de la petición",
        errors: error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        })),
      });
      return;
    }
    req.body = result.data;
    next();
  };
};

export const validateParams = (schema: ZodTypeAny) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.params);
    if (!result.success) {
      const error = result.error as ZodError;
      res.status(400).json({
        message: "Parámetros de ruta inválidos",
        errors: error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        })),
      });
      return;
    }
    next();
  };
};
