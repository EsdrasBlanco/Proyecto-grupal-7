import { Router } from "express";
import {
  createUserController,
  getUsersController,
  getUserByIdController,
  updateUserController,
  updateUserStatusController,
} from "../controllers/user.controller";
import {
  validateCreateUser,
  validateUserId,
  validateUpdateUser,
  validateUpdateUserStatus,
} from "../middlewares/user.middleware";
import { authenticate, authorizeRoles } from "../middlewares/auth.middleware";

const router = Router();

// La gestión de usuarios es exclusiva del DIRECTOR
router.use(authenticate, authorizeRoles("DIRECTOR"));

// GET /users
router.get("/", getUsersController);

// POST /users
router.post("/", validateCreateUser, createUserController);

// GET /users/:id
router.get("/:id", validateUserId, getUserByIdController);

// PATCH /users/:id
router.patch("/:id", validateUserId, validateUpdateUser, updateUserController);

// PATCH /users/:id/status (activar / desactivar)
router.patch("/:id/status", validateUserId, validateUpdateUserStatus, updateUserStatusController);

export default router;
