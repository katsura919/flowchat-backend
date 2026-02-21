import express from "express";
import { loginVa, getVaMe } from "./auth-va-controller";
import { verifyToken, requireVA } from "../../../middleware/auth-middleware";

const router = express.Router();

router.post("/login", loginVa);
router.get("/me", verifyToken, requireVA, getVaMe);
// Note: VAs do not register themselves. Admin creates VAs.

export default router;
