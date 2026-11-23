import { z } from "zod";

export const createCursoSchema = z.object({
  nombreCurso: z
    .string({ message: "el nombre del curso es obligatorio y debe ser un texto" })
    .trim()
    .min(3, "el nombre del curso debe tener al menos 3 caracteres")
    .max(120, "el nombre del curso debe tener como máximo 120 caracteres"),
  descripcion: z
    .string({ message: "la descripción debe ser un texto" })
    .trim()
    .optional()
    .nullable(),
  duracionHoras: z.coerce
    .number({ message: "la duración en horas es obligatoria y debe ser un número" })
    .int("la duración debe ser un número entero")
    .positive("la duración debe ser mayor a 0"),
  horario: z
    .string({ message: "el horario es obligatorio y debe ser un texto" })
    .trim()
    .min(3, "el horario debe tener al menos 3 caracteres")
    .max(100, "el horario debe tener como máximo 100 caracteres"),
  docenteId: z.coerce
    .number({ message: "el id del docente es obligatorio y debe ser un número" })
    .int("el id del docente debe ser un número entero")
    .positive("el id del docente debe ser positivo"),
  aulaId: z.coerce
    .number({ message: "el id del aula es obligatorio y debe ser un número" })
    .int("el id del aula debe ser un número entero")
    .positive("el id del aula debe ser positivo"),
});

export const updateCursoSchema = z.object({
  nombreCurso: z
    .string({ message: "el nombre del curso debe ser un texto" })
    .trim()
    .min(3, "el nombre del curso debe tener al menos 3 caracteres")
    .max(120, "el nombre del curso debe tener como máximo 120 caracteres")
    .optional(),
  descripcion: z
    .string({ message: "la descripción debe ser un texto" })
    .trim()
    .optional()
    .nullable(),
  duracionHoras: z.coerce
    .number({ message: "la duración en horas debe ser un número" })
    .int("la duración debe ser un número entero")
    .positive("la duración debe ser mayor a 0")
    .optional(),
  horario: z
    .string({ message: "el horario debe ser un texto" })
    .trim()
    .min(3, "el horario debe tener al menos 3 caracteres")
    .max(100, "el horario debe tener como máximo 100 caracteres")
    .optional(),
  docenteId: z.coerce
    .number({ message: "el id del docente debe ser un número" })
    .int("el id del docente debe ser un número entero")
    .positive("el id del docente debe ser positivo")
    .optional(),
  aulaId: z.coerce
    .number({ message: "el id del aula debe ser un número" })
    .int("el id del aula debe ser un número entero")
    .positive("el id del aula debe ser positivo")
    .optional(),
});

export type CreateCursoInput = z.infer<typeof createCursoSchema>;
export type UpdateCursoInput = z.infer<typeof updateCursoSchema>;
