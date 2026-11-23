import type { Request, Response } from "express";

import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  updateUserStatus,
} from "../services/user.service";

// POST /users
export const createUserController = async (
  req: Request,
  res: Response
) => {
  try {
    const user = await createUser(req.body);

    return res.status(201).json({
      message: "Usuario creado correctamente",
      data: user,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "El correo electrónico ya está registrado"
    ) {
      return res.status(409).json({
        message: error.message,
      });
    }

    console.error("Error al crear usuario:", error);

    return res.status(500).json({
      message: "Error interno al crear el usuario",
    });
  }
};

// GET /users
export const getUsersController = async (
  _req: Request,
  res: Response
) => {
  try {
    const users = await getUsers();

    return res.status(200).json({
      message: "Usuarios obtenidos correctamente",
      data: users,
    });
  } catch (error) {
    console.error("Error al consultar usuarios:", error);

    return res.status(500).json({
      message: "Error interno al consultar los usuarios",
    });
  }
};

// GET /users/:id
export const getUserByIdController = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    const user = await getUserById(id);

    return res.status(200).json({
      message: "Usuario obtenido correctamente",
      data: user,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "Usuario no encontrado"
    ) {
      return res.status(404).json({
        message: error.message,
      });
    }

    console.error("Error al consultar usuario:", error);

    return res.status(500).json({
      message: "Error interno al consultar el usuario",
    });
  }
};

// PATCH /users/:id
export const updateUserController = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    const user = await updateUser(id, req.body);

    return res.status(200).json({
      message: "Usuario actualizado correctamente",
      data: user,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "Usuario no encontrado"
    ) {
      return res.status(404).json({
        message: error.message,
      });
    }

    if (
      error instanceof Error &&
      error.message === "El correo electrónico ya está registrado"
    ) {
      return res.status(409).json({
        message: error.message,
      });
    }

    console.error("Error al actualizar usuario:", error);

    return res.status(500).json({
      message: "Error interno al actualizar el usuario",
    });
  }
};

// PATCH /users/:id/status
export const updateUserStatusController = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    const user = await updateUserStatus(id, req.body);

    return res.status(200).json({
      message: "Estado del usuario actualizado correctamente",
      data: user,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "Usuario no encontrado"
    ) {
      return res.status(404).json({
        message: error.message,
      });
    }

    console.error("Error al actualizar estado del usuario:", error);

    return res.status(500).json({
      message: "Error interno al actualizar el estado del usuario",
    });
  }
};