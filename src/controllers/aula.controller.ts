import type { Request, Response } from "express";
import {
  getAllAulasModel,
  getAulaByIdModel,
  getAulaByNameModel,
  createAulaModel,
  updateAulaModel,
  deleteAulaModel,
} from "../models/aula.model";

export async function getAulas(req: Request, res: Response) {
  try {
    const aulas = await getAllAulasModel();
    res.status(200).json({ data: aulas });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      error: "error al obtener las aulas",
      details: error.message || error.mesagge,
    });
  }
}

export async function getAulaById(req: Request, res: Response) {
  const idBuscado = Number(req.params.id);
  try {
    const aula = await getAulaByIdModel(idBuscado);
    if (!aula) {
      return res
        .status(404)
        .json({ message: "el aula con este id no existe :C" });
    }
    res.status(200).json({
      status: "ok",
      data: aula,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      error: "error al obtener el aula",
      details: error.message || error.mesagge,
    });
  }
}

export async function createAula(req: Request, res: Response) {
  const { nombreAula, capacidad, ubicacion } = req.body;
  try {
    const aulaExistente = await getAulaByNameModel(nombreAula);

    if (aulaExistente) {
      return res.status(400).json({
        message: "el nombre de esta aula ya existe en otra que tenemos registrada",
      });
    }

    const newAula = await createAulaModel({
      nombreAula,
      capacidad: Number(capacidad),
      ubicacion,
    });
    res.status(201).json({
      status: "ok",
      data: newAula,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      error: "error al crear el aula",
      details: error.message || error.mesagge,
    });
  }
}

export async function putAula(req: Request, res: Response) {
  const idBuscado = Number(req.params.id);
  const { nombreAula, capacidad, ubicacion } = req.body;
  try {
    const aulaExistente = await getAulaByIdModel(idBuscado);
    if (!aulaExistente) {
      return res
        .status(404)
        .json({ message: "el aula con este id no existe :C" });
    }

    const updateAula = await updateAulaModel(idBuscado, {
      nombreAula,
      capacidad: capacidad !== undefined ? Number(capacidad) : undefined,
      ubicacion,
    });

    res.status(200).json({
      message: "aula actualizada con exito",
      data: updateAula,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      error: "error al actualizar el aula",
      details: error.message || error.mesagge,
    });
  }
}

export async function deleteAula(req: Request, res: Response) {
  const idBuscado = Number(req.params.id);
  try {
    const aulaExistente = await getAulaByIdModel(idBuscado);
    if (!aulaExistente) {
      return res
        .status(404)
        .json({ message: "el aula con este id no existe :C" });
    }

    const aulaDelete = await deleteAulaModel(idBuscado);

    res.status(200).json({
      message: "aula eliminada con exito",
      data: aulaDelete,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      error: "error al eliminar el aula",
      details: error.message || error.mesagge,
    });
  }
}

export const updateAula = putAula;
