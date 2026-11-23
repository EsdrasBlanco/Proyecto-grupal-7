import express, { Request, Response } from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { openApiSpec } from "./src/config/swagger";
import authRouter from "./src/routes/auth.route";
import userRoutes from "./src/routes/user.routes";
import aulaRoutes from "./src/routes/aula.routes";
import cursoRoutes from "./src/routes/curso.routes";
import estudianteRouter from "./src/routes/estudiante.route";
import docenteRouter from "./src/routes/docente.route";
import matriculaRouter from "./src/routes/matricula.route";

const app = express();

app.use(cors());
app.use(express.json());

// Estado del servidor
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ status: "ok" });
});

// DocumentaciÃ³n Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openApiSpec));

// Rutas de autenticaciÃ³n y mÃ³dulos
app.use("/api/auth", authRouter);
app.use("/api/users", userRoutes);
app.use("/users", userRoutes);
app.use("/api/aulas", aulaRoutes);
app.use("/api/cursos", cursoRoutes);
app.use("/api/estudiantes", estudianteRouter);
app.use("/api/docentes", docenteRouter);
app.use("/api/matriculas", matriculaRouter);
app.use("/matriculas", matriculaRouter);

export default app;
