import express from "express";
import { loginAdmin, registerAdmin } from "./auth-admin-controller";

const router = express.Router();

router.post("/login", loginAdmin);
router.post("/register", registerAdmin); // Included for initial seeding

export default router;
