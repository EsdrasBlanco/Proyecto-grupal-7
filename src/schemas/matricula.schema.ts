// src/schemas/matricula.schema.ts
import { z } from "zod";

export const createMatriculaSchema = z.object({
  estudianteId: z
    .number({ message: "El ID del estudiante debe ser un número" })
    .int("El ID del estudiante debe ser entero")
    .positive("El ID del estudiante debe ser positivo"),
  cursoId: z
    .number({ message: "El ID del curso debe ser un número" })
    .int("El ID del curso debe ser entero")
    .positive("El ID del curso debe ser positivo"),
});

export const updateMatriculaSchema = z.object({
  calificacionFinal: z
    .number({ message: "La calificación debe ser un número" })
    .min(0, "La calificación mínima es 0")
    .max(20, "La calificación máxima es 20")
    .optional(),
  estado: z
    .enum(["INSCRITO", "APROBADO", "REPROBADO", "RETIRADO"], {
      message: "Estado inválido. Debe ser INSCRITO, APROBADO, REPROBADO o RETIRADO",
    })
    .optional(),
});