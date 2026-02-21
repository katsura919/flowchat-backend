import express from "express";
import { loginAdmin, registerAdmin, getAdminMe } from "./auth-admin-controller";
import { verifyToken, requireAdmin } from "../../../middleware/auth-middleware";

const router = express.Router();

router.post("/login", loginAdmin);
router.post("/register", registerAdmin); // Included for initial seeding
router.get("/me", verifyToken, requireAdmin, getAdminMe);

export default router;
