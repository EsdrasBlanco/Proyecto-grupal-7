import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../config/prisma";
import { RoleType } from "../middlewares/auth.middleware";

const JWT_SECRET = process.env.JWT_SECRET || "proyecto-6ta-semana";
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN || "8h") as jwt.SignOptions["expiresIn"];

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nombres, apellidos, ecorreo, password, telefono, rol } = req.body;

    if (!nombres || !apellidos || !ecorreo || !password) {
      res.status(400).json({
        message: "Faltan campos obligatorios: nombres, apellidos, ecorreo, password",
      });
      return;
    }

    const existingUser = await prisma.user.findUnique({
      where: { ecorreo },
    });

    if (existingUser) {
      res.status(409).json({
        message: "El correo electrónico (ecorreo) ya está registrado",
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const validRoles: RoleType[] = ["ESTUDIANTE", "DOCENTE", "DIRECTOR"];
    // Solo un DIRECTOR autenticado puede asignar roles distintos de ESTUDIANTE
    const canAssignRole = req.user?.rol === "DIRECTOR";
    const userRole: RoleType =
      canAssignRole && validRoles.includes(rol) ? rol : "ESTUDIANTE";

    const newUser = await prisma.user.create({
      data: {
        nombres,
        apellidos,
        ecorreo,
        password: hashedPassword,
        telefono: telefono ?? null,
        rol: userRole,
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

    const token = jwt.sign(
      { id: newUser.id, ecorreo: newUser.ecorreo, rol: newUser.rol },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.status(201).json({
      message: "Usuario registrado exitosamente",
      token,
      user: newUser,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al registrar el usuario",
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { ecorreo, email, password } = req.body;
    const correo = ecorreo || email;

    if (!correo || !password) {
      res.status(400).json({
        message: "Debe proporcionar correo (ecorreo) y contraseña (password)",
      });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { ecorreo: correo },
      include: {
        estudiante: true,
        docente: true,
      },
    });

    if (!user || !user.activo) {
      res.status(401).json({
        message: "Credenciales inválidas o usuario inactivo",
      });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({
        message: "Credenciales inválidas",
      });
      return;
    }

    const token = jwt.sign(
      {
        id: user.id,
        ecorreo: user.ecorreo,
        rol: user.rol,
        estudianteId: user.estudiante?.id ?? null,
        docenteId: user.docente?.id ?? null,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    const { password: _pwd, ...userWithoutPassword } = user;

    res.status(200).json({
      message: "Inicio de sesión exitoso",
      token,
      user: userWithoutPassword,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al iniciar sesión",
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const me = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user || req.user.id === 0) {
      res.status(200).json({
        user: req.user ?? {
          id: 0,
          ecorreo: "admin@academia.edu",
          rol: "DIRECTOR",
          modo: "Desarrollo (permisos habilitados)",
        },
      });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        nombres: true,
        apellidos: true,
        ecorreo: true,
        telefono: true,
        rol: true,
        activo: true,
        createdAt: true,
        estudiante: true,
        docente: true,
      },
    });

    if (!user) {
      res.status(404).json({ message: "Usuario no encontrado" });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener el perfil del usuario",
      error: error instanceof Error ? error.message : error,
    });
  }
};
