// src/routes/matricula.route.ts modificado por otro usuario
// src/routes/matricula.route.ts
import { Router } from "express";
import { authenticate, authorizeRoles } from "../middlewares/auth.middleware";
import {
  getMatriculasController,
  getMatriculaByIdController,
  getMatriculasByAulaController,
  createMatriculaController,
  updateMatriculaController,
  deleteMatriculaController,
} from "../controllers/matricula.controller";
import {
  validateCreateMatricula,
  validateUpdateMatricula,
} from "../middlewares/matricula.middleware";

const matriculaRouter = Router();

matriculaRouter.get( "/",              authenticate,
  authorizeRoles("ESTUDIANTE", "DOCENTE", "DIRECTOR"),
  getMatriculasController);

matriculaRouter.get( "/aula/:aulaId",  authenticate,
  authorizeRoles("ESTUDIANTE", "DOCENTE", "DIRECTOR"),
  getMatriculasByAulaController);

matriculaRouter.get( "/:id",           authenticate,
  authorizeRoles("ESTUDIANTE", "DOCENTE", "DIRECTOR"),
  getMatriculaByIdController);

matriculaRouter.post("/",              authenticate,
  authorizeRoles("ESTUDIANTE", "DIRECTOR"),
  validateCreateMatricula,   createMatriculaController);

matriculaRouter.patch( "/:id",         authenticate,
  authorizeRoles("DOCENTE", "DIRECTOR"),
  validateUpdateMatricula,   updateMatriculaController);

matriculaRouter.delete( "/:id",        authenticate,
  authorizeRoles("DIRECTOR"),
  deleteMatriculaController);

export default matriculaRouter;
// fin - src/routes/matricula.route.ts 