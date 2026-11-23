import { z } from "zod";

export const createEstudianteSchema = z.object({
  documentoIdentidad: z
    .string({ message: "El documento de identidad es obligatorio" })
    .trim()
    .min(1, "El documento de identidad no puede estar vacío")
    .max(20, "El documento de identidad no puede exceder 20 caracteres"),
  fechaNacimiento: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Formato de fecha de nacimiento inválido (use YYYY-MM-DD)",
    })
    .optional()
    .nullable(),
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

export const updateEstudianteSchema = z.object({
  documentoIdentidad: z
    .string()
    .trim()
    .min(1, "El documento de identidad no puede estar vacío")
    .max(20, "El documento de identidad no puede exceder 20 caracteres")
    .optional(),
  fechaNacimiento: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Formato de fecha de nacimiento inválido (use YYYY-MM-DD)",
    })
    .optional()
    .nullable(),
  nombres: z.string().trim().min(1).max(100).optional(),
  apellidos: z.string().trim().min(1).max(100).optional(),
  ecorreo: z.string().trim().email("Correo electrónico inválido").max(100).optional(),
  telefono: z.string().trim().max(20).optional().nullable(),
  activo: z.boolean().optional(),
});

export const estudianteIdParamSchema = z.object({
  id: z.coerce
    .number({ message: "El ID debe ser numérico" })
    .int("El ID debe ser un número entero")
    .positive("El ID debe ser mayor a 0"),
});

export type CreateEstudianteInput = z.infer<typeof createEstudianteSchema>;
export type UpdateEstudianteInput = z.infer<typeof updateEstudianteSchema>;
