import { Router } from "express";
import {
  getAllDocentes,
  getDocenteById,
  getCursosByDocente,
  createDocente,
  updateDocente,
  deleteDocente,
} from "../controllers/docente.controller";
import {
  validateCreateDocente,
  validateUpdateDocente,
  validateDocenteId,
  verifyDocenteExists,
} from "../middlewares/docente.middleware";
import { authenticate, authorizeRoles } from "../middlewares/auth.middleware";

const docenteRouter = Router();

// GET /api/docentes - Listar todos los docentes (con filtro opcional ?especialidad=)
docenteRouter.get(
  "/",
  authenticate,
  authorizeRoles("ESTUDIANTE", "DOCENTE", "DIRECTOR"),
  getAllDocentes
);

// GET /api/docentes/:id - Obtener detalle de un docente
docenteRouter.get(
  "/:id",
  authenticate,
  authorizeRoles("ESTUDIANTE", "DOCENTE", "DIRECTOR"),
  validateDocenteId,
  getDocenteById
);

// GET /api/docentes/:id/cursos - Obtener los cursos asignados a un docente
docenteRouter.get(
  "/:id/cursos",
  authenticate,
  authorizeRoles("DOCENTE", "DIRECTOR"),
  validateDocenteId,
  getCursosByDocente
);

// POST /api/docentes - Registrar un nuevo docente (Rol: DIRECTOR)
docenteRouter.post(
  "/",
  authenticate,
  authorizeRoles("DIRECTOR"),
  validateCreateDocente,
  createDocente
);

// PUT /api/docentes/:id - Actualizar un docente (Rol: DIRECTOR)
docenteRouter.put(
  "/:id",
  authenticate,
  authorizeRoles("DIRECTOR"),
  validateDocenteId,
  verifyDocenteExists,
  validateUpdateDocente,
  updateDocente
);

// PATCH /api/docentes/:id - Actualizar parcialmente un docente (Rol: DIRECTOR)
docenteRouter.patch(
  "/:id",
  authenticate,
  authorizeRoles("DIRECTOR"),
  validateDocenteId,
  verifyDocenteExists,
  validateUpdateDocente,
  updateDocente
);

// DELETE /api/docentes/:id - Eliminar un docente (Rol: DIRECTOR)
docenteRouter.delete(
  "/:id",
  authenticate,
  authorizeRoles("DIRECTOR"),
  validateDocenteId,
  verifyDocenteExists,
  deleteDocente
);

export default docenteRouter;
