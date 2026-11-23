import { z } from "zod";

// Schema para crear un usuario
export const createUserSchema = z
  .object({
    nombres: z
      .string()
      .trim()
      .min(1, "Los nombres son obligatorios")
      .max(100, "Los nombres no pueden superar 100 caracteres"),

    apellidos: z
      .string()
      .trim()
      .min(1, "Los apellidos son obligatorios")
      .max(100, "Los apellidos no pueden superar 100 caracteres"),

    ecorreo: z
      .string()
      .trim()
      .email("El correo electrónico no es válido")
      .max(100, "El correo no puede superar 100 caracteres")
      .toLowerCase(),

    password: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .refine(
        (value) => Buffer.byteLength(value, "utf8") <= 72,
        "La contraseña supera el límite permitido"
      ),

    telefono: z
      .string()
      .trim()
      .max(20, "El teléfono no puede superar 20 caracteres")
      .optional(),
  })
  .strict();

// Schema para actualizar un usuario
export const updateUserSchema = z
  .object({
    nombres: z
      .string()
      .trim()
      .min(1, "Los nombres no pueden estar vacíos")
      .max(100, "Los nombres no pueden superar 100 caracteres")
      .optional(),

    apellidos: z
      .string()
      .trim()
      .min(1, "Los apellidos no pueden estar vacíos")
      .max(100, "Los apellidos no pueden superar 100 caracteres")
      .optional(),

    ecorreo: z
      .string()
      .trim()
      .email("El correo electrónico no es válido")
      .max(100, "El correo no puede superar 100 caracteres")
      .toLowerCase()
      .optional(),

    telefono: z
      .string()
      .trim()
      .max(20, "El teléfono no puede superar 20 caracteres")
      .nullable()
      .optional(),
  })
  .strict()
  .refine(
    (data) => Object.keys(data).length > 0,
    "Debe proporcionar al menos un campo para actualizar"
  );

// Schema para actualizar el estado de un usuario
export const updateUserStatusSchema = z
  .object({
    activo: z.boolean(),
  })
  .strict();

// Schema para validar el ID del usuario
export const userIdSchema = z
  .object({
    id: z.coerce
      .number()
      .int("El ID debe ser un número entero")
      .positive("El ID debe ser mayor que cero"),
  })
  .strict();

// Tipos derivados de los schemas
export type CreateUserInput = z.infer<typeof createUserSchema>;

export type UpdateUserInput = z.infer<typeof updateUserSchema>;

export type UpdateUserStatusInput = z.infer<
  typeof updateUserStatusSchema
>;

export type UserIdInput = z.infer<typeof userIdSchema>;