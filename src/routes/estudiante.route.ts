import { Router } from "express";
import {
  getAllEstudiantes,
  getEstudianteById,
  createEstudiante,
  updateEstudiante,
  deleteEstudiante,
} from "../controllers/estudiante.controller";
import {
  validateCreateEstudiante,
  validateUpdateEstudiante,
  validateEstudianteId,
  verifyEstudianteExists,
} from "../middlewares/estudiante.middleware";
import { authenticate, authorizeRoles } from "../middlewares/auth.middleware";

const estudianteRouter = Router();

// GET /api/estudiantes - Listar todos los estudiantes
estudianteRouter.get(
  "/",
  authenticate,
  authorizeRoles("DOCENTE", "DIRECTOR"),
  getAllEstudiantes
);

// GET /api/estudiantes/:id - Obtener detalle de un estudiante y sus matrículas
estudianteRouter.get(
  "/:id",
  authenticate,
  authorizeRoles("ESTUDIANTE", "DOCENTE", "DIRECTOR"),
  validateEstudianteId,
  getEstudianteById
);

// POST /api/estudiantes - Crear un estudiante (Rol: DIRECTOR)
estudianteRouter.post(
  "/",
  authenticate,
  authorizeRoles("DIRECTOR"),
  validateCreateEstudiante,
  createEstudiante
);

// PUT /api/estudiantes/:id - Actualizar un estudiante (Rol: DIRECTOR)
estudianteRouter.put(
  "/:id",
  authenticate,
  authorizeRoles("DIRECTOR"),
  validateEstudianteId,
  verifyEstudianteExists,
  validateUpdateEstudiante,
  updateEstudiante
);

// PATCH /api/estudiantes/:id - Actualizar parcialmente un estudiante (Rol: DIRECTOR)
estudianteRouter.patch(
  "/:id",
  authenticate,
  authorizeRoles("DIRECTOR"),
  validateEstudianteId,
  verifyEstudianteExists,
  validateUpdateEstudiante,
  updateEstudiante
);

// DELETE /api/estudiantes/:id - Eliminar un estudiante (Rol: DIRECTOR)
estudianteRouter.delete(
  "/:id",
  authenticate,
  authorizeRoles("DIRECTOR"),
  validateEstudianteId,
  verifyEstudianteExists,
  deleteEstudiante
);

export default estudianteRouter;
