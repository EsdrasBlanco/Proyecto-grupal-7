import { Router } from "express";
import { register, login, me } from "../controllers/auth.controller";
import { authenticate, optionalAuthenticate } from "../middlewares/auth.middleware";

const authRouter = Router();

// Público. Si quien registra es DIRECTOR (con token), puede asignar el rol.
authRouter.post("/register", optionalAuthenticate, register);
authRouter.post("/login", login);
authRouter.get("/me", authenticate, me);

export default authRouter;
