import express from "express";
import { loginVa } from "./auth-va-controller";

const router = express.Router();

router.post("/login", loginVa);
// Note: VAs do not register themselves. Admin creates VAs.

export default router;
