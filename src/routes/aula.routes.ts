import { Router } from "express";
import {
  createAula,
  deleteAula,
  getAulas,
  getAulaById,
  putAula,
} from "../controllers/aula.controller";
import { authenticate, authorizeRoles } from "../middlewares/auth.middleware";
import { validateBody } from "../middlewares/validate.middleware";
import { createAulaSchema, updateAulaSchema } from "../schemas/aula.schema";

const router = Router();

router.get("/", authenticate, authorizeRoles("ESTUDIANTE", "DOCENTE", "DIRECTOR"), getAulas);
router.get("/:id", authenticate, authorizeRoles("ESTUDIANTE", "DOCENTE", "DIRECTOR"), getAulaById);

router.post(
  "/",
  authenticate,
  authorizeRoles("DIRECTOR"),
  validateBody(createAulaSchema),
  createAula
);

router.put(
  "/:id",
  authenticate,
  authorizeRoles("DIRECTOR"),
  validateBody(updateAulaSchema),
  putAula
);

router.delete("/:id", authenticate, authorizeRoles("DIRECTOR"), deleteAula);

export default router;
