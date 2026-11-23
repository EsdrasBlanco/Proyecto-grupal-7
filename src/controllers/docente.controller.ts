import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../config/prisma";
import { CreateDocenteInput, UpdateDocenteInput } from "../schemas/docente.schema";

export const getAllDocentes = async (req: Request, res: Response): Promise<void> => {
  try {
    const especialidad =
      typeof req.query.especialidad === "string" ? req.query.especialidad.trim() : undefined;

    const docentes = await prisma.docente.findMany({
      where: especialidad
        ? {
            especialidad: {
              contains: especialidad,
              mode: "insensitive",
            },
          }
        : undefined,
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
        cursos: {
          include: {
            aula: true,
          },
        },
      },
      orderBy: { id: "asc" },
    });

    res.status(200).json(docentes);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener la lista de docentes",
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const getDocenteById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);

    const docente = await prisma.docente.findUnique({
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
        cursos: {
          include: {
            aula: true,
          },
        },
      },
    });

    if (!docente) {
      res.status(404).json({ message: "Docente no encontrado" });
      return;
    }

    res.status(200).json(docente);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener el docente",
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const getCursosByDocente = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);

    const docente = await prisma.docente.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            nombres: true,
            apellidos: true,
            ecorreo: true,
          },
        },
        cursos: {
          include: {
            aula: true,
            matriculas: {
              include: {
                estudiante: {
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
              },
            },
          },
        },
      },
    });

    if (!docente) {
      res.status(404).json({ message: "Docente no encontrado" });
      return;
    }

    res.status(200).json(docente);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener los cursos del docente",
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const createDocente = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = req.body as CreateDocenteInput;

    let targetUserId = data.userId;

    if (targetUserId) {
      const user = await prisma.user.findUnique({
        where: { id: targetUserId },
        include: { docente: true, estudiante: true },
      });

      if (!user) {
        res.status(400).json({ message: "El usuario especificado (userId) no existe" });
        return;
      }

      if (user.docente) {
        res.status(409).json({ message: "Este usuario ya tiene un perfil de docente vinculado" });
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
          rol: "DOCENTE",
        },
      });
      targetUserId = newUser.id;
    }

    const nuevoDocente = await prisma.docente.create({
      data: {
        especialidad: data.especialidad,
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

    res.status(201).json(nuevoDocente);
  } catch (error) {
    res.status(500).json({
      message: "Error al crear el docente",
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const updateDocente = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const data = req.body as UpdateDocenteInput;

    const docenteActual = await prisma.docente.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!docenteActual) {
      res.status(404).json({ message: "Docente no encontrado" });
      return;
    }

    if (data.ecorreo && data.ecorreo !== docenteActual.user.ecorreo) {
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

    const docenteActualizado = await prisma.docente.update({
      where: { id },
      data: {
        ...(data.especialidad !== undefined && { especialidad: data.especialidad }),
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

    res.status(200).json(docenteActualizado);
  } catch (error) {
    res.status(500).json({
      message: "Error al actualizar el docente",
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const deleteDocente = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);

    const docente = await prisma.docente.findUnique({
      where: { id },
      include: { cursos: true },
    });

    if (!docente) {
      res.status(404).json({ message: "Docente no encontrado" });
      return;
    }

    if (docente.cursos.length > 0) {
      res.status(409).json({
        message: "No se puede eliminar el docente porque tiene cursos asignados",
      });
      return;
    }

    await prisma.docente.delete({
      where: { id },
    });

    res.status(200).json({ message: "Docente eliminado correctamente" });
  } catch (error) {
    res.status(500).json({
      message: "Error al eliminar el docente",
      error: error instanceof Error ? error.message : error,
    });
  }
};
