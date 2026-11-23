import { z } from "zod";

export const createAulaSchema = z.object({
  nombreAula: z
    .string({ message: "el nombre del aula es obligatorio y debe ser un texto" })
    .trim()
    .min(2, "el nombre del aula debe tener al menos 2 caracteres")
    .max(50, "el nombre del aula debe tener como máximo 50 caracteres"),
  capacidad: z.coerce
    .number({ message: "la capacidad es obligatoria y debe ser un número" })
    .int("la capacidad debe ser un número entero")
    .positive("la capacidad debe ser mayor a 0"),
  ubicacion: z
    .string({ message: "la ubicación debe ser un texto" })
    .trim()
    .max(100, "la ubicación no puede superar los 100 caracteres")
    .optional()
    .nullable(),
});

export const updateAulaSchema = z.object({
  nombreAula: z
    .string({ message: "el nombre del aula debe ser un texto" })
    .trim()
    .min(2, "el nombre del aula debe tener al menos 2 caracteres")
    .max(50, "el nombre del aula debe tener como máximo 50 caracteres")
    .optional(),
  capacidad: z.coerce
    .number({ message: "la capacidad debe ser un número" })
    .int("la capacidad debe ser un número entero")
    .positive("la capacidad debe ser mayor a 0")
    .optional(),
  ubicacion: z
    .string({ message: "la ubicación debe ser un texto" })
    .trim()
    .max(100, "la ubicación no puede superar los 100 caracteres")
    .optional()
    .nullable(),
});

export type CreateAulaInput = z.infer<typeof createAulaSchema>;
export type UpdateAulaInput = z.infer<typeof updateAulaSchema>;
