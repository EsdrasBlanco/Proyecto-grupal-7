import type { Request, Response, NextFunction } from "express";

import {
  createUserSchema,
  updateUserSchema,
  updateUserStatusSchema,
  userIdSchema,
} from "../schemas/user.schema";

// Middleware para validar la creación de un usuario
export const validateCreateUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const result = createUserSchema.safeParse(req.body);

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

// Middleware para validar el ID del usuario
export const validateUserId = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const result = userIdSchema.safeParse(req.params);

  if (!result.success) {
    return res.status(400).json({
      message: "ID de usuario inválido",
      errors: result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
  }

  req.params.id = String(result.data.id);

  next();
};

// Middleware para validar la actualización de un usuario
export const validateUpdateUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const result = updateUserSchema.safeParse(req.body);

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

// Middleware para validar la actualización del estado de un usuario
export const validateUpdateUserStatus = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const result = updateUserStatusSchema.safeParse(req.body);

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