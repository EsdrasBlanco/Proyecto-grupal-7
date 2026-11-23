import { Router } from "express";
import {
  createCurso,
  deleteCurso,
  getCursos,
  getCursoById,
  putCurso,
} from "../controllers/curso.controller";
import { authenticate, authorizeRoles } from "../middlewares/auth.middleware";
import { validateBody } from "../middlewares/validate.middleware";
import { createCursoSchema, updateCursoSchema } from "../schemas/curso.schema";

const router = Router();

router.get("/", authenticate, authorizeRoles("ESTUDIANTE", "DOCENTE", "DIRECTOR"), getCursos);
router.get("/:id", authenticate, authorizeRoles("ESTUDIANTE", "DOCENTE", "DIRECTOR"), getCursoById);

router.post(
  "/",
  authenticate,
  authorizeRoles("DIRECTOR"),
  validateBody(createCursoSchema),
  createCurso
);

router.put(
  "/:id",
  authenticate,
  authorizeRoles("DIRECTOR"),
  validateBody(updateCursoSchema),
  putCurso
);

router.delete("/:id", authenticate, authorizeRoles("DIRECTOR"), deleteCurso);

export default router;
