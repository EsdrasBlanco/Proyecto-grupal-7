import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../config/prisma";
import { CreateEstudianteInput, UpdateEstudianteInput } from "../schemas/estudiante.schema";

export const getAllEstudiantes = async (_req: Request, res: Response): Promise<void> => {
  try {
    const estudiantes = await prisma.estudiante.findMany({
      include: {
        user: {
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
        },
        matriculas: {
          include: {
            curso: true,
          },
        },
      },
      orderBy: { id: "asc" },
    });

    res.status(200).json(estudiantes);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener la lista de estudiantes",
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const getEstudianteById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);

    const estudiante = await prisma.estudiante.findUnique({
      where: { id },
      include: {
        user: {
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
        },
        matriculas: {
          include: {
            curso: {
              include: {
                docente: {
                  include: {
                    user: {
                      select: {
                        id: true,
                        nombres: true,
                        apellidos: true,
                        ecorreo: true,
                      },
                    },
                  },
                },
                aula: true,
              },
            },
          },
        },
      },
    });

    if (!estudiante) {
      res.status(404).json({ message: "Estudiante no encontrado" });
      return;
    }

    res.status(200).json(estudiante);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener el estudiante",
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const createEstudiante = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = req.body as CreateEstudianteInput;

    const existingDoc = await prisma.estudiante.findUnique({
      where: { documentoIdentidad: data.documentoIdentidad },
    });

    if (existingDoc) {
      res.status(409).json({
        message: "El documento de identidad ya está registrado por otro estudiante",
      });
      return;
    }

    let targetUserId = data.userId;

    if (targetUserId) {
      const user = await prisma.user.findUnique({
        where: { id: targetUserId },
        include: { estudiante: true, docente: true },
      });

      if (!user) {
        res.status(400).json({ message: "El usuario especificado (userId) no existe" });
        return;
      }

      if (user.estudiante) {
        res.status(409).json({ message: "Este usuario ya tiene un perfil de estudiante vinculado" });
        return;
      }
    } else {
      if (!data.nombres || !data.apellidos || !data.ecorreo || !data.password) {
        res.status(400).json({
          message:
            "Debe proporcionar un userId existente o los datos completos del usuario (nombres, apellidos, ecorreo, password)",
        });
        return;
      }

      const existingEmail = await prisma.user.findUnique({
        where: { ecorreo: data.ecorreo },
      });

      if (existingEmail) {
        res.status(409).json({ message: "El correo electrónico (ecorreo) ya está registrado" });
        return;
      }

      const hashedPassword = await bcrypt.hash(data.password, 10);
      const newUser = await prisma.user.create({
        data: {
          nombres: data.nombres,
          apellidos: data.apellidos,
          ecorreo: data.ecorreo,
          password: hashedPassword,
          telefono: data.telefono ?? null,
          rol: "ESTUDIANTE",
        },
      });
      targetUserId = newUser.id;
    }

    const nuevoEstudiante = await prisma.estudiante.create({
      data: {
        documentoIdentidad: data.documentoIdentidad,
        fechaNacimiento: data.fechaNacimiento ? new Date(data.fechaNacimiento) : null,
        userId: targetUserId,
      },
      include: {
        user: {
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
        },
      },
    });

    res.status(201).json(nuevoEstudiante);
  } catch (error) {
    res.status(500).json({
      message: "Error al crear el estudiante",
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const updateEstudiante = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const data = req.body as UpdateEstudianteInput;

    const estudianteActual = await prisma.estudiante.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!estudianteActual) {
      res.status(404).json({ message: "Estudiante no encontrado" });
      return;
    }

    if (
      data.documentoIdentidad &&
      data.documentoIdentidad !== estudianteActual.documentoIdentidad
    ) {
      const duplicateDoc = await prisma.estudiante.findUnique({
        where: { documentoIdentidad: data.documentoIdentidad },
      });
      if (duplicateDoc) {
        res.status(409).json({
          message: "El documento de identidad ya pertenece a otro estudiante",
        });
        return;
      }
    }

    if (data.ecorreo && data.ecorreo !== estudianteActual.user.ecorreo) {
      const duplicateEmail = await prisma.user.findUnique({
        where: { ecorreo: data.ecorreo },
      });
      if (duplicateEmail) {
        res.status(409).json({
          message: "El correo electrónico ya está en uso por otro usuario",
        });
        return;
      }
    }

    const estudianteActualizado = await prisma.estudiante.update({
      where: { id },
      data: {
        ...(data.documentoIdentidad !== undefined && {
          documentoIdentidad: data.documentoIdentidad,
        }),
        ...(data.fechaNacimiento !== undefined && {
          fechaNacimiento: data.fechaNacimiento ? new Date(data.fechaNacimiento) : null,
        }),
        user: {
          update: {
            ...(data.nombres !== undefined && { nombres: data.nombres }),
            ...(data.apellidos !== undefined && { apellidos: data.apellidos }),
            ...(data.ecorreo !== undefined && { ecorreo: data.ecorreo }),
            ...(data.telefono !== undefined && { telefono: data.telefono }),
            ...(data.activo !== undefined && { activo: data.activo }),
          },
        },
      },
      include: {
        user: {
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
        },
      },
    });

    res.status(200).json(estudianteActualizado);
  } catch (error) {
    res.status(500).json({
      message: "Error al actualizar el estudiante",
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const deleteEstudiante = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);

    const estudiante = await prisma.estudiante.findUnique({
      where: { id },
      include: { matriculas: true },
    });

    if (!estudiante) {
      res.status(404).json({ message: "Estudiante no encontrado" });
      return;
    }

    if (estudiante.matriculas.length > 0) {
      res.status(409).json({
        message: "No se puede eliminar el estudiante porque tiene matrículas registradas",
      });
      return;
    }

    await prisma.estudiante.delete({
      where: { id },
    });

    res.status(200).json({ message: "Estudiante eliminado correctamente" });
  } catch (error) {
    res.status(500).json({
      message: "Error al eliminar el estudiante",
      error: error instanceof Error ? error.message : error,
    });
  }
};
