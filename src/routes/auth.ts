import express from "express";
import { register, login, refresh, logout } from "../controllers/auth";
import { validateWithJoi, registerSchema, loginSchema } from '../validations/auth.validation';

const router = express.Router();

// Using express-validator
// router.post("/register", [...validateRegister, handleValidationErrors], register);
// router.post("/login", [...validateLogin, handleValidationErrors], login);

// Using Joi validation
router.post("/register", validateWithJoi(registerSchema), register);
router.post("/login", validateWithJoi(loginSchema), login);

router.post("/refresh", refresh);
router.post("/logout", logout);

export { router };
