import bcrypt from "bcryptjs";
import { prisma } from "../config/prisma";

import type {
  CreateUserInput,
  UpdateUserInput,
  UpdateUserStatusInput,
} from "../schemas/user.schema";

// Registrar un usuario
export const createUser = async (data: CreateUserInput) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      ecorreo: data.ecorreo,
    },
  });

  if (existingUser) {
    throw new Error("El correo electrónico ya está registrado");
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const newUser = await prisma.user.create({
    data: {
      nombres: data.nombres,
      apellidos: data.apellidos,
      ecorreo: data.ecorreo,
      password: hashedPassword,
      telefono: data.telefono,
    },
    select: {
      id: true,
      nombres: true,
      apellidos: true,
      ecorreo: true,
      telefono: true,
      rol: true,
      activo: true,
      createdAt: true,
    },
  });

  return newUser;
};

// Consultar todos los usuarios
export const getUsers = async () => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      nombres: true,
      apellidos: true,
      ecorreo: true,
      telefono: true,
      rol: true,
      activo: true,
      createdAt: true,
    },
    orderBy: {
      id: "asc",
    },
  });

  return users;
};

// Consultar un usuario por ID
export const getUserById = async (id: number) => {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      nombres: true,
      apellidos: true,
      ecorreo: true,
      telefono: true,
      rol: true,
      activo: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new Error("Usuario no encontrado");
  }

  return user;
};

// Actualizar información de un usuario
export const updateUser = async (
  id: number,
  data: UpdateUserInput
) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!existingUser) {
    throw new Error("Usuario no encontrado");
  }

  // Validar que el correo no pertenezca a otro usuario
  if (data.ecorreo) {
    const userWithEmail = await prisma.user.findUnique({
      where: {
        ecorreo: data.ecorreo,
      },
    });

    if (userWithEmail && userWithEmail.id !== id) {
      throw new Error("El correo electrónico ya está registrado");
    }
  }

  const updatedUser = await prisma.user.update({
    where: {
      id,
    },
    data,
    select: {
      id: true,
      nombres: true,
      apellidos: true,
      ecorreo: true,
      telefono: true,
      rol: true,
      activo: true,
      createdAt: true,
    },
  });

  return updatedUser;
};

// Actualizar el estado de un usuario
export const updateUserStatus = async (
  id: number,
  data: UpdateUserStatusInput
) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!existingUser) {
    throw new Error("Usuario no encontrado");
  }

  const updatedUser = await prisma.user.update({
    where: {
      id,
    },
    data: {
      activo: data.activo,
    },
    select: {
      id: true,
      nombres: true,
      apellidos: true,
      ecorreo: true,
      telefono: true,
      rol: true,
      activo: true,
      createdAt: true,
    },
  });

  return updatedUser;
};