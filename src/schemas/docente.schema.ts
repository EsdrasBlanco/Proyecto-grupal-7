import { z } from "zod";

export const createDocenteSchema = z.object({
  especialidad: z
    .string({ message: "La especialidad es obligatoria" })
    .trim()
    .min(1, "La especialidad no puede estar vacía")
    .max(100, "La especialidad no puede exceder 100 caracteres"),
  userId: z
    .number({ message: "El userId debe ser un número entero" })
    .int("El userId debe ser un número entero")
    .positive("El userId debe ser un número positivo")
    .optional(),
  // Campos opcionales por si se desea crear el usuario al mismo tiempo
  nombres: z.string().trim().min(1).max(100).optional(),
  apellidos: z.string().trim().min(1).max(100).optional(),
  ecorreo: z.string().trim().email("Correo electrónico inválido").max(100).optional(),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres").max(255).optional(),
  telefono: z.string().trim().max(20).optional().nullable(),
});

export const updateDocenteSchema = z.object({
  especialidad: z
    .string()
    .trim()
    .min(1, "La especialidad no puede estar vacía")
    .max(100, "La especialidad no puede exceder 100 caracteres")
    .optional(),
  nombres: z.string().trim().min(1).max(100).optional(),
  apellidos: z.string().trim().min(1).max(100).optional(),
  ecorreo: z.string().trim().email("Correo electrónico inválido").max(100).optional(),
  telefono: z.string().trim().max(20).optional().nullable(),
  activo: z.boolean().optional(),
});

export const docenteIdParamSchema = z.object({
  id: z.coerce
    .number({ message: "El ID debe ser numérico" })
    .int("El ID debe ser un número entero")
    .positive("El ID debe ser mayor a 0"),
});

export type CreateDocenteInput = z.infer<typeof createDocenteSchema>;
export type UpdateDocenteInput = z.infer<typeof updateDocenteSchema>;
